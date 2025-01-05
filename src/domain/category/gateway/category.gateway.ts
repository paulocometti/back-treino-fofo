import { CategoryGatewayExistsDTO, CategoryGatewayFindByIdAndUserIdDTO, CategoryGatewayFindByIdDTO, CategoryGatewayListDTO, CategoryGatewaySelectDTO } from "../dtos/category-dtos";
import { Category } from "../entities/category";

export interface CategoryGateway {
    existsByName(dto: CategoryGatewayExistsDTO): Promise<boolean>;
    findById(dto: CategoryGatewayFindByIdDTO): Promise<boolean>;
    findByIdAndUserId(dto: CategoryGatewayFindByIdAndUserIdDTO): Promise<boolean>;
    insert(dto: Category): Promise<Category>;
    update(dto: Category): Promise<Category>;
    select(dto: CategoryGatewaySelectDTO): Promise<Category | null>;
    list(dto: CategoryGatewayListDTO): Promise<Category[]>;
};
