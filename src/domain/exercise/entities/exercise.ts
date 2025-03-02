import { Category } from "../../category/entities/category";
import crypto from 'crypto';

export type ExerciseEntityProps = {
    id: string;
    name: string;
    user_id: string | null;
    categories: Category[];
};

export type ExerciseEntityCreateProps = {
    name: string;
    user_id: string | null;
    categories: Category[];
};

export class Exercise {

    private constructor(private props: ExerciseEntityProps) {
        this.validate();
    };

    public static create(data: ExerciseEntityCreateProps) {
        const exerciseId: string = crypto.randomUUID();
        const exercise = new Exercise({
            id: exerciseId,
            ...data
        });
        return exercise;
    };

    public static with(props: ExerciseEntityProps) {
        const exercise = new Exercise(props);
        return exercise;
    };

    public get id() {
        return this.props.id;
    };

    public get name() {
        return this.props.name;
    };

    public get user_id() {
        return this.props.user_id;
    };

    public get categories() {
        return this.props.categories;
    }

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

        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");

        if (this.props.categories && !Array.isArray(this.props.categories))
            throw new Error("Categorias deve ser um array de Categoria!");
    };

};


