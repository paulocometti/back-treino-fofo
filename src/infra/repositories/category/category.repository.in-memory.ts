import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryInMemory implements CategoryGateway {
    private categories: Category[] = [];

    private constructor() { }

    public static create() {
        return new CategoryRepositoryInMemory();
    };

    public async existsByName(input: Category, user_id?: string): Promise<boolean> {
        const { id, name } = input;

        const found = this.categories.find((category) => {
            if (id && category.id === id) return false;
            if (category.name !== name) return false;

            if (user_id) {
                if (category.user_id !== null && category.user_id !== user_id) return false;
            };

            return true;
        });

        return !!found;
    };

    public async insert(input: Category): Promise<Category> {
        this.categories.push(input);
        const output = Category.with({
            id: this.categories[this.categories.length - 1].id,
            name: this.categories[this.categories.length - 1].name,
            user_id: this.categories[this.categories.length - 1].user_id
        });
        return output;
    };

    public async list(user_id?: string): Promise<Category[]> {
        const categoriesWithUserIdNull: Category[] = this.categories.filter(t => t.user_id === null);
        let categoriesWithUserIdSameEqualsUser: Category[] = [];
        if (user_id)
            categoriesWithUserIdSameEqualsUser = this.categories.filter(t => t.user_id === user_id);

        const resultCategories = categoriesWithUserIdNull.concat(categoriesWithUserIdSameEqualsUser);
        let output = [];
        for (const t of resultCategories) {
            const category = Category.with({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            })
            output.push(category);
        };

        return output;
    };

};
