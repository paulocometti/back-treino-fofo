import { Exercise, ExerciseProps } from "../exercise";

export type ExerciseGateway = {
    save(data: ExerciseProps): Promise<Exercise>,
    list(id_user?: string): Promise<Exercise[]>
};