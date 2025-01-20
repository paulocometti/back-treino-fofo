import { CategoryGateway, CategoryGatewayExistsByNameInputDto, CategoryGatewayFindByIdAndUserIdInputDTO, CategoryGatewayFindByIdInputDTO, CategoryGatewayListInputDTO, CategoryGatewaySelectInputDTO } from "../../../domain/category/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export class CategoryRepositoryInMemory implements CategoryGateway {
    private categories: Category[] = [];

    private constructor() { }

    public static create() {
        return new CategoryRepositoryInMemory();
    };

    public async existsByName(input: CategoryGatewayExistsByNameInputDto): Promise<boolean> {
        const { id, name, user_id } = input;
        for (const category of this.categories) {
            if (category.name !== name) continue;
            if (id && category.id === id) continue;
            if (user_id) {
                if (category.user_id !== null && category.user_id !== user_id) continue;
            };
            return true;
        };
        return false;
    };


    public async findById(input: CategoryGatewayFindByIdInputDTO): Promise<boolean> {
        const { id } = input;
        for (const category of this.categories) {
            if (category.id === id) return true;
        };
        return false;
    };

    public async findByIdAndUserId(input: CategoryGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        for (const category of this.categories) {
            if (category.id === id && category.user_id === user_id)
                return true;
        };
        return false;
    };

    public async insert(input: Category): Promise<Category | null> {
        this.categories.push(input);
        const output = Category.with({
            id: this.categories[this.categories.length - 1].id,
            name: this.categories[this.categories.length - 1].name,
            user_id: this.categories[this.categories.length - 1].user_id
        });
        return output;
    };

    public async update(input: Category): Promise<Category | null> {
        const { id, name, user_id } = input;
        const index = this.categories.findIndex((category) => category.id === id && category.user_id === user_id);
        const output = Category.with({
            id: this.categories[index].id,
            name,
            user_id: this.categories[index].user_id,
        });
        this.categories[index] = output;
        return output;
    };

    public async select(input: CategoryGatewaySelectInputDTO): Promise<Category | null> {
        const { id, user_id } = input;
        const category = this.categories.find(t => {
            if (t.id !== id) return false;

            if (user_id) {
                if (t.user_id !== null && t.user_id !== user_id) return false;
            }
            else {
                if (t.user_id !== null) return false;
            };

            return true;
        });

        if (!category) return null;
        const output = Category.with({
            id: category.id,
            name: category.name,
            user_id: category.user_id
        });
        return output;
    };

    public async list(input: CategoryGatewayListInputDTO): Promise<Category[]> {
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
