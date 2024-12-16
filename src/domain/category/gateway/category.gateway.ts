import { Category } from "../entities/category";

export interface CategoryGateway {
    save(category: Category): Promise<Category>;
    list(user_id?: string): Promise<Category[]>;
}