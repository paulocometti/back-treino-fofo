// import { Exercise } from "../../../domain/exercise/entities/exercise";
// import { User } from "../../../domain/user/entities/user";
// import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
// import { Usecase } from "../../usecase";
// import { ExerciseGatewaySelectDTO } from "../../../domain/exercise/dtos/exercise-dtos";

// export type SelectExerciseInputDto = {
//     id: string
// };

// export type SelectExerciseUserDto = {
//     id: string,
//     name: string,
//     role: 'USER' | 'ADMIN'
// };

// export type SelectExerciseOutputDto = {
//     exercise: {
//         id: string;
//         name: string;
//         category_id: string | null;
//         user_id: string | null;
//     };
// };

// export class SelectExerciseUsecase implements Usecase<SelectExerciseInputDto, SelectExerciseUserDto, SelectExerciseOutputDto> {

//     private constructor(private readonly exerciseGateway: ExerciseGateway) { }

//     public static create(exerciseGateway: ExerciseGateway) {
//         return new SelectExerciseUsecase(exerciseGateway);
//     };

//     public async execute(req: SelectExerciseInputDto, user: SelectExerciseUserDto): Promise<SelectExerciseOutputDto> {
//         const { id } = req;
//         const { id: userId, role: userRole } = User.with(user);
//         const userIdCondition = userRole === 'ADMIN' ? null : userId;
//         const input: ExerciseGatewaySelectDTO = { id, user_id: userIdCondition };
//         const aExercise = await this.exerciseGateway.select(input);
//         if (aExercise === null) throw new Error('Nada encontrado.');
//         const output = this.presentOutput(aExercise);
//         return output;
//     };

//     private presentOutput(exercise: Exercise): SelectExerciseOutputDto {
//         return {
//             exercise: exercise
//         };
//     };

// };
