import { Request, Response } from "express";
import { ListCategoryUsecase } from "../../../../../usecases/category/list-category/list-category.usecase";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

export type ListCategoryResponseDto = {
    categories: {
        id: string;
        name: string;
    }[];
};

export class ListCategoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listCategorySerivce: ListCategoryUsecase
    ) { };

    public static create(listCategorySerivce: ListCategoryUsecase) {
        return new ListCategoryRoute(
            "/category/list",
            HttpMethod.GET,
            listCategorySerivce
        )
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.listCategorySerivce.execute(undefined, user);
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
