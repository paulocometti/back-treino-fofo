export interface ExerciseGatewayExistsDTO {
    id?: string;
    name: string;
    user_id: string | null;
};

export interface ExerciseGatewayFindByIdAndUserIdDTO {
    id: string;
    user_id: string | null;
};

export interface ExerciseGatewaySelectDTO {
    id: string;
    user_id: string | null;
};

export interface ExerciseGatewayListDTO {
    user_id?: string | null;
};
