import { Request, Response } from "express";
import { ListCategoryOutputDto, ListCategoryUsecase, ListCategoryUserDto } from "../../../../usecases/category/list-category/list-category.usecase";
import { HttpMethod, Route } from "./route";

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
    ){};

    public static create(listCategorySerivce: ListCategoryUsecase){
        return new ListCategoryRoute(
            "/category/list",
            HttpMethod.GET,
            listCategorySerivce
        )
    };

    public getHandler(){
        return async(request: Request, response: Response) => {
            const userAdminFake: ListCategoryUserDto = {
                id: crypto.randomUUID(),
                name: 'Paulo',
                role: 'ADMIN'
            };
            const userFake: ListCategoryUserDto = {
                id: '14260c56-e1d3-48bc-8a36-b4b60f53564b',
                name: 'Paulo',
                role: 'USER'
            };
            const user = (Math.random() < 0.5) ? userAdminFake : userFake;
            const result = await this.listCategorySerivce.execute(undefined, user);
            const output = this.present(result);
            response.status(200).json(output).send();
        }
    };

    public getPath(): string {
        return this.path;
    };

    public getMethod(): HttpMethod {
        return this.method;
    };

    private present(input: ListCategoryOutputDto): ListCategoryResponseDto {
        const response = [];
        const categories = input.categories;
        for(const t of categories){
            response.push({
                id: t.id,
                name: t.name
            })
        };

        return { categories: response };
    };

};