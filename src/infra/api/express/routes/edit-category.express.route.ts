import { Request, Response } from "express";
import { EditCategoryInputDto, EditCategoryOutputDto, EditCategoryUsecase, EditCategoryUserDto } from "../../../../usecases/category/edit-category/edit-category.usecase";
import { HttpMethod, Route } from "./route";

type EditCategoryResponseDto = 
{
    category: { id: string, name: string, user_id: string | null }
};

export class EditCategoryRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly editCategoryService: EditCategoryUsecase
    ){}

    public static create(editCategoryService: EditCategoryUsecase){
        return new EditCategoryRoute(
            "/category/edit",
            HttpMethod.PUT,
            editCategoryService
        );
    };

    public getHandler(){
        return async(request: Request, response: Response) => {
            try {
                const { id, name } = request.body;
                const input: EditCategoryInputDto = { id, name };
                const userAdminFake: EditCategoryUserDto = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake: EditCategoryUserDto = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                console.log("user >> ", user);
                const result: EditCategoryOutputDto = 
                    await this.editCategoryService.execute(input, user);
    
                const output = this.presente(result);
                response.status(201).json(output);
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

    private presente(input: EditCategoryOutputDto): EditCategoryResponseDto {
        const response = { id: input.id, name: input.name, user_id: input.user_id };
        return { category: response };
    };

};
