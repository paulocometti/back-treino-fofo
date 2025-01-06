// import { Request, Response } from "express";
// import { ListExerciseOutputDto, ListExerciseUsecase, ListExerciseUserDto } from "../../../../../usecases/exercise/list-exercise/list-exercise.usecase";
// import { HttpMethod, Route } from "../route";

// export type ListExerciseResponseDto = {
//     exercises: {
//         id: string;
//         name: string;
//         category_id: string | null;
//     }[];
// };

// export class ListExerciseRoute implements Route {
//     private constructor(
//         private readonly path: string,
//         private readonly method: HttpMethod,
//         private readonly listExerciseSerivce: ListExerciseUsecase
//     ) { };

//     public static create(listExerciseSerivce: ListExerciseUsecase) {
//         return new ListExerciseRoute(
//             "/exercise/list",
//             HttpMethod.GET,
//             listExerciseSerivce
//         )
//     };

//     public getHandler() {
//         return async (_: Request, response: Response) => {
//             try {
//                 const userAdminFake: ListExerciseUserDto = {
//                     id: crypto.randomUUID(),
//                     name: 'Paulo',
//                     role: 'ADMIN'
//                 };
//                 const userFake: ListExerciseUserDto = {
//                     id: 'beee6914-5b09-46d2-be94-b09284a31811',
//                     name: 'Paulo',
//                     role: 'USER'
//                 };
//                 //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
//                 const user = userFake;
//                 const result = await this.listExerciseSerivce.execute(undefined, user);
//                 const output = this.present(result);
//                 response.status(200).json(output).send();
//             } catch (error: any) {
//                 response.status(500).json({ message: error?.message || "Error Interno do Servidor." });
//             };
//         };
//     };

//     public getPath(): string {
//         return this.path;
//     };

//     public getMethod(): HttpMethod {
//         return this.method;
//     };

//     private present(input: ListExerciseOutputDto): ListExerciseResponseDto {
//         const response = [];
//         const exercises = input.exercises;
//         for (const t of exercises) {
//             response.push({
//                 id: t.id,
//                 name: t.name,
//                 category_id: t.category_id
//             })
//         };

//         return { exercises: response };
//     };

// };
