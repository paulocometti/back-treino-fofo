"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutExercise = void 0;
class WorkoutExercise {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    ;
    static create(data) {
        const workoutExerciseId = crypto.randomUUID();
        const workoutExercise = new WorkoutExercise(Object.assign({ id: workoutExerciseId }, data));
        return workoutExercise;
    }
    ;
    static with(props) {
        const workoutExercise = new WorkoutExercise(props);
        return workoutExercise;
    }
    ;
    get id() {
        return this.props.id;
    }
    ;
    get sets() {
        return this.props.sets;
    }
    ;
    get reps() {
        return this.props.reps;
    }
    ;
    get observation() {
        return this.props.observation;
    }
    ;
    get exercise_id() {
        return this.props.exercise_id;
    }
    ;
    get exercise() {
        return this.props.exercise;
    }
    ;
    //public get workout_day_id() {
    //    return this.props.workout_day_id;
    //};
    validate() {
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
        }
        ;
        if (this.props.exercise_id && !uuidRegex.test(this.props.exercise_id))
            throw new Error("Selecione um Exercício válido!");
        //if (this.props.workout_day_id && !uuidRegex.test(this.props.workout_day_id))
        //    throw new Error("Selecione um Dia de Treino válido!");
    }
    ;
}
exports.WorkoutExercise = WorkoutExercise;
;
