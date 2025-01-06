import { Request, Response } from "express";
import { CreateExerciseInputDto, CreateExerciseOutputDto, CreateExerciseUsecase, CreateExerciseUserInputDto } from "../../../../../usecases/exercise/create-exercise/create-exercise.usecase";
import { HttpMethod, Route } from "../route";

type CreateExerciseResponseDto = {
    exercise: { id: string, name: string, categories: { id: string, name: string, user_id: string | null }[], user_id: string | null }
};

export class CreateExerciseRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createExerciseService: CreateExerciseUsecase
    ) { }

    public static create(createExerciseService: CreateExerciseUsecase) {
        return new CreateExerciseRoute(
            "/exercise/create",
            HttpMethod.POST,
            createExerciseService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { name, categories } = request.body;
                const input: CreateExerciseInputDto = { name, categories };
                const userAdminFake: CreateExerciseUserInputDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: CreateExerciseUserInputDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userAdminFake;
                const result: CreateExerciseOutputDto =
                    await this.createExerciseService.execute(input, user);

                const output = this.presente(result);
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

    private presente(input: CreateExerciseOutputDto): CreateExerciseResponseDto {
        const response = { id: input.id, name: input.name, categories: input.categories, user_id: input.user_id };
        return {
            exercise: response
        };
    };

};
