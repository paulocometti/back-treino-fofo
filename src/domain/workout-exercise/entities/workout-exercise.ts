export type WorkoutExerciseEntityProps = {
    id: string;
    sets: number;
    reps: number;
    observation: string | null;

    exercise_id: string;
    exercise?: {
        name: string,
        categories: string[]
    };
    //workout_day_id: string;
};

export type WorkoutExerciseEntityCreateProps = {
    sets: number;
    reps: number;
    observation: string | null;

    exercise_id: string;
    exercise?: {
        name: string,
        categories: string[]
    };
    //workout_day_id: string;
};

export class WorkoutExercise {

    private constructor(private props: WorkoutExerciseEntityProps) {
        this.validate();
    };

    public static create(data: WorkoutExerciseEntityCreateProps) {
        const workoutExerciseId: string = crypto.randomUUID();
        const workoutExercise = new WorkoutExercise({
            id: workoutExerciseId,
            ...data
        });
        return workoutExercise;
    };

    public static with(props: WorkoutExerciseEntityProps) {
        const workoutExercise = new WorkoutExercise(props);
        return workoutExercise;
    };

    public get id() {
        return this.props.id;
    };

    public get sets() {
        return this.props.sets;
    };

    public get reps() {
        return this.props.reps;
    };

    public get observation() {
        return this.props.observation;
    };

    public get exercise_id() {
        return this.props.exercise_id;
    };

    public get exercise() {
        return this.props.exercise;
    };

    //public get workout_day_id() {
    //    return this.props.workout_day_id;
    //};

    private validate() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");

        if (!Number.isInteger(this.props.sets) || this.props.sets <= 0)
            throw new Error("O Número de séries deve ser um inteiro positivo!");
        
        if (!Number.isInteger(this.props.reps) || this.props.reps <= 0)
            throw new Error("O Número de repetições deve ser um inteiro positivo!");

        if (this.props.observation !== null && typeof this.props.observation !== "string")
            throw new Error("Digite uma Observação corretamente!");

        if (typeof this.props.observation === "string") {
            const trimmedObservation = this.props.observation.trim();

            if (trimmedObservation.length < 3)
                throw new Error("Digite uma Observação corretamente com pelo menos 3 caracteres!");

            if (trimmedObservation.length > 30)
                throw new Error("Digite uma Observação abaixo de 30 caracteres!");
        };

        if (this.props.exercise_id && !uuidRegex.test(this.props.exercise_id))
            throw new Error("Selecione um Exercício válido!");

        //if (this.props.workout_day_id && !uuidRegex.test(this.props.workout_day_id))
        //    throw new Error("Selecione um Dia de Treino válido!");
    };

};


