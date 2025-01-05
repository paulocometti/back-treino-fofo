import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { Usecase } from "../../usecase"
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";

export type CreateExerciseInputDto = {
    name: string;
    category_id: string | null;
    user_id?: string | null;
};

export type CreateExerciseUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type CreateExerciseOutputDto = {
    id: string;
    name: string;
    category_id: string | null;
    user_id: string | null;
};

export class CreateExerciseUsecase 
    implements Usecase<CreateExerciseInputDto, CreateExerciseUserDto, CreateExerciseOutputDto>{

    private constructor(private readonly categoryGateway: CategoryGateway, private readonly exerciseGateway: ExerciseGateway, ){}

    public static create(categoryGateway: CategoryGateway, exerciseGateway: ExerciseGateway, ){
        return new CreateExerciseUsecase(categoryGateway, exerciseGateway);
    };

    public async execute(req: CreateExerciseInputDto, user: CreateExerciseUserDto): Promise<CreateExerciseOutputDto>{
        const { name: exerciseName, category_id: categoryId } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const testExerciseExistsByName = await this.exerciseGateway.existsByName({name: exerciseName, user_id: userIdCondition});
        if(testExerciseExistsByName === true) throw new Error('Já existe um Exercício com este nome. Por favor, tente outro nome!');
        if(categoryId){
            const testCategoryIsValid = await this.categoryGateway.findById({ id: categoryId });
            if(testCategoryIsValid === false) throw new Error('A Categoria selecionada não é válida. Por favor, tente escolher outra!');
        };
        const aExercise = Exercise.create({name: exerciseName, category_id: categoryId, user_id: userIdCondition});
        const result = await this.exerciseGateway.insert(aExercise);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(exercise: Exercise): CreateExerciseOutputDto {
        const output: CreateExerciseOutputDto = {
            id: exercise.id,
            name: exercise.name,
            category_id: exercise.category_id,
            user_id: exercise.user_id
        };
        return output;
    }
};