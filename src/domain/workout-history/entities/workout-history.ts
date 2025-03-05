import crypto from 'crypto';

export type WorkoutHistoryEntityProps = {
    id: string;
    user_id: string;
    created_date: Date;

    workout_plan: string | null;
    workout_day: string | null;
    duration: number | null;
    observation: string | null;
};

export type WorkoutHistoryEntityCreateProps = {
    user_id: string;
    created_date: Date;

    workout_plan: string | null;
    workout_day: string | null;
    duration: number | null;
    observation: string | null;
};

export class WorkoutHistory {

    private constructor(private props: WorkoutHistoryEntityProps) {
        this.validate();
    };

    public static create(data: WorkoutHistoryEntityCreateProps) {
        const workoutHistoryId: string = crypto.randomUUID();
        const workoutHistory = new WorkoutHistory({
            id: workoutHistoryId,
            ...data
        });
        return workoutHistory;
    };

    public static with(props: WorkoutHistoryEntityProps) {
        const workoutHistory = new WorkoutHistory(props);
        return workoutHistory;
    };

    public get id() {
        return this.props.id;
    };

    public get user_id() {
        return this.props.user_id;
    };

    public get created_date() {
        return this.props.created_date;
    };

    public get workout_plan() {
        return this.props.workout_plan;
    };

    public get workout_day() {
        return this.props.workout_day;
    };

    public get duration() {
        return this.props.duration;
    };

    public get observation() {
        return this.props.observation;
    };

    private validate() {
        //id
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(this.props.id))
            throw new Error("Id inválido, não é um UUID.");

        //created_date
        if (!(this.props.created_date instanceof Date) || isNaN(this.props.created_date.getTime()))
            throw new Error("A data informada precisa ser válida!");
        const createdUTC = this.props.created_date;
        const now = new Date();
        const startOfYesterdayUTC = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 1,
            0, 0, 0, 0
        ));
        const endOfTodayUTC = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            23, 59, 59, 999
        ));
        if (createdUTC < startOfYesterdayUTC || createdUTC > endOfTodayUTC)
            throw new Error("A data de criação deve estar entre ontem e hoje.");

        //workout_plan
        if (typeof this.props.workout_plan === "string") {
            const trimmedWorkoutPlan = this.props.workout_plan.trim();

            if (trimmedWorkoutPlan.length === 0)
                throw new Error("Escolha um Plano de Treino com Nome do Plano correto, sendo pelo menos 1 caractér!");

            if (trimmedWorkoutPlan.length > 30)
                throw new Error("Escolha um Plano de Treino com Nome do Plano correto, sendo até 30 caractéres!");
        };

        //workout_day
        if (typeof this.props.workout_day === "string") {
            const trimmedWorkoutDay = this.props.workout_day.trim();

            if (trimmedWorkoutDay.length === 0)
                throw new Error("Escolha um Plano de Treino com Nome do Dia correto, sendo pelo menos 1 caractér!");

            if (trimmedWorkoutDay.length > 30)
                throw new Error("Escolha um Plano de Treino com Nome do Dia correto, sendo até 30 caractéres!");
        };

        //duration
        if (this.props.duration != null) {
            if (!Number.isInteger(this.props.duration))
                throw new Error("O Número de repetições deve ser um inteiro positivo!");
            if (this.props.duration <= 0 || this.props.duration >= (24 * 60))
                throw new Error("O Número de repetições deve ser um inteiro positivo ou até 1440 minutos!");
        };

        //observation
        if (typeof this.props.observation === "string") {
            const trimmedObservation = this.props.observation.trim();

            if (trimmedObservation.length === 0)
                throw new Error("Digite uma Observação corretamente com pelo menos 1 caractér!");

            if (trimmedObservation.length > 30)
                throw new Error("Digite uma Observação abaixo de 250 caractéres!");
        };

        //user_id
        if (this.props.user_id && !uuidRegex.test(this.props.user_id))
            throw new Error("Selecione um Usuário válido!");
    };

};
