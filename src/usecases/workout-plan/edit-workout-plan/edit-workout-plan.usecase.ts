// import { Exercise } from "../../../domain/exercise/entities/exercise";
// import { User } from "../../../domain/user/entities/user";
// import { WorkoutDay } from "../../../domain/workout-day/entities/workout-day";
// import { WorkoutExercise } from "../../../domain/workout-exercise/entities/workout-exercise";
// import { WorkoutPlan } from "../../../domain/workout-plan/entities/workout-plan";
// import { WorkoutPlanGateway } from "../../../domain/workout-plan/workout-plan.gateway";
// import { UserInputDto } from "../../../middleware/keycloakAuth.middleware";
// import { Usecase } from "../../usecase"

// export type EditWorkoutPlanUsecaseInputDto = {
//     name: string;
//     workoutDays: {
//         name: string,
//         workoutExercise: {
//             sets: number,
//             reps: number,
//             observation: string | null,
//             exercise_id: string
//         }[]
//     }[];
// };

// // consertar exercise?
// export type EditWorkoutPlanUsecaseOutputDto = {
//     workoutPlan: {
//         id: string;
//         name: string;
//         user_id: string | null;
//         workoutDays: {
//             name: string,
//             workoutExercises: {
//                 sets: number,
//                 reps: number,
//                 observation: string | null,
//                 exercise_id: string,
//                 exercise?: {
//                     name: string,
//                     categories: string[]
//                 }
//             }[]
//         }[];
//     }
// };

// export class EditWorkoutPlanUsecase
//     implements Usecase<EditWorkoutPlanUsecaseInputDto, UserInputDto, EditWorkoutPlanUsecaseOutputDto> {

//     private constructor(private readonly workoutPlanGateway: WorkoutPlanGateway) { }

//     public static create(workoutPlanGateway: WorkoutPlanGateway) {
//         return new EditWorkoutPlanUsecase(workoutPlanGateway);
//     };

//     public async execute(req: EditWorkoutPlanUsecaseInputDto, user: UserInputDto): Promise<EditWorkoutPlanUsecaseOutputDto> {
//         const { name: workoutPlanName, workoutDays } = req;
//         const { id: userId, role: userRole } = User.with(user);
//         const userIdCondition = userRole === 'ADMIN' ? null : userId;


//         const createWorkoutPlanUsecase = CreateWorkoutPlanUsecase.create(workoutPlanGateway);
//   const createResult = await createWorkoutPlanUsecase.execute(input, user);
//         return output;
//     };

//     private presentOutput(workoutPlan: WorkoutPlan): EditWorkoutPlanUsecaseOutputDto {
//         let wDays = [];
//         let wExercises = [];

//         for(const t of workoutPlan.workoutDays){
//             for(const th of t.workoutExercises){
//                 wExercises.push({
//                     sets: th.sets,
//                     reps: th.reps,
//                     observation: th.observation,
//                     exercise_id: th.exercise_id,
//                     exercise: th.exercise
//                 });
//             };
//             wDays.push({ name: t.name, workoutExercises: wExercises });
//         };

//         const output = { id: workoutPlan.id, name: workoutPlan.name, user_id: workoutPlan.user_id, workoutDays: wDays };
//         return { workoutPlan: output };
//     };
// };