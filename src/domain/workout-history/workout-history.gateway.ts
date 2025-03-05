
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
    insert(dto: any): Promise<any>;
    dashboard(dto: CategoryGatewayListInputDTO): Promise<any>;
};
