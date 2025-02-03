import { Request, Response } from "express";
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase } from "../../../../../usecases/category/create-category/create-category.usecase";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

export class CreateCategoryRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createCategoryService: CreateCategoryUsecase
    ) { }

    public static create(createCategoryService: CreateCategoryUsecase) {
        return new CreateCategoryRoute(
            "/category/create",
            HttpMethod.POST,
            createCategoryService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { name } = request.body;
                const input: CreateCategoryUsecaseInputDto = { name };
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result = await this.createCategoryService.execute(input, user);
                response.status(201).json({ ...result });
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
