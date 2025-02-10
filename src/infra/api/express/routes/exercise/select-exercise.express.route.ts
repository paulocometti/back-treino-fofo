import { Request, Response, } from "express";
import { HttpMethod, Route } from "../route";
import { SelectExerciseInputDto, SelectExerciseUsecase } from "../../../../../usecases/exercise/select-exercise/select-exercise.usecase";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

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
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.selectExerciseService.execute(input, user);
                response.status(200).json(result);
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
