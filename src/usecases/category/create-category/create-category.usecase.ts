import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/category/entities/user";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Usecase } from "../../usecase"

export type CreateCategoryInputDto = {
    name: string;
    user_id?: string | null;
};

export type CreateCategoryUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type CreateCategoryOutputDto = {
    id: string;
    name: string;
    user_id: string | null;
};

export class CreateCategoryUsecase 
    implements Usecase<CreateCategoryInputDto, CreateCategoryUserDto, CreateCategoryOutputDto>{

    private constructor(private readonly categoryGateway: CategoryGateway){}

    public static create(categoryGateway: CategoryGateway){
        return new CreateCategoryUsecase(categoryGateway);
    };

    public async execute(input: CreateCategoryInputDto, user: CreateCategoryUserDto): Promise<CreateCategoryOutputDto>{
        const { name: categoryName } = input;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        console.log("");
        const aCategory = Category.create({name: categoryName, user_id: userIdCondition});
        const test = await this.categoryGateway.existsByName(aCategory, userIdCondition);
        console.log("test >> ", test);
        if(test) throw new Error('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
        const result = await this.categoryGateway.insert(aCategory);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(category: Category): CreateCategoryOutputDto {
        const output: CreateCategoryOutputDto = {
            id: category.id,
            name: category.name,
            user_id: category.user_id
        };
        return output;
    }
};