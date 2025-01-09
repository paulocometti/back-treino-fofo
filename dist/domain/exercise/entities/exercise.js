"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = void 0;
class Exercise {
    constructor(props) {
        this.props = props;
        this.validate();
    }
    ;
    static create(data) {
        const exerciseId = crypto.randomUUID();
        const exercise = new Exercise(Object.assign({ id: exerciseId }, data));
        return exercise;
    }
    ;
    static with(props) {
        const exercise = new Exercise(props);
        return exercise;
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
    get categories() {
        return this.props.categories;
    }
    validate() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");
        if (typeof this.props.name !== 'string')
            throw new Error("Digite um Nome corretamente!");
        const trimmedName = this.props.name.trim();
        if (trimmedName.length === 0 || trimmedName.length > 30)
            throw new Error("Digite um Nome corretamente!");
        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");
        if (this.props.categories && !Array.isArray(this.props.categories))
            throw new Error("Categorias deve ser um array de Categoria!");
    }
    ;
}
exports.Exercise = Exercise;
;
