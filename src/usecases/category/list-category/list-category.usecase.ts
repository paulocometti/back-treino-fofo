import { Category } from "../../../domain/category/entities/category";
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Usecase } from "../../usecase";

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

    public async execute(input: ListCategoryInputDto, user: ListCategoryUserDto): Promise<ListCategoryOutputDto> {
        const { id: user_id } = user; 
        const aCategories = await this.categoryGateway.list(user_id);
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
