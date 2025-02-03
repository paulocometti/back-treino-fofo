import { Request, Response } from "express";
import { CreateExerciseInputDto, CreateExerciseUsecase } from "../../../../../usecases/exercise/create-exercise/create-exercise.usecase";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

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
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.createExerciseService.execute(input, user);
                response.status(201).json(result);
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
