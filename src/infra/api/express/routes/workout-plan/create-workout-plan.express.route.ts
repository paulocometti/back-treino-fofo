import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateWorkoutPlanUsecase, CreateWorkoutPlanUsecaseInputDto } from "../../../../../usecases/workout-plan/create-workout-plan/create-workout-plan.usecase";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

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
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
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
