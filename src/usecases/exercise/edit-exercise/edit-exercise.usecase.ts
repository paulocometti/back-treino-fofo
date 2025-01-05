import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { Usecase } from "../../usecase"
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";

export type EditExerciseInputDto = {
    id: string,
    name: string;
    category_id: string | null;
    user_id?: string | null;
};

export type EditExerciseUserDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type EditExerciseOutputDto = {
    id: string;
    name: string;
    category_id: string | null;
    user_id: string | null;
};

export class EditExerciseUsecase 
    implements Usecase<EditExerciseInputDto, EditExerciseUserDto, EditExerciseOutputDto>{

    private constructor(private readonly categoryGateway: CategoryGateway, private readonly exerciseGateway: ExerciseGateway){}

    public static create(categoryGateway: CategoryGateway,exerciseGateway: ExerciseGateway){
        return new EditExerciseUsecase(categoryGateway, exerciseGateway);
    };

    public async execute(req: EditExerciseInputDto, user: EditExerciseUserDto): Promise<EditExerciseOutputDto>{
        const { id: exerciseId, name: exerciseName, category_id: categoryId } = req;
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        const input: Exercise = Exercise.with({ id: exerciseId, name: exerciseName, category_id: categoryId, user_id: userIdCondition});
        const found = await this.exerciseGateway.findByIdAndUserId({ id: exerciseId, user_id: userIdCondition});
        if(found === false) throw new Error('O Exercício que você está tentando editar não existe!');
        const testExerciseExistsByName = await this.exerciseGateway.existsByName({name: exerciseName, user_id: userIdCondition});
        if(testExerciseExistsByName === true) throw new Error('Já existe um Exercício com este nome. Por favor, tente outro nome!');
        if(categoryId){
            const testCategoryIsValid = await this.categoryGateway.findById({ id: categoryId });
            if(testCategoryIsValid === false) throw new Error('A Categoria selecionada não é válida. Por favor, tente escolher outra!');
        };
        const result = await this.exerciseGateway.update(input);
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(exercise: Exercise): EditExerciseOutputDto {
        const output: EditExerciseOutputDto = {
            id: exercise.id,
            name: exercise.name,
            category_id: exercise.category_id,
            user_id: exercise.user_id
        };
        return output;
    }
};