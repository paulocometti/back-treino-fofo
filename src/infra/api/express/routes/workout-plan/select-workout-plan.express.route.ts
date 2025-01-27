import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { SelectWorkoutPlanUsecase, SelectWorkoutPlanUsecaseInputDto, SelectWorkoutPlanUsecaseUserInputDto } from "../../../../../usecases/workout-plan/select-workout-plan/select-workout-plan.usecase";

export class SelectWorkoutPlanRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly selectWorkoutPlanService: SelectWorkoutPlanUsecase
    ) { }

    public static create(selectWorkoutPlanService: SelectWorkoutPlanUsecase) {
        return new SelectWorkoutPlanRoute(
            "/workout-plan/:id",
            HttpMethod.GET,
            selectWorkoutPlanService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { id } = request.params;
                const input: SelectWorkoutPlanUsecaseInputDto = { id };
                const userAdminFake: SelectWorkoutPlanUsecaseUserInputDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: SelectWorkoutPlanUsecaseUserInputDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userAdminFake;
                const result = await this.selectWorkoutPlanService.execute(input, user);
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
