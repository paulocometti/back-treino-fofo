import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { ExerciseGateway, ExerciseGatewayListInputDTO } from "../../../domain/exercise/exercise.gateway";
import { Usecase } from "../../usecase";

type ListExerciseInputDto = void;

export type ListExerciseUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type ListExerciseOutputDto = {
    exercises: {
        id: string;
        name: string;
        categories: {
            id: string;
            name: string;
            user_id: string | null;
        }[];
    }[];
};

export class ListExerciseUsecase implements Usecase<ListExerciseInputDto, ListExerciseUserDto, ListExerciseOutputDto>{
    
    private constructor(private readonly exerciseGateway: ExerciseGateway){}

    public static create(exerciseGateway: ExerciseGateway){
        return new ListExerciseUsecase(exerciseGateway);
    };

    public async execute(_: ListExerciseInputDto, user: ListExerciseUserDto): Promise<ListExerciseOutputDto> {
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: ExerciseGatewayListInputDTO = { user_id: userIdCondition };
        const aExercises = await this.exerciseGateway.list(input);
        const output = this.presentOutput(aExercises);
        return output;
    };

    private presentOutput(exercises: Exercise[]): ListExerciseOutputDto {
        let output = [];

        for(const t of exercises){
            let categories = [];
            for(const th of t.categories){
                categories.push({
                    id: th.id,
                    name: th.name,
                    user_id: th.user_id
                });
            };
            const exercise = {
                    id: t.id,
                    name: t.name,
                    user_id: t.user_id,
                    categories: categories
            };
            output.push(exercise);
        };

        return { exercises: output };
    };

};
