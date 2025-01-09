import { Category } from "../entities/category";

export interface CategoryGatewayExistsByNameInputDto {
    id?: string;
    name: string;
    user_id: string | null;
};

export interface CategoryGatewayFindByIdInputDTO {
    id: string;
};

export interface CategoryGatewayFindByIdAndUserIdInputDTO {
    id: string;
    user_id: string | null;
};

export interface CategoryGatewaySelectInputDTO {
    id: string;
    user_id: string | null;
};

export interface CategoryGatewayListInputDTO {
    user_id?: string | null;
};

export interface CategoryGateway {
    existsByName(dto: CategoryGatewayExistsByNameInputDto): Promise<boolean>;
    findById(dto: CategoryGatewayFindByIdInputDTO): Promise<boolean>;
    findByIdAndUserId(dto: CategoryGatewayFindByIdAndUserIdInputDTO): Promise<boolean>;
    insert(dto: Category): Promise<Category>;
    update(dto: Category): Promise<Category>;
    select(dto: CategoryGatewaySelectInputDTO): Promise<Category | null>;
    list(dto: CategoryGatewayListInputDTO): Promise<Category[]>;
};
