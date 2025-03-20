import { User } from "../../../domain/user/entities/user";
import { Usecase } from "../../usecase"
import { UserInputDto } from "../../../middleware/keycloakAuth.middleware";
import { WorkoutHistory } from "../../../domain/workout-history/entities/workout-history";
import { WorkoutHistoryGateway } from "../../../domain/workout-history/workout-history.gateway";
import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";

export type CreateWorkoutHistoryUsecaseInputDto = {
    created_date: Date | null;
    workout_plan_id: string;
    workout_day_id: string;
    duration: number | null;
    observation: string | null;
};

export type CreateWorkoutHistoryUsecaseOutputDto = {
    workoutHistory: {
        id: string;
        created_date: Date;
        workout_plan: string | null;
        workout_day: string | null;
        workout_categories: string | null;
        workout_count_exercises: number | null;
        duration: number | null;
        observation: string | null;
    }
};

export class CreateWorkoutHistoryUsecase
    implements Usecase<CreateWorkoutHistoryUsecaseInputDto, UserInputDto, CreateWorkoutHistoryUsecaseOutputDto> {

    private constructor(
        private readonly workoutPlanGateway: WorkoutPlanGateway,
        private readonly workoutHistoryGateway: WorkoutHistoryGateway
    ) { }

    public static create(
        workoutPlanGateway: WorkoutPlanGateway,
        workoutHistoryGateway: WorkoutHistoryGateway
    ) {
        return new CreateWorkoutHistoryUsecase(workoutPlanGateway, workoutHistoryGateway);
    };

    public async execute(req: CreateWorkoutHistoryUsecaseInputDto, user: UserInputDto): Promise<CreateWorkoutHistoryUsecaseOutputDto> {
        const { id: userId } = User.with(user);

        const { workout_plan_id: workoutPlanId, workout_day_id: workoutDayId, created_date, duration, observation } = req;

        const createdDate: Date = (created_date) ? created_date : new Date();
        const workoutPlan = await this.workoutPlanGateway.select({ id: workoutPlanId, user_id: userId });
        if (workoutPlan === null) throw new Error();
        const workoutPlanName: string = workoutPlan.name;
        let workoutDaySelected = null;
        for (const t of workoutPlan.workoutDays) {
            if (t.id === workoutDayId) workoutDaySelected = t;
        };
        if (workoutDaySelected === null) throw new Error();
        const workoutDayName: string = workoutDaySelected.name;
        let workoutDaySetCategories = new Set<string>;
        for (const t of workoutDaySelected.workoutExercises) {
            if (Array.isArray(t.exercise?.categories)) {
                for (const th of t.exercise?.categories) {
                    workoutDaySetCategories.add(th);
                };
            };
        };
        const workoutCountExercises: number = workoutDaySelected.workoutExercises.length;
        const workoutDayCategories: string = Array.from(workoutDaySetCategories).join(", ");

        const input = {
            created_date: createdDate,
            workout_plan: workoutPlanName,
            workout_day: workoutDayName,
            workout_categories: workoutDayCategories,
            workout_count_exercises: workoutCountExercises,
            duration,
            observation
        };

        const aWorkoutHistory = WorkoutHistory.create({ user_id: userId, ...input });
        const result = await this.workoutHistoryGateway.insert(aWorkoutHistory);
        if (result === null) throw new Error();
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(workoutHistory: WorkoutHistory): CreateWorkoutHistoryUsecaseOutputDto {
        const { id, user_id, created_date, workout_plan, workout_day, workout_categories, workout_count_exercises, duration, observation} = workoutHistory;
        const output = { id, user_id, created_date, workout_plan, workout_day, workout_categories, workout_count_exercises, duration, observation };
        return { workoutHistory: output };
    }
};