import { Category } from "../../category/entities/category";
import { Exercise } from "../entities/exercise";

export interface ExerciseGatewayExistsxistsByNameInputDTO {
    id?: string;
    name: string;
    user_id: string | null;
};

export interface ExerciseGatewayFindByIdAndUserIdInputDTO {
    id: string;
    user_id: string | null;
};

export interface ExerciseGatewaySelectInputDTO {
    id: string;
    user_id: string | null;
};

export interface ExerciseGatewayListInputDTO {
    user_id?: string | null;
};



export interface ExerciseGateway {
    existsByName(dto: ExerciseGatewayExistsxistsByNameInputDTO): Promise<boolean>;
    findByIdAndUserId(dto: ExerciseGatewayFindByIdAndUserIdInputDTO): Promise<boolean>;
    insert(dtoExercise: Exercise, dtoCategories: Category[]): Promise<Exercise>;
    update(dtoExercise: Exercise, dtoCategories: Category[]): Promise<Exercise>;
    select(dto: ExerciseGatewaySelectInputDTO): Promise<Exercise | null>;
    list(dto: ExerciseGatewayListInputDTO): Promise<Exercise[]>;
};
