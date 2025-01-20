import { WorkoutExercise } from "../../workout-exercise/entities/workout-exercise";

export type WorkoutDayEntityProps = {
    id: string;
    name: string;
    //workout_plan_id: string;
    workoutExercises: WorkoutExercise[];
};

export type WorkoutDayEntityCreateProps = {
    name: string;
    //workout_plan_id: string;
    workoutExercises: WorkoutExercise[];
};

export class WorkoutDay {

    private constructor(private props: WorkoutDayEntityProps) {
        this.validate();
    };

    public static create(data: WorkoutDayEntityCreateProps) {
        const workoutDayId: string = crypto.randomUUID();
        const workoutDay = new WorkoutDay({
            id: workoutDayId,
            ...data
        });
        return workoutDay;
    };

    public static with(props: WorkoutDayEntityProps) {
        const workoutDay = new WorkoutDay(props);
        return workoutDay;
    };

    public get id() {
        return this.props.id;
    };

    public get name() {
        return this.props.name;
    };

    //public get workout_plan_id() {
    //    return this.props.workout_plan_id;
    //};

    public get workoutExercises() {
        return this.props.workoutExercises;
    };

    private validate() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");

        if (typeof this.props.name !== 'string')
            throw new Error("Digite um Nome corretamente!");

        const trimmedName = this.props.name.trim();
        if (trimmedName.length === 0)
            throw new Error("Digite um Nome corretamente!");

        if (trimmedName.length > 30)
            throw new Error("Digite um Nome abaixo de 30 caracteres!");

        //if (this.props.workout_plan_id && !uuidRegex.test(this.props.workout_plan_id))
        //    throw new Error("Selecione um Plano de Treino válido!");

        if (this.props.workoutExercises && !Array.isArray(this.props.workoutExercises))
            throw new Error("Selecione um Exercício de Treino válido!");
    };

};


