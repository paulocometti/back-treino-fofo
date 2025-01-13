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
        
        for (const exercise of this.exercises) {
            if (exercise.name !== name) continue;
            if (id && exercise.id === id) continue;
            if (user_id) {
                if (exercise.user_id !== null && exercise.user_id !== user_id) continue;
            };
            return true;
        };
        return false;
    }

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdInputDTO): Promise<boolean> {
        const { id, user_id } = input;
        return this.exercises.some(exercise => exercise.id === id && exercise.user_id === user_id);
    }

    public async insert(input: Exercise): Promise<Exercise | null> {
        this.exercises.push(input);

        for(const category of input.categories){
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            };
            this.exercisesCategories.push({
                exercise_id: input.id,
                category_id: category.id
            });
        };

        const categories = this.findCategoriesByExerciseId(input.id);
        const output = Exercise.with({
            id: this.exercises[this.exercises.length - 1].id,
            name: this.exercises[this.exercises.length - 1].name,
            user_id: this.exercises[this.exercises.length - 1].user_id,
            categories: categories
        });
        return output;
    };

    public async update(input: Exercise): Promise<Exercise | null> {
        const index = this.exercises.findIndex(ex => ex.id === input.id && ex.user_id === input.user_id);
        
        if (index === -1) return null;

        this.exercises[index] = input;

        this.exercisesCategories = this.exercisesCategories.filter(ec => ec.exercise_id !== input.id);

        const categoriesInput = input.categories;
        
        for(const category of categoriesInput){
            if (!this.categories.find(c => c.id === category.id)) {
                this.categories.push(category);
            };
            this.exercisesCategories.push({
                exercise_id: input.id,
                category_id: category.id
            });
        };

        const categories = this.findCategoriesByExerciseId(input.id);
        const output = Exercise.with({
            id: input.id,
            name: input.name,
            user_id: input.user_id,
            categories: categories
        });
        return output;
    }

    public async select(input: ExerciseGatewaySelectInputDTO): Promise<Exercise | null> {
        const { id, user_id } = input;
        const exercise = this.exercises.find(t => {
            if (t.id !== id) return false;

            if (user_id) {
                if (t.user_id !== null && t.user_id !== user_id) return false;
            }
            else {
                if (t.user_id !== null) return false;
            };

            return true;
        });
        if (!exercise) return null;

        const categories: Category[] = this.findCategoriesByExerciseId(exercise.id);
        return Exercise.with({
            id: exercise.id,
            name: exercise.name,
            user_id: exercise.user_id,
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
