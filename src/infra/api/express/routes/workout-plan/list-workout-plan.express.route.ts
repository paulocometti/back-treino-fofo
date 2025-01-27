import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { ListWorkoutPlanUsecase, ListWorkoutPlanUsecaseUserInputDto } from "../../../../../usecases/workout-plan/list-workout-plan/list-workout-plan.usecase";

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
                const userAdminFake: ListWorkoutPlanUsecaseUserInputDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: ListWorkoutPlanUsecaseUserInputDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userFake;
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
