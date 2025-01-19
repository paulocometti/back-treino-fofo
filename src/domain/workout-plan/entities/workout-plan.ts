export type WorkoutPlanEntityProps = {
    id: string;
    name: string;
    user_id: string | null;
};

export type WorkoutPlanEntityCreateProps = {
    name: string;
    user_id: string | null;
};

export class WorkoutPlan {

    private constructor(private props: WorkoutPlanEntityProps) {
        this.validate();
    };

    public static create(data: WorkoutPlanEntityCreateProps) {
        const workoutPlanId: string = crypto.randomUUID();
        const workoutPlan = new WorkoutPlan({
            id: workoutPlanId,
            ...data
        });
        return workoutPlan;
    };

    public static with(props: WorkoutPlanEntityProps) {
        const workoutPlan = new WorkoutPlan(props);
        return workoutPlan;
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
    };

};
