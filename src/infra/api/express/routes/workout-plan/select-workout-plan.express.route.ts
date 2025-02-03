import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { SelectWorkoutPlanUsecase, SelectWorkoutPlanUsecaseInputDto } from "../../../../../usecases/workout-plan/select-workout-plan/select-workout-plan.usecase";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

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
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
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
