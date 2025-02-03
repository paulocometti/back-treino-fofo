import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/user/entities/user";
import { CategoryGateway, CategoryGatewayListInputDTO } from "../../../domain/category/category.gateway";
import { Usecase } from "../../usecase";
import { UserInputDto } from "../../../middleware/keycloakAuth.middleware";

type ListCategoryInputDto = void;

export type ListCategoryOutputDto = {
    categories: {
        id: string;
        name: string;
    }[];
};

export class ListCategoryUsecase implements Usecase<ListCategoryInputDto, UserInputDto, ListCategoryOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway) { }

    public static create(categoryGateway: CategoryGateway) {
        return new ListCategoryUsecase(categoryGateway);
    };

    public async execute(_: ListCategoryInputDto, user: UserInputDto): Promise<ListCategoryOutputDto> {
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: CategoryGatewayListInputDTO = { user_id: userIdCondition };
        const aCategories = await this.categoryGateway.list(input);
        const output = this.presentOutput(aCategories);
        return output;
    };

    private presentOutput(categories: Category[]): ListCategoryOutputDto {
        let formatCategories = [];
        for (const t of categories)
            formatCategories.push({ id: t.id, name: t.name });

        return { categories: formatCategories };
    };

};
