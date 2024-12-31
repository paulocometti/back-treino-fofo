import { Request, Response, } from "express";
import { HttpMethod, Route } from "./route";
import { SelectCategoryInputDto, SelectCategoryOutputDto, SelectCategoryUsecase, SelectCategoryUserDto } from "../../../../usecases/category/select-category/select-category.usecase";

export type SelectCategoryResponseDto = {
    category: {
        id: string;
        name: string;
    };
};

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
                const userAdminFake: SelectCategoryUserDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: SelectCategoryUserDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                console.log("user >> ", user);
                const result = await this.selectCategoryService.execute(input, user);
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

    private present(input: SelectCategoryOutputDto): SelectCategoryResponseDto {
        const category = input.category;
        const response = {
            id: category.id,
            name: category.name
        };

        return { category: response };

    };

};
