import { Category } from "../entities/category";

export interface CategoryGateway {
    existsByName(category: Category, user_id?: string | null): Promise<boolean>;
    insert(category: Category): Promise<Category>;
    select(id: string): Promise<Category | null>;
    list(user_id?: string): Promise<Category[]>;
};
