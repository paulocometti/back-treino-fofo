import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/category/entities/user";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Usecase } from "../../usecase"

export type EditCategoryInputDto = {
    id: string,
    name: string;
    user_id: string | null;
};

export type EditCategoryUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type EditCategoryOutputDto = {
    id: string;
    name: string;
    user_id: string | null;
};

export class EditCategoryUsecase 
    implements Usecase<EditCategoryInputDto, EditCategoryUserDto, EditCategoryOutputDto>{

    private constructor(private readonly categoryGateway: CategoryGateway){}

    public static create(categoryGateway: CategoryGateway){
        return new EditCategoryUsecase(categoryGateway);
    };

    public async execute(input: EditCategoryInputDto, user: EditCategoryUserDto): Promise<EditCategoryOutputDto>{
        const { id: categoryId, name: categoryName, user_id: categoryUserId } = input;
        const { id: userId, role: userRole } = User.with(user);
        const aCategory = Category.with({id: categoryId, name: categoryName, user_id: categoryUserId});
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const test = await this.categoryGateway.existsByName(aCategory, userIdCondition);
        if(test) throw new Error('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
        const result = await this.categoryGateway.update(aCategory);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(category: Category): EditCategoryOutputDto {
        const output: EditCategoryOutputDto = {
            id: category.id,
            name: category.name,
            user_id: category.user_id
        };
        return output;
    }
};