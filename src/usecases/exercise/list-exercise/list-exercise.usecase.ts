// import { Exercise } from "../../../domain/exercise/entities/exercise";
// import { User } from "../../../domain/user/entities/user";
// import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
// import { Usecase } from "../../usecase";
// import { ExerciseGatewayListDTO } from "../../../domain/exercise/dtos/exercise-dtos";

// type ListExerciseInputDto = void;

// export type ListExerciseUserDto = {
//     id: string,
//     name: string,
//     role: 'USER' | 'ADMIN'
// };

// export type ListExerciseOutputDto = {
//     exercises: {
//         id: string;
//         name: string;
//         category_id: string | null;
//     }[];
// };

// export class ListExerciseUsecase implements Usecase<ListExerciseInputDto, ListExerciseUserDto, ListExerciseOutputDto>{
    
//     private constructor(private readonly exerciseGateway: ExerciseGateway){}

//     public static create(exerciseGateway: ExerciseGateway){
//         return new ListExerciseUsecase(exerciseGateway);
//     };

//     public async execute(_: ListExerciseInputDto, user: ListExerciseUserDto): Promise<ListExerciseOutputDto> {
//         const { id: userId, role: userRole } = User.with(user);
//         const userIdCondition = userRole === 'ADMIN' ? null : userId;
//         const input: ExerciseGatewayListDTO = { user_id: userIdCondition };
//         const aExercises = await this.exerciseGateway.list(input);
//         const output = this.presentOutput(aExercises);
//         return output;
//     };

//     private presentOutput(exercises: Exercise[]): ListExerciseOutputDto {
//         let formatExercises = [];

//         for(const t of exercises){
//             formatExercises.push({
//                 id: t.id,
//                 name: t.name,
//                 category_id: t.category_id
//             });
//         };

//         return {
//             exercises: formatExercises
//         };
//     };

// };
