import { ExerciseGateway, ExerciseGatewayExistsxistsByNameInputDTO, ExerciseGatewayFindByIdAndUserIdInputDTO, ExerciseGatewayListInputDTO, ExerciseGatewaySelectInputDTO } from "../../../domain/exercise/gateway/exercise.gateway";
import { Exercise } from "../../../domain/exercise/entities/exercise";
import { Category } from "../../../domain/category/entities/category";

export class ExerciseRepositoryInMemory implements ExerciseGateway {
    private exercises: Exercise[] = [];
    private categories: Category[] = [];
    private exercisesCategories: { exercise_id: string, category_id: string }[] = [];

    private constructor() { }

    public static create() {
        return new ExerciseRepositoryInMemory();
    }

    private findCategoriesByExerciseId(exerciseId: string): Category[] {
        return this.exercisesCategories
            .filter(ec => ec.exercise_id === exerciseId)
            .map(ec => {
                const foundCategory = this.categories.find(c => c.id === ec.category_id);
                if (!foundCategory) throw new Error("Category not found");
                return Category.with(foundCategory);
            });
    }

    public async existsByName(input: ExerciseGatewayExistsxistsByNameInputDTO): Promise<boolean> {
        const { id, name, user_id } = input;
        return this.exercises.some(exercise =>
            exercise.name === name &&
            (!id || exercise.id !== id) &&
            (!user_id || exercise.user_id === user_id)
        );
    }

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        return this.exercises.some(exercise => exercise.id === id && exercise.user_id === user_id);
    }

    public async insert(input: Exercise): Promise<Exercise> {
        this.exercises.push(input);

        input.categories.forEach(category => {
            this.exercisesCategories.push({
                exercise_id: input.id,
                category_id: category.id
            });
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            }
        });

        const categories = this.findCategoriesByExerciseId(input.id);
        return Exercise.with({
            id: input.id,
            name: input.name,
            user_id: input.user_id,
            categories: categories
        });
    };

    public async update(input: Exercise): Promise<Exercise> {
        const index = this.exercises.findIndex(ex => ex.id === input.id && ex.user_id === input.user_id);
        if (index === -1) throw new Error("Exercise not found");

        // Atualiza os dados do exercício
        this.exercises[index] = input;

        // Remove relacionamentos antigos
        this.exercisesCategories = this.exercisesCategories.filter(ec => ec.exercise_id !== input.id);

        const categoriesInput = input.categories;
        categoriesInput.forEach(category => {
            this.exercisesCategories.push({
                exercise_id: input.id,
                category_id: category.id
            });
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            }
        });

        const categories = this.findCategoriesByExerciseId(input.id);
        return Exercise.with({
            id: input.id,
            name: input.name,
            user_id: input.user_id,
            categories: categories
        });
    }

    public async select(input: ExerciseGatewaySelectInputDTO): Promise<Exercise | null> {
        const { id, user_id } = input;
        const foundExercise = this.exercises.find(ex =>
            ex.id === id &&
            (!user_id || ex.user_id === user_id)
        );
        if (!foundExercise) return null;

        const categories = this.findCategoriesByExerciseId(foundExercise.id);
        return Exercise.with({
            id: foundExercise.id,
            name: foundExercise.name,
            user_id: foundExercise.user_id,
            categories: categories
        });
    }

    public async list(input: ExerciseGatewayListInputDTO): Promise<Exercise[]> {
        const { user_id } = input;
        const filteredExercises = this.exercises.filter(ex =>
            ex.user_id === user_id || ex.user_id === null
        );
        return filteredExercises.map(ex => {
            const categories = this.findCategoriesByExerciseId(ex.id);
            return Exercise.with({
                id: ex.id,
                name: ex.name,
                user_id: ex.user_id,
                categories: categories
            });
        });
    }
}
