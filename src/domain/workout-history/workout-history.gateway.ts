import { WorkoutHistory } from "./entities/workout-history";

export interface CategoryGatewayDashboardOuputDto {
    id?: string;
};

export interface WorkoutHistoryGateway {
    insert(dto: WorkoutHistory): Promise<WorkoutHistory | null>;
    select(user_id: string, past_days: number): Promise<any>;
};
