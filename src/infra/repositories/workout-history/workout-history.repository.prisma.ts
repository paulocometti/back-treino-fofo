import { PrismaClient } from "@prisma/client";
import { WorkoutHistoryGateway } from "../../../domain/workout-history/workout-history.gateway";
import { WorkoutHistory } from "../../../domain/workout-history/entities/workout-history";

export class WorkoutHistoryRepositoryPrisma implements WorkoutHistoryGateway {

    private constructor(private readonly prismaClient: PrismaClient) { }

    public static create(prismaClient: PrismaClient) {
        return new WorkoutHistoryRepositoryPrisma(prismaClient);
    };

    public async insert(input: WorkoutHistory): Promise<WorkoutHistory | null> {
        const { id, user_id, created_date, workout_plan, workout_day, workout_categories, workout_count_exercises, duration, observation} = input;
        const data = { id, user_id, created_date, workout_plan, workout_day, workout_categories, workout_count_exercises, duration, observation };
        const result = await this.prismaClient.workoutHistory.create({ data });
        const output = WorkoutHistory.with(result);
        if (output === null) return null;
        return output;
    };

    public async dashboard(user_id: string): Promise<any> {
        return true;
    };
};
