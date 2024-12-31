import { CategoryGatewayExistsDTO, CategoryGatewayListDTO, CategoryGatewaySelectDTO } from "../dtos/category-dtos";
import { Category } from "../entities/category";

export interface CategoryGateway {
    existsByName(dto: CategoryGatewayExistsDTO): Promise<boolean>;
    insert(dto: Category): Promise<Category>;
    update(dto: Category): Promise<Category>;
    select(dto: CategoryGatewaySelectDTO): Promise<Category | null>;
    list(dto: CategoryGatewayListDTO): Promise<Category[]>;
};
