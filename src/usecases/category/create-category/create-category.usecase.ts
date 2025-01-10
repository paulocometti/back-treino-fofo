import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/user/entities/user";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Usecase } from "../../usecase"

export type CreateCategoryUsecaseInputDto = {
    name: string;
    user_id?: string | null;
};

export type CreateCategoryUsecaseUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type CreateCategoryUsecaseOutputDto = {
    category: {
        id: string;
        name: string;
        user_id: string | null;
    }
};

export class CreateCategoryUsecase
    implements Usecase<CreateCategoryUsecaseInputDto, CreateCategoryUsecaseUserDto, CreateCategoryUsecaseOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway) { }

    public static create(categoryGateway: CategoryGateway) {
        return new CreateCategoryUsecase(categoryGateway);
    };

    public async execute(req: CreateCategoryUsecaseInputDto, user: CreateCategoryUsecaseUserDto): Promise<CreateCategoryUsecaseOutputDto> {
        const { name: categoryName } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const test = await this.categoryGateway.existsByName({ name: categoryName, user_id: userIdCondition });
        if (test === true) throw new Error('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
        const aCategory = Category.create({ name: categoryName, user_id: userIdCondition });
        const result = await this.categoryGateway.insert(aCategory);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(category: Category): CreateCategoryUsecaseOutputDto {
        const output = { id: category.id, name: category.name, user_id: category.user_id };
        return { category: output };
    }
};