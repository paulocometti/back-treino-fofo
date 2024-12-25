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
        const { name: nameCategory } = input;
        const userAdminFake = User.with(user);
        const userId = userAdminFake.role === 'ADMIN' ? null : userAdminFake.id;
        const aCategory = Category.create({name: nameCategory, user_id: userId});
        const test = await this.categoryGateway.existsByName(aCategory, userId);
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