import { WorkoutPlan } from "./entities/workout-plan";

export interface WorkoutPlanGatewaySelectInputDTO {
    id: string;
    user_id: string | null;
};

export interface WorkoutPlanGatewayListInputDTO {
    user_id?: string | null;
};

export interface WorkoutPlanGateway {
    insert(dto: WorkoutPlan): Promise<WorkoutPlan | null>;
    //update(dto: WorkoutPlan): Promise<WorkoutPlan | null>;
    select(dto: WorkoutPlanGatewaySelectInputDTO): Promise<WorkoutPlan | null>;
    list(dto: WorkoutPlanGatewayListInputDTO): Promise<WorkoutPlan[]>;
};
