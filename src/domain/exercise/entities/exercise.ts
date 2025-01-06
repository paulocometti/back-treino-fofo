import { Category } from "../../category/entities/category";

export type ExerciseProps = {
    id: string;
    name: string;
    user_id: string | null;
};

export type ExerciseCreateProps = {
    name: string;
    user_id: string | null;
    categories: any[];
};

export type ExerciseUpdateProps = {
    id: string;
    name: string;
};

export class Exercise {

    private constructor(private props: ExerciseProps & { categories: Category[] }) {
        this.validate();
    };

    public static create(data: ExerciseCreateProps & { categories: Category[] }) {
        const exerciseId: string = crypto.randomUUID();
        const exercise = new Exercise({
            id: exerciseId,
            ...data
        });
        return exercise;
    };

    public static with(props: ExerciseProps & { categories: Category[] }) {
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
        if (trimmedName.length === 0 || trimmedName.length > 30)
            throw new Error("Digite um Nome corretamente!");

        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");

        if (this.props.categories && !Array.isArray(this.props.categories))
            throw new Error("Categorias deve ser um array de Categoria!");
    };

};


