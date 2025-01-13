import { Request, Response } from "express";
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecaseOutputDto, CreateCategoryUsecase, CreateCategoryUsecaseUserDto } from "../../../../../usecases/category/create-category/create-category.usecase";
import { HttpMethod, Route } from "../route";

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
                const userAdminFake: CreateCategoryUsecaseUserDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: CreateCategoryUsecaseUserDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userFake;
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
