"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlan = void 0;
class WorkoutPlan {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    ;
    static create(data) {
        const workoutPlanId = crypto.randomUUID();
        const workoutPlan = new WorkoutPlan(Object.assign({ id: workoutPlanId }, data));
        return workoutPlan;
    }
    ;
    static with(props) {
        const workoutPlan = new WorkoutPlan(props);
        return workoutPlan;
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
    get user_id() {
        return this.props.user_id;
    }
    ;
    get workoutDays() {
        return this.props.workoutDays;
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
        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");
        if (this.props.workoutDays && !Array.isArray(this.props.workoutDays))
            throw new Error("Selecione um Dia de Treino válido!");
    }
    ;
}
exports.WorkoutPlan = WorkoutPlan;
;
