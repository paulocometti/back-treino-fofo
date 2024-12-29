import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/category/entities/user";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
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
    };
};

export class SelectCategoryUsecase implements Usecase<SelectCategoryInputDto, SelectCategoryUserDto, SelectCategoryOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway) { }

    public static create(categoryGateway: CategoryGateway) {
        return new SelectCategoryUsecase(categoryGateway);
    };

    public async execute(input: SelectCategoryInputDto, user: SelectCategoryUserDto): Promise<SelectCategoryOutputDto> {
        const { id } = input;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? undefined : userId;
        const aCategory = await this.categoryGateway.select(id, userIdCondition);
        if (aCategory === null) throw new Error('Nada encontrado.');
        const output = this.presentOutput(aCategory);
        return output;
    };

    private presentOutput(category: Category): SelectCategoryOutputDto {
        return {
            category: category
        };
    };

};
