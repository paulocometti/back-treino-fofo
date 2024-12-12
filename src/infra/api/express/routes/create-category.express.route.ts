import { Request, Response } from "express";
import { CreateCategoryInputDto, CreateCategoryOutputDto, CreateCategoryUsecase, CreateCategoryUserDto } from "../../../../usecases/category/create-category/create-category.usecase";
import { HttpMethod, Route } from "./route";

type CreateCategoryResponseDto = { id: string, name: string, user_id: string | null };

export class CreateCategoryRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createCategoryService: CreateCategoryUsecase
    ){}

    public static create(createCategoryService: CreateCategoryUsecase){
        return new CreateCategoryRoute(
            "/category/create",
            HttpMethod.POST,
            createCategoryService
        );
    };

    public getHandler(){
        return async(request: Request, response: Response) => {
            const { name } = request.body;
            const input: CreateCategoryInputDto = { name };
            const userAdminFake: CreateCategoryUserDto = {
                id: crypto.randomUUID(),
                name: 'Paulo',
                role: 'ADMIN'
            };
            const userFake: CreateCategoryUserDto = {
                id: crypto.randomUUID(),
                name: 'Paulo',
                role: 'USER'
            };
            const user = (Math.random() < 0.5) ? userAdminFake : userFake;
            const result: CreateCategoryOutputDto = 
                await this.createCategoryService.execute(input, user);

            const output = this.presente(result);
            response.status(201).json(output);
        };
    };

    public getPath(): string {
        return this.path;
    };

    public getMethod(): HttpMethod {
        return this.method;
    };

    private presente(input: CreateCategoryResponseDto): CreateCategoryResponseDto {
        const response = { id: input.id, name: input.name, user_id: input.user_id };
        return response;
    };

};
