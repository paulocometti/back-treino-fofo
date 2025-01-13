import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { EditExerciseInputDto, EditExerciseOutputDto, EditExerciseUsecase, EditExerciseUserDto } from "../../../../../usecases/exercise/edit-exercise/edit-exercise.usecase";

export class EditExerciseRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly editExerciseService: EditExerciseUsecase
    ){}

    public static create(editExerciseService: EditExerciseUsecase){
        return new EditExerciseRoute(
            "/exercise/edit",
            HttpMethod.PUT,
            editExerciseService
        );
    };

    public getHandler(){
        return async(request: Request, response: Response) => {
            try {
                const { id, name, categories } = request.body;
                const input: EditExerciseInputDto = { id, name, categories };
                const userAdminFake: EditExerciseUserDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: EditExerciseUserDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userAdminFake;
                const output: EditExerciseOutputDto =  await this.editExerciseService.execute(input, user);
                response.status(201).json(output);
            } catch (error: any) {
                response.status(500).json({ message: error?.message || "Error Interno do Servidor." });  
            };
        };
    };

    public getPath(): string {
        return this.path;
    };

    public getMethod(): HttpMethod {
        return this.method;
    };

};
