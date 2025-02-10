import { Request, Response, } from "express";
import { HttpMethod, Route } from "../route";
import { SelectCategoryInputDto, SelectCategoryUsecase } from "../../../../../usecases/category/select-category/select-category.usecase";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

export class SelectCategoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly selectCategoryService: SelectCategoryUsecase
    ) { };

    public static create(selectCategorySerivce: SelectCategoryUsecase) {
        return new SelectCategoryRoute(
            "/category/:id",
            HttpMethod.GET,
            selectCategorySerivce
        )
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { id } = request.params;
                const input: SelectCategoryInputDto = { id };
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.selectCategoryService.execute(input, user);
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
