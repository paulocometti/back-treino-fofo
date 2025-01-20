import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateWorkoutPlanUsecase, CreateWorkoutPlanUsecaseInputDto, CreateWorkoutPlanUsecaseUserInputDto } from "../../../../../usecases/workout-plan/create-workout-plan/create-workout-plan.usecase";

export class CreateWorkoutPlanRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createWorkoutPlanService: CreateWorkoutPlanUsecase
    ) { }

    public static create(createWorkoutPlanService: CreateWorkoutPlanUsecase) {
        return new CreateWorkoutPlanRoute(
            "/workout-plan/create",
            HttpMethod.POST,
            createWorkoutPlanService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { name, workoutDays } = request.body;
                const input: CreateWorkoutPlanUsecaseInputDto = { name, workoutDays };
                const userAdminFake: CreateWorkoutPlanUsecaseUserInputDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: CreateWorkoutPlanUsecaseUserInputDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userAdminFake;
                const result = await this.createWorkoutPlanService.execute(input, user);
                response.status(201).json(result);
            } catch (error: any) {
                response.status(500).json({ message: error?.message || "Error Interno do Servidor." });
            };
        };
    };

    public getPath(): string {
        return this.path;
    };

    public getMethod(): HttpMethod {
        return this.method;
    };

};
