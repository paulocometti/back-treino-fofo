import { Category } from "../../../domain/category/entities/category";
import { User } from "../../../domain/user/entities/user";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Usecase } from "../../usecase";
import { CategoryGatewayListDTO } from "../../../domain/category/dtos/category-dtos";

type ListCategoryInputDto = void;

export type ListCategoryUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type ListCategoryOutputDto = {
    categories: {
        id: string;
        name: string;
    }[];
};

export class ListCategoryUsecase implements Usecase<ListCategoryInputDto, ListCategoryUserDto, ListCategoryOutputDto>{
    
    private constructor(private readonly categoryGateway: CategoryGateway){}

    public static create(categoryGateway: CategoryGateway){
        return new ListCategoryUsecase(categoryGateway);
    };

    public async execute(_: ListCategoryInputDto, user: ListCategoryUserDto): Promise<ListCategoryOutputDto> {
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: CategoryGatewayListDTO = { user_id: userIdCondition };
        const aCategories = await this.categoryGateway.list(input);
        const output = this.presentOutput(aCategories);
        return output;
    };

    private presentOutput(categories: Category[]): ListCategoryOutputDto {
        let formatCategories = [];

        for(const t of categories){
            formatCategories.push({
                id: t.id,
                name: t.name
            });
        };

        return {
            categories: formatCategories
        };
    };

};
