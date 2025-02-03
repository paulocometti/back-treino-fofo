import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { ListWorkoutPlanUsecase } from "../../../../../usecases/workout-plan/list-workout-plan/list-workout-plan.usecase";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

export class ListWorkoutPlanRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly selectWorkoutPlanService: ListWorkoutPlanUsecase
    ) { }

    public static create(selectWorkoutPlanService: ListWorkoutPlanUsecase) {
        return new ListWorkoutPlanRoute(
            "/workout-plan/list",
            HttpMethod.GET,
            selectWorkoutPlanService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.selectWorkoutPlanService.execute(undefined, user);
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
