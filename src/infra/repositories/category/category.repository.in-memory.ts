import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryInMemory implements CategoryGateway {
    private categories: Category[] = [];

    private constructor(){}

    public static create(){
        return new CategoryRepositoryInMemory();
    };

    public async save(input: Category): Promise<Category> {
        this.categories.push(input);
        return input;
    };

    public async list(user_id: string | null): Promise<Category[]> {
        const categoriesWithUserIdNull: Category[] = this.categories.filter(t => t.user_id === null);
        let categoriesWithUserIdSameEqualsUser: Category[] = [];
        if (user_id) {
            categoriesWithUserIdSameEqualsUser = this.categories.filter(t => t.user_id === user_id);
        }
        
        return categoriesWithUserIdNull.concat(categoriesWithUserIdSameEqualsUser);
    };

};
