import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";
import { DashboardWorkoutHistoryUsecase, DashboardWorkoutHistoryUsecaseInputDto, DashboardWorkoutHistoryUsecaseOutputDto } from "../../../../../usecases/workout-history/dashboard-workout-history/dashboard-workout-history.usecase";

export class DashboardWorkoutHistoryRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly dashboardWorkoutHistoryService: DashboardWorkoutHistoryUsecase
    ) { }

    public static create(dashboardWorkoutHistoryService: DashboardWorkoutHistoryUsecase) {
        return new DashboardWorkoutHistoryRoute(
            "/workout-history/dashboard",
            HttpMethod.GET,
            dashboardWorkoutHistoryService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { timezone } = request.query;
                const timezoneStr = typeof timezone === 'string' ? timezone : undefined;
                const input: DashboardWorkoutHistoryUsecaseInputDto = { timezone: timezoneStr };
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result: DashboardWorkoutHistoryUsecaseOutputDto = await this.dashboardWorkoutHistoryService.execute(input, user);
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
