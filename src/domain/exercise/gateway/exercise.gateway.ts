import { Category } from "@prisma/client";
import { ExerciseGatewayExistsDTO, ExerciseGatewayFindByIdAndUserIdDTO, ExerciseGatewayListDTO, ExerciseGatewaySelectDTO } from "../dtos/exercise-dtos";
import { Exercise } from "../entities/exercise";

export interface ExerciseGateway {
    existsByName(dto: ExerciseGatewayExistsDTO): Promise<boolean>;
    findByIdAndUserId(dto: ExerciseGatewayFindByIdAndUserIdDTO): Promise<boolean>;
    insert(dtoExercise: Exercise, dtoCategories: Category[]): Promise<Exercise>;
    update(dtoExercise: Exercise, dtoCategories: Category[]): Promise<Exercise>;
    select(dto: ExerciseGatewaySelectDTO): Promise<Exercise | null>;
    list(dto: ExerciseGatewayListDTO): Promise<Exercise[]>;
};
