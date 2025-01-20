import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/user/entities/user";
import { CategoryGateway } from "../../../domain/category/category.gateway";
import { Usecase } from "../../usecase"

export type EditCategoryInputDto = {
    id: string,
    name: string;
    user_id?: string | null;
};

export type EditCategoryUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type EditCategoryOutputDto = {
    category: {
        id: string;
        name: string;
        user_id: string | null;
    }
};

export class EditCategoryUsecase
    implements Usecase<EditCategoryInputDto, EditCategoryUserDto, EditCategoryOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway) { }

    public static create(categoryGateway: CategoryGateway) {
        return new EditCategoryUsecase(categoryGateway);
    };

    public async execute(req: EditCategoryInputDto, user: EditCategoryUserDto): Promise<EditCategoryOutputDto> {
        const { id: categoryId, name: categoryName } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: Category = Category.with({ id: categoryId, name: categoryName, user_id: userIdCondition });
        const found = await this.categoryGateway.findByIdAndUserId({ id: categoryId, user_id: userIdCondition });
        if (found === false) throw new Error('A Categoria que você está tentando editar não existe!');
        const test = await this.categoryGateway.existsByName(input);
        if (test === true) throw new Error('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
        const result = await this.categoryGateway.update(input);
        if(result === null) throw new Error();
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(category: Category): EditCategoryOutputDto {
        const output = { id: category.id, name: category.name, user_id: category.user_id };
        return { category: output };
    }
};