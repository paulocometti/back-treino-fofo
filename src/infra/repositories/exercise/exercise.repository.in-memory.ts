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
    };

    private findCategoriesByExerciseId(exerciseId: string): Category[] {
        return this.exercisesCategories
            .filter(ec => ec.exercise_id === exerciseId)
            .map(ec => {
                const foundCategory = this.categories.find(c => c.id === ec.category_id);
                if (!foundCategory) throw new Error("Category not found");
                return Category.with(foundCategory);
            });
    };

    public async existsByName(input: ExerciseGatewayExistsxistsByNameInputDTO): Promise<boolean> {
        const { id, name, user_id } = input;
        return this.exercises.some(exercise => exercise.name === name && (!id || exercise.id !== id) && (!user_id || exercise.user_id === user_id));
    };

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        return this.exercises.some(exercise => exercise.id === id && exercise.user_id === user_id);
    };

    public async insert(inputExercise: Exercise, inputCategories: Category[]): Promise<Exercise> {
        this.exercises.push(inputExercise);
        inputCategories.forEach(category => {
            this.exercisesCategories.push({
                exercise_id: inputExercise.id,
                category_id: category.id
            });
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            }
        });
        const categories = this.findCategoriesByExerciseId(inputExercise.id);
        return Exercise.with({
            id: inputExercise.id,
            name: inputExercise.name,
            user_id: inputExercise.user_id,
            categories: categories
        });
    };

    public async update(inputExercise: Exercise, inputCategories: Category[]): Promise<Exercise> {
        const index = this.exercises.findIndex(ex => ex.id === inputExercise.id && ex.user_id === inputExercise.user_id);
        //if (index === -1) throw new Error("Exercise not found");
        this.exercisesCategories = this.exercisesCategories.filter(ec => ec.exercise_id !== inputExercise.id);

        inputCategories.forEach(category => {
            this.exercisesCategories.push({
                exercise_id: inputExercise.id,
                category_id: category.id
            });
        });

        const categories = this.findCategoriesByExerciseId(inputExercise.id);

        this.exercises[index] = Exercise.with({
            id: inputExercise.id,
            name: inputExercise.name,
            user_id: inputExercise.user_id,
            categories: categories
        });

        return this.exercises[index];
    };

    public async select(input: ExerciseGatewaySelectInputDTO): Promise<Exercise | null> {
        const { id, user_id } = input;
        const foundExercise = this.exercises.find(ex => ex.id === id && (!user_id || ex.user_id === user_id));
        if (!foundExercise) return null;
        const categories = this.findCategoriesByExerciseId(foundExercise.id);
        return Exercise.with({
            id: foundExercise.id,
            name: foundExercise.name,
            user_id: foundExercise.user_id,
            categories: categories
        });
    };

    public async list(input: ExerciseGatewayListInputDTO): Promise<Exercise[]> {
        const { user_id } = input;
        const filteredExercises = this.exercises.filter(ex => ex.user_id === user_id || ex.user_id === null);
        return filteredExercises.map(ex => {
            const categories = this.findCategoriesByExerciseId(ex.id);
            return Exercise.with({
                id: ex.id,
                name: ex.name,
                user_id: ex.user_id,
                categories: categories
            });
        });
    };
};
