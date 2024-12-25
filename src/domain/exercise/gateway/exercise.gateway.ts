import { Exercise, ExerciseProps } from "../exercise";

export type ExerciseGateway = {
    insert(data: ExerciseProps): Promise<Exercise>,
    list(id_user?: string): Promise<Exercise[]>
};