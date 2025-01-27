import { User } from "../../../domain/user/entities/user";
import { WorkoutPlan } from "../../../domain/workout-plan/entities/workout-plan";
import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";
import { Usecase } from "../../usecase"

export type ListWorkoutPlanUsecaseInputDto = void;

export type ListWorkoutPlanUsecaseUserInputDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

// consertar exercise?
export type ListWorkoutPlanUsecaseOutputDto = {
    workoutPlans: {
        id: string;
        name: string;
        user_id: string | null;
        workoutDays: {
            name: string,
            workoutExercises: {
                sets: number,
                reps: number,
                observation: string | null,
                exercise_id: string,
                exercise?: {
                    name: string,
                    categories: string[]
                }
            }[]
        }[];
    }[];
};

export class ListWorkoutPlanUsecase
    implements Usecase<ListWorkoutPlanUsecaseInputDto, ListWorkoutPlanUsecaseUserInputDto, ListWorkoutPlanUsecaseOutputDto> {

    private constructor(private readonly workoutPlanGateway: WorkoutPlanGateway) { }

    public static create(workoutPlanGateway: WorkoutPlanGateway) {
        return new ListWorkoutPlanUsecase(workoutPlanGateway);
    };

    public async execute(req: ListWorkoutPlanUsecaseInputDto, user: ListWorkoutPlanUsecaseUserInputDto): Promise<ListWorkoutPlanUsecaseOutputDto> {
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input = { user_id: userIdCondition };
        const result = await this.workoutPlanGateway.list(input);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(workoutPlan: WorkoutPlan[]): ListWorkoutPlanUsecaseOutputDto {

        let output = [];
        for(const workout of workoutPlan){
            let wDays = [];
            let wExercises = [];

            for(const t of workout.workoutDays){
                for(const th of t.workoutExercises){
                    wExercises.push({
                        sets: th.sets,
                        reps: th.reps,
                        observation: th.observation,
                        exercise_id: th.exercise_id,
                        exercise: th.exercise
                    });
                };
                wDays.push({ name: t.name, workoutExercises: wExercises });
            };

            const workoutPlan = { id: workout.id, name: workout.name, user_id: workout.user_id, workoutDays: wDays };
            output.push(workoutPlan);
        };
        
        return { workoutPlans: output };
    };
};