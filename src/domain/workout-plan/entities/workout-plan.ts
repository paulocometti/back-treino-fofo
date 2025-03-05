import { WorkoutDay } from "../../workout-day/entities/workout-day";
import crypto from 'crypto';

export type WorkoutPlanEntityProps = {
    id: string;
    name: string;
    description: string | null;
    user_id: string | null;

    workoutDays: WorkoutDay[];
};

export type WorkoutPlanEntityCreateProps = {
    name: string;
    description: string | null;
    user_id: string | null;

    workoutDays: WorkoutDay[];
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

    public get description() {
        return this.props.description;
    };

    public get user_id() {
        return this.props.user_id;
    };

    public get workoutDays() {
        return this.props.workoutDays;
    };

    private validate() {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");

        //name
        if (typeof this.props.name !== 'string')
            throw new Error("Digite um Nome corretamente!");

        const trimmedName = this.props.name.trim();
        if (trimmedName.length === 0)
            throw new Error("Digite um Nome corretamente!");

        if (trimmedName.length > 30)
            throw new Error("Digite um Nome abaixo de 30 caractéres!");

        //description
        if (typeof this.props.description === "string") {
            const trimmedDescription = this.props.description.trim();

            if (trimmedDescription.length < 3)
                throw new Error("Digite uma Descrição corretamente com pelo menos 3 caractéres!");

            if (trimmedDescription.length > 120)
                throw new Error("Digite uma Descrição abaixo de 120 caractéres!");
        };

        //user_id
        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");

        if (this.props.workoutDays && !Array.isArray(this.props.workoutDays))
            throw new Error("Selecione um Dia de Treino válido!");
    };

};
