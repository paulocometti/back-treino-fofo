import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { ExerciseGateway } from "../../../domain/exercise/exercise.gateway";
import { Usecase } from "../../usecase";

export type SelectExerciseInputDto = {
    id: string
};

export type SelectExerciseUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type SelectExerciseOutputDto = {
    exercise: {
        id: string;
        name: string;
        user_id: string | null;
        categories: {
            id: string;
            name: string;
            user_id: string | null;
        }[];
    };
};

export class SelectExerciseUsecase implements Usecase<SelectExerciseInputDto, SelectExerciseUserDto, SelectExerciseOutputDto> {

    private constructor(private readonly exerciseGateway: ExerciseGateway) { }

    public static create(exerciseGateway: ExerciseGateway) {
        return new SelectExerciseUsecase(exerciseGateway);
    };

    public async execute(req: SelectExerciseInputDto, user: SelectExerciseUserDto): Promise<SelectExerciseOutputDto> {
        const { id } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input = { id, user_id: userIdCondition };
        const aExercise = await this.exerciseGateway.select(input);
        if (aExercise === null) throw new Error('Nada encontrado.');
        const output = this.presentOutput(aExercise);
        return output;
    };

    private presentOutput(exercise: Exercise): SelectExerciseOutputDto {
        let categories = [];
        for(const t of exercise.categories){
            categories.push({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            });
        };
        const output = {
            exercise: {
                id: exercise.id,
                name: exercise.name,
                user_id: exercise.user_id,
                categories: categories
            }
        };
        return output;
    };

};
