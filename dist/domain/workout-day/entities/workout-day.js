"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutDay = void 0;
class WorkoutDay {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    ;
    static create(data) {
        const workoutDayId = crypto.randomUUID();
        const workoutDay = new WorkoutDay(Object.assign({ id: workoutDayId }, data));
        return workoutDay;
    }
    ;
    static with(props) {
        const workoutDay = new WorkoutDay(props);
        return workoutDay;
    }
    ;
    get id() {
        return this.props.id;
    }
    ;
    get name() {
        return this.props.name;
    }
    ;
    //public get workout_plan_id() {
    //    return this.props.workout_plan_id;
    //};
    get workoutExercises() {
        return this.props.workoutExercises;
    }
    ;
    validate() {
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
    }
    ;
}
exports.WorkoutDay = WorkoutDay;
;
