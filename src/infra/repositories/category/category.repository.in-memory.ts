import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";
import { CategoryGatewayExistsDTO, CategoryGatewayListDTO, CategoryGatewaySelectDTO } from "../../../domain/category/dtos/category-dtos";

export class CategoryRepositoryInMemory implements CategoryGateway {
    private categories: Category[] = [];

    private constructor() { }

    public static create() {
        return new CategoryRepositoryInMemory();
    };

    public async existsByName(input: CategoryGatewayExistsDTO): Promise<boolean> {
        const { id, name, user_id } = input;
        console.log("this.categories >> ", this.categories);
        const found = this.categories.find((category) => {
            if (id && category.id === id) return false;
            if (category.name !== name) return false;
            if (category.user_id !== null && category.user_id !== user_id) return false;
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

    public async update(input: Category): Promise<Category> {
        const { id, name, user_id } = input;
        console.log("id >> ", id);
        console.log("user_id >> ", user_id);
        const index = this.categories.findIndex((category) => category.id === id && category.user_id === user_id);
        console.log("this.categories >> ", this.categories);
        console.log("index >> ", index);
        const newCategory = Category.with({
            id: this.categories[index].id,
            name,
            user_id: this.categories[index].user_id,
        });
        this.categories[index] = newCategory;
        return newCategory;
    };

    public async select(input: CategoryGatewaySelectDTO): Promise<Category | null> {
        const { id, user_id } = input;
        const category = this.categories.find(t => {
            return t.id === id && t.user_id === user_id;
        });

        if (!category) return null;
        const output = Category.with({
            id: category.id,
            name: category.name,
            user_id: category.user_id
        });
        return output;
    };

    public async list(input: CategoryGatewayListDTO): Promise<Category[]> {
        let { user_id } = input;
        const categoriesWithUserIdNull: Category[] = this.categories.filter(t => t.user_id === null);
        let categoriesWithUserIdSameEqualsUser: Category[] = [];
        if (user_id)
            categoriesWithUserIdSameEqualsUser = this.categories.filter(t => t.user_id === user_id);

        const resultCategories = categoriesWithUserIdNull.concat(categoriesWithUserIdSameEqualsUser);

        let output = [];
        for (const t of resultCategories) {
            const category: Category = Category.with({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            })
            output.push(category);
        };

        return output;
    };

};
