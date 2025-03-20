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

    public async select(user_id: string, past_days: number): Promise<WorkoutHistory[]> {
        const dateNow: Date = new Date();
        let datePastDays: Date = new Date(dateNow);
        datePastDays.setDate(dateNow.getDate() - past_days);
        const where = { user_id, created_date: { gte: datePastDays, } };
        const result = await this.prismaClient.workoutHistory.findMany({ where, orderBy: { created_date: 'desc' } });

        let output: WorkoutHistory[] = [];
        for(const t of result){
            output.push(WorkoutHistory.with({
                id: t.id,
                user_id: t.user_id,
                created_date: t.created_date,
                workout_plan: t.workout_plan,
                workout_day: t.workout_day,
                workout_categories: t.workout_categories,
                workout_count_exercises: t.workout_count_exercises,
                duration: t.duration,
                observation: t.observation,
            }));
        };
        return output;
    };
};
