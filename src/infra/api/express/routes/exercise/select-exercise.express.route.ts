import { Request, Response, } from "express";
import { HttpMethod, Route } from "../route";
import { SelectExerciseInputDto, SelectExerciseOutputDto, SelectExerciseUsecase, SelectExerciseUserDto } from "../../../../../usecases/exercise/select-exercise/select-exercise.usecase";

export type SelectExerciseResponseDto = {
    exercise: {
        id: string;
        name: string;
        category_id: string | null;
    };
};

export class SelectExerciseRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly selectExerciseService: SelectExerciseUsecase
    ) { };

    public static create(selectExerciseSerivce: SelectExerciseUsecase) {
        return new SelectExerciseRoute(
            "/exercise/:id",
            HttpMethod.GET,
            selectExerciseSerivce
        )
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { id } = request.params;
                const input: SelectExerciseInputDto = { id };
                const userAdminFake: SelectExerciseUserDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: SelectExerciseUserDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userFake;
                const result = await this.selectExerciseService.execute(input, user);
                const output = this.present(result);
                response.status(200).json(output).send();
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

    private present(input: SelectExerciseOutputDto): SelectExerciseResponseDto {
        const exercise = input.exercise;
        const response = {
            id: exercise.id,
            name: exercise.name,
            category_id: exercise.category_id,
            user_id: exercise.user_id
        };

        return { exercise: response };

    };

};
