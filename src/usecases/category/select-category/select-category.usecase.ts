import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/user/entities/user";
import { CategoryGateway, CategoryGatewaySelectInputDTO } from "../../../domain/category/category.gateway";
import { Usecase } from "../../usecase";

export type SelectCategoryInputDto = {
    id: string
};

export type SelectCategoryUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type SelectCategoryOutputDto = {
    category: {
        id: string;
        name: string;
        user_id: string | null;
    };
};

export class SelectCategoryUsecase implements Usecase<SelectCategoryInputDto, SelectCategoryUserDto, SelectCategoryOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway) { }

    public static create(categoryGateway: CategoryGateway) {
        return new SelectCategoryUsecase(categoryGateway);
    };

    public async execute(req: SelectCategoryInputDto, user: SelectCategoryUserDto): Promise<SelectCategoryOutputDto> {
        const { id } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: CategoryGatewaySelectInputDTO = { id, user_id: userIdCondition };
        const aCategory = await this.categoryGateway.select(input);
        if (aCategory === null) throw new Error('Nada encontrado.');
        const output = this.presentOutput(aCategory);
        return output;
    };

    private presentOutput(category: Category): SelectCategoryOutputDto {
        const output = { id: category.id, name: category.name, user_id: category.user_id };
        return { category: output };
    };

};
