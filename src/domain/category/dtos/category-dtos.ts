export interface CategoryGatewayExistsDTO {
    id?: string;
    name: string;
    user_id: string | null;
};

export interface CategoryGatewayFindByIdAndUserIdDTO {
    id: string;
    user_id: string | null;
};

export interface CategoryGatewaySelectDTO {
    id: string;
    user_id: string | null;
};

export interface CategoryGatewayListDTO {
    user_id?: string | null;
};
