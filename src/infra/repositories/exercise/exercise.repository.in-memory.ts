import { ExerciseGateway } from "../../../domain/exercise/gateway/exercise.gateway";
import { Exercise } from "../../../domain/exercise/entities/exercise";
import { ExerciseGatewayExistsDTO, ExerciseGatewayFindByIdAndUserIdDTO, ExerciseGatewayListDTO, ExerciseGatewaySelectDTO } from "../../../domain/exercise/dtos/exercise-dtos";

export class ExerciseRepositoryInMemory implements ExerciseGateway {
    private exercises: Exercise[] = [];

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

    public async insert(input: Exercise): Promise<Exercise> {
        this.exercises.push(input);
        const output = Exercise.with({
            id: this.exercises[this.exercises.length - 1].id,
            name: this.exercises[this.exercises.length - 1].name,
            category_id: this.exercises[this.exercises.length - 1].category_id,
            user_id: this.exercises[this.exercises.length - 1].user_id
        });
        return output;
    };

    public async update(input: Exercise): Promise<Exercise> {
        const { id, name, category_id, user_id } = input;
        const index = this.exercises.findIndex((exercise) => exercise.id === id && exercise.user_id === user_id);
        const newExercise = Exercise.with({
            id: this.exercises[index].id,
            name,
            category_id,
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
            category_id: exercise.category_id,
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
                category_id: t.category_id,
                user_id: t.user_id
            })
            output.push(exercise);
        };

        return output;
    };

};
