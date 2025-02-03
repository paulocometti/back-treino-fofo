import { Request, Response } from "express";
import { EditCategoryInputDto, EditCategoryUsecase } from "../../../../../usecases/category/edit-category/edit-category.usecase";
import { HttpMethod, Route } from "../route";
import { extractUserFromAuth, UserInputDto } from "../../../../../middleware/keycloakAuth.middleware";

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
                const auth: string = request.headers.authorization as string;
                const user: UserInputDto = extractUserFromAuth(auth);
                const result =  await this.editCategoryService.execute(input, user);
                response.status(200).json({ ...result });
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
