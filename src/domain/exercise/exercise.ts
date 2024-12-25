export type ExerciseProps = {
    id: string;
    name: string;
    category_id: number | null;
    user_id: string | null;
};

export type ExerciseCreateProps = {
    name: string;
    category_id: number | null;
    user_id: string | null;
};

export class Exercise {
    private constructor(private props: ExerciseProps){
        this.validate();
    };

    public static create(data: ExerciseCreateProps){
        const exerciseId: string = crypto.randomUUID();
        const exercise = new Exercise({
            id: exerciseId,
            ...data
        });
        return exercise;
    };

    public static with(props: ExerciseProps){
        const exercise = new Exercise(props);
        return exercise;
    };

    public get id() {
        return this.props.id;
    };

    public get name(){
        return this.props.name;
    };

    public get category_id(){
        return this.props.category_id;
    };

    public get user_id(){
        return this.props.user_id;
    };

    private validate(){
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");

        if (typeof this.props.name !== 'string') 
            throw new Error("Digite um Nome corretamente!");
        
        const trimmedName = this.props.name.trim();
        if (trimmedName.length === 0 || trimmedName.length > 30) 
            throw new Error("Digite um Nome corretamente!");

        if (this.props.category_id && typeof this.props.category_id !== 'number')
            throw new Error("Selecione uma Categoria válida!");

        if (this.props.category_id && typeof this.props.category_id === 'number' && this.props.category_id <= 0)
            throw new Error("Selecione uma Categoria válida!");

        if (this.props.user_id && !uuidRegex.test(this.props.user_id)) 
            throw new Error("Selecione um Usuário válido!");
    };
};