import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";
import { DeleteWorkoutPlanUsecase, DeleteWorkoutPlanUsecaseInputDto } from "../../../../../usecases/workout-plan/delete-workout-plan/delete-workout-plan.usecase";

export class DeleteWorkoutPlanRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteWorkoutPlanService: DeleteWorkoutPlanUsecase
    ) { }

    public static create(deleteWorkoutPlanService: DeleteWorkoutPlanUsecase) {
        return new DeleteWorkoutPlanRoute(
            "/workout-plan/:id",
            HttpMethod.DELETE,
            deleteWorkoutPlanService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { id } = request.params;
                const input: DeleteWorkoutPlanUsecaseInputDto = { id };
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                await this.deleteWorkoutPlanService.execute(input, user);
                response.status(200).json({ message: "Sucesso ao remover Plano de Treino." });
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
