import { User } from "../../../domain/user/entities/user";
import { WorkoutPlan } from "../../../domain/workout-plan/entities/workout-plan";
import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";
import { Usecase } from "../../usecase"

export type SelectWorkoutPlanUsecaseInputDto = {
    id: string
};

export type SelectWorkoutPlanUsecaseUserInputDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

// consertar exercise?
export type SelectWorkoutPlanUsecaseOutputDto = {
    workoutPlan: {
        id: string;
        name: string;
        description: string | null;
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
    }
};

export class SelectWorkoutPlanUsecase
    implements Usecase<SelectWorkoutPlanUsecaseInputDto, SelectWorkoutPlanUsecaseUserInputDto, SelectWorkoutPlanUsecaseOutputDto> {

    private constructor(private readonly workoutPlanGateway: WorkoutPlanGateway) { }

    public static create(workoutPlanGateway: WorkoutPlanGateway) {
        return new SelectWorkoutPlanUsecase(workoutPlanGateway);
    };

    public async execute(req: SelectWorkoutPlanUsecaseInputDto, user: SelectWorkoutPlanUsecaseUserInputDto): Promise<SelectWorkoutPlanUsecaseOutputDto> {
        const { id } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input = { id, user_id: userIdCondition };
        const result = await this.workoutPlanGateway.select(input);
        if(result === null) throw new Error('Nada encontrado.');
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(workoutPlan: WorkoutPlan): SelectWorkoutPlanUsecaseOutputDto {
        let wDays = [];
        let wExercises = [];

        for(const t of workoutPlan.workoutDays){
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

        const output = { id: workoutPlan.id, name: workoutPlan.name, description: workoutPlan.description, user_id: workoutPlan.user_id, workoutDays: wDays };
        return { workoutPlan: output };
    };
};