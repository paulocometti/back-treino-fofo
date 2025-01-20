import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { WorkoutDay } from "../../../domain/workout-day/entities/workout-day";
import { WorkoutExercise } from "../../../domain/workout-exercise/entities/workout-exercise";
import { WorkoutPlan } from "../../../domain/workout-plan/entities/workout-plan";
import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";
import { Usecase } from "../../usecase"

export type CreateWorkoutPlanUsecaseInputDto = {
    name: string;
    workoutDays: {
        name: string,
        workoutExercise: {
            sets: number,
            reps: number,
            observation: string | null,
            exercise_id: string
        }[]
    }[];
};

export type CreateWorkoutPlanUsecaseUserInputDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type CreateWorkoutPlanUsecaseOutputDto = {
    workoutPlan: {
        id: string;
        name: string;
        user_id: string | null;
        workoutDays: {
            name: string,
            workoutExercises: {
                sets: number,
                reps: number,
                observation: string | null,
                exercise_id: string
            }[]
        }[];
    }
};

export class CreateWorkoutPlanUsecase
    implements Usecase<CreateWorkoutPlanUsecaseInputDto, CreateWorkoutPlanUsecaseUserInputDto, CreateWorkoutPlanUsecaseOutputDto> {

    private constructor(private readonly workoutPlanGateway: WorkoutPlanGateway) { }

    public static create(workoutPlanGateway: WorkoutPlanGateway) {
        return new CreateWorkoutPlanUsecase(workoutPlanGateway);
    };

    public async execute(req: CreateWorkoutPlanUsecaseInputDto, user: CreateWorkoutPlanUsecaseUserInputDto): Promise<CreateWorkoutPlanUsecaseOutputDto> {
        const { name: workoutPlanName, workoutDays } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        let aWorkoutDays: WorkoutDay[] = [];
        let aWorkoutExercises: WorkoutExercise[] = [];
        for(const t of workoutDays){
            for(const th of t.workoutExercise){
                //usar gateway do exercise para criar o objeto dele
                const aWorkoutExercise = WorkoutExercise.create({
                    sets: th.sets, 
                    reps: th.reps, 
                    observation: th.observation,
                    exercise_id: th.exercise_id
                });
                aWorkoutExercises.push(aWorkoutExercise);
            };
            const aWorkoutDay = WorkoutDay.create({name: t.name, workoutExercises: aWorkoutExercises});
            aWorkoutDays.push(aWorkoutDay);
        };

        const aWorkoutPlan = WorkoutPlan.create({ name: workoutPlanName, user_id: userIdCondition, workoutDays: aWorkoutDays });
        // >> 
        // testar se os exerciseId escolhidos sao valido
        // tambem testar se ambos sao null (oficiais) ou do mesmo dono
        // caso ok prosseguir com o cadastro, caso nao informar erro ao controller.
        // fazer depois
        const result = await this.workoutPlanGateway.insert(aWorkoutPlan);
        if(result === null) throw new Error();
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(workoutPlan: WorkoutPlan): CreateWorkoutPlanUsecaseOutputDto {
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

        const output = { id: workoutPlan.id, name: workoutPlan.name, user_id: workoutPlan.user_id, workoutDays: wDays };
        return { workoutPlan: output };
    };
};