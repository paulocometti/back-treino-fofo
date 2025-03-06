import { WorkoutHistory } from "./entities/workout-history";

export interface CategoryGatewayDashboardOuputDto {
    id?: string;
};

export interface WorkoutHistoryGateway {
    insert(dto: WorkoutHistory): Promise<WorkoutHistory | null>;
    dashboard(user_id: string): Promise<any>;
};
