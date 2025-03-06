import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";
import { CreateWorkoutHistoryUsecase, CreateWorkoutHistoryUsecaseInputDto, CreateWorkoutHistoryUsecaseOutputDto } from "../../../../../usecases/workout-history/create-workout-history/create-workout-history.usecase";

export class CreateWorkoutHistoryRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createWorkoutHistoryService: CreateWorkoutHistoryUsecase
    ) { }

    public static create(createWorkoutHistoryService: CreateWorkoutHistoryUsecase) {
        return new CreateWorkoutHistoryRoute(
            "/workout-history/create",
            HttpMethod.POST,
            createWorkoutHistoryService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { created_date, workout_plan_id, workout_day_id, duration, observation } = request.body;
                const input: CreateWorkoutHistoryUsecaseInputDto = { created_date, workout_plan_id, workout_day_id, duration, observation };
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result: CreateWorkoutHistoryUsecaseOutputDto = await this.createWorkoutHistoryService.execute(input, user);
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
