import { Request, Response } from "express";
import { ListExerciseOutputDto, ListExerciseUsecase, ListExerciseUserDto } from "../../../../../usecases/exercise/list-exercise/list-exercise.usecase";
import { HttpMethod, Route } from "../route";
import { jwtDecode } from "jwt-decode";

export type ListExerciseResponseDto = {
    exercises: {
        id: string;
        name: string;
        category_id: string | null;
    }[];
};

export class ListExerciseRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listExerciseSerivce: ListExerciseUsecase
    ) { };

    public static create(listExerciseSerivce: ListExerciseUsecase) {
        return new ListExerciseRoute(
            "/exercise/list",
            HttpMethod.GET,
            listExerciseSerivce
        )
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const auth: string = request.headers.authorization as string;
                const decodedUser: { sid: string, given_name: string, resource_access: [] } = jwtDecode<{ sid: string, given_name: string, resource_access: [] }>(auth.replace(`Bearer `, ``));
                const { sid: userId, given_name: userNome, resource_access: userAcessos } = decodedUser;
                console.log("userAcessos >> ", userAcessos);
                const user: ListExerciseUserDto = { id: userId, name: userNome, role: 'ADMIN' };
                console.log("user >> ", user);
                const result = await this.listExerciseSerivce.execute(undefined, user);
                response.status(200).json(result).send();
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
