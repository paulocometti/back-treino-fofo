import { Exercise } from "../../../domain/exercise/entities/exercise";
import { User } from "../../../domain/user/entities/user";
import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { Usecase } from "../../usecase"
import { CategoryGateway } from "../../../domain/category/gateway/category.gateway";
import { Category } from "../../../domain/category/entities/category";

export type CreateExerciseInputDto = {
    name: string;
    user_id?: string | null;
    categories: {
        id: string;
        name: string;
        user_id: string | null;
    }[];
};

export type CreateExerciseUserInputDto = {
    id: string,
    name: string,
    role: 'USER' | 'ADMIN'
};

export type CreateExerciseOutputDto = {
    exercise: {
        id: string;
        name: string;
        user_id: string | null;
        categories: {
            id: string;
            name: string;
            user_id: string | null;
        }[];
    }
};

export class CreateExerciseUsecase
    implements Usecase<CreateExerciseInputDto, CreateExerciseUserInputDto, CreateExerciseOutputDto> {

    private constructor(private readonly categoryGateway: CategoryGateway, private readonly exerciseGateway: ExerciseGateway,) { }

    public static create(categoryGateway: CategoryGateway, exerciseGateway: ExerciseGateway,) {
        return new CreateExerciseUsecase(categoryGateway, exerciseGateway);
    };

    public async execute(req: CreateExerciseInputDto, user: CreateExerciseUserInputDto): Promise<CreateExerciseOutputDto> {
        const { name: exerciseName, categories } = req;
        let aCategories: Category[] = [];
        const { id: userId, role: userRole } = User.with(user);
        const userIdCondition = userRole === 'ADMIN' ? null : userId;
        
        const testExerciseExistsByName = await this.exerciseGateway.existsByName({ name: exerciseName, user_id: userIdCondition });
        if (testExerciseExistsByName === true) throw new Error('Já existe um Exercício com este nome. Por favor, tente outro nome!');
        if (categories && Array.isArray(categories) && categories.length > 0) {
            for (const t of categories) {
                const category = await this.categoryGateway.select(t);
                if (category === null) 
                    throw new Error('A Categoria selecionada não é válida. Por favor, tente escolher outra!');
                const categoryNotOfficial = category.user_id !== null;
                if(categoryNotOfficial && category.user_id !== user.id) 
                    throw new Error('A Categoria existe porém não pode ser selecionada pois não é válida. Por favor, tente escolher outra!');
                aCategories.push(Category.with({
                    id: category.id,
                    name: category.name,
                    user_id: category.user_id
                }));
            };
        };
        const aExercise = Exercise.create({ name: exerciseName, user_id: userIdCondition, categories: aCategories });
        
        const result = await this.exerciseGateway.insert(aExercise);
        if(result === null) throw new Error();
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(exercise: Exercise): CreateExerciseOutputDto {
        let categories = [];
        for(const t of exercise.categories){
            categories.push({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            });
        };
        const output = {
            id: exercise.id,
            name: exercise.name,
            user_id: exercise.user_id,
            categories: categories
        };
        return { exercise: output };
    };
};