import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { Exercise } from "../../../domain/exercise/entities/exercise";
import { ExerciseGatewayExistsDTO, ExerciseGatewayFindByIdAndUserIdDTO, ExerciseGatewayListDTO, ExerciseGatewaySelectDTO } from "../../../domain/exercise/dtos/exercise-dtos";
import { Category } from "../../../domain/category/entities/category";

export class ExerciseRepositoryInMemory implements ExerciseGateway {
    private exercises: Exercise[] = [];
    private exercisesCategories: { exercise_id: string, category_id: string }[] = [];

    private constructor() { }

    public static create() {
        return new ExerciseRepositoryInMemory();
    };

    public async existsByName(input: ExerciseGatewayExistsDTO): Promise<boolean> {
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
    };

    public async findByIdAndUserId(input: ExerciseGatewayFindByIdAndUserIdDTO): Promise<boolean> {
        const { id, user_id } = input;
        for (const exercise of this.exercises) {
            if (exercise.id === id && exercise.user_id === user_id)
                return true;
        };
        return false;
    };

    public async insert(inputExercise: Exercise, inputCategories: Category[]): Promise<any> {
        this.exercises.push(inputExercise);

        for(const t of inputCategories){
            this.exercisesCategories.push({
                exercise_id: inputExercise.id,
                category_id: t.id
            });
        };

        const index = this.exercises.length - 1;
        const exerciseId = this.exercises[index].id;
        const exerciseName = this.exercises[index].name;
        const exerciseUserId = this.exercises[index].user_id;
        const exercisesCategories = this.exercisesCategories.filter(th => th.exercise_id === exerciseId);
        
        const output = Exercise.with({
            id: exerciseId,
            name: exerciseName,
            user_id: exerciseUserId
        });
        return output;
    };

    public async update(inputExercise: Exercise, inputCategories: Category[]): Promise<any> {
        const { id, name, user_id } = inputExercise;
        const index = this.exercises.findIndex((exercise) => exercise.id === id && exercise.user_id === user_id);
        const newExercise = Exercise.with({
            id: this.exercises[index].id,
            name,
            user_id: this.exercises[index].user_id,
        });
        this.exercises[index] = newExercise;
        return newExercise;
    };

    public async select(input: ExerciseGatewaySelectDTO): Promise<Exercise | null> {
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
        const output = Exercise.with({
            id: exercise.id,
            name: exercise.name,
            user_id: exercise.user_id
        });
        return output;
    };

    public async list(input: ExerciseGatewayListDTO): Promise<Exercise[]> {
        let { user_id } = input;
        const exercisesWithUserIdNull: Exercise[] = this.exercises.filter(t => t.user_id === null);
        let exercisesWithUserIdSameEqualsUser: Exercise[] = [];
        if (user_id)
            exercisesWithUserIdSameEqualsUser = this.exercises.filter(t => t.user_id === user_id);

        const resultCategories = exercisesWithUserIdNull.concat(exercisesWithUserIdSameEqualsUser);

        let output = [];
        for (const t of resultCategories) {
            const exercise: Exercise = Exercise.with({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            })
            output.push(exercise);
        };

        return output;
    };

};
