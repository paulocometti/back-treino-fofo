import { User } from "../../../domain/user/entities/user";
import { Usecase } from "../../usecase"
import { UserInputDto } from "../../../middleware/keycloakAuth.middleware";
import { WorkoutHistoryGateway } from "../../../domain/workout-history/workout-history.gateway";

export type DashboardWorkoutHistoryUsecaseInputDto = {
    timezone?: string | null
};

export type DashboardWorkoutHistoryUsecaseOutputDto = {
    dashboard: any,
    lastWorkout: any
};

const convertToLocalDate = (dateStr: string, tz: string): Date => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    const second = parts.find(p => p.type === 'second')?.value;
    const localDateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    return new Date(localDateStr);
};

export class DashboardWorkoutHistoryUsecase
    implements Usecase<DashboardWorkoutHistoryUsecaseInputDto, UserInputDto, DashboardWorkoutHistoryUsecaseOutputDto> {

    private constructor(
        private readonly workoutHistoryGateway: WorkoutHistoryGateway
    ) { }

    public static create(
        workoutHistoryGateway: WorkoutHistoryGateway
    ) {
        return new DashboardWorkoutHistoryUsecase(workoutHistoryGateway);
    };

    public async execute(req: DashboardWorkoutHistoryUsecaseInputDto, user: UserInputDto): Promise<DashboardWorkoutHistoryUsecaseOutputDto> {
        const { id: userId } = User.with(user);
        const { timezone } = req;
        const timeZone = req?.timezone || 'America/Sao_Paulo';
        const result = await this.workoutHistoryGateway.select(userId, 10);

        //dashboard
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const now = new Date();
        const localNow = convertToLocalDate(now.toISOString(), timeZone);

        type DayData = {
            abbr: string;
            date: Date;
            trained: boolean | null;
            latestWorkout?: Date;
        };

        const last7Days: DayData[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(localNow);
            d.setDate(localNow.getDate() - i);
            const abbr = weekDays[d.getDay()];
            const trained = (d > localNow) ? null : false;
            last7Days.push({ abbr, date: d, trained });
        }

        for (const workout of result) {
            const createdUtc = workout.props.created_date.toString();
            const localWorkoutDate = convertToLocalDate(createdUtc, timeZone);

            const minDate = new Date(localNow);
            minDate.setDate(localNow.getDate() - 6);
            if (localWorkoutDate >= minDate && localWorkoutDate <= localNow) {
                for (const dayObj of last7Days) {
                    if (
                        localWorkoutDate.getFullYear() === dayObj.date.getFullYear() &&
                        localWorkoutDate.getMonth() === dayObj.date.getMonth() &&
                        localWorkoutDate.getDate() === dayObj.date.getDate()
                    ) {
                        if (!dayObj.latestWorkout || localWorkoutDate > dayObj.latestWorkout) {
                            dayObj.latestWorkout = localWorkoutDate;
                        }
                        dayObj.trained = true;
                    };
                };
            };
        };

        const trainedDaysCount = last7Days.filter(day => day.trained === true && day.date <= localNow).length;

        const daysOutput: { [key: string]: { day: number, trained: boolean | null } } = {};
        for (const dayObj of last7Days) {
            daysOutput[dayObj.abbr] = {
                day: dayObj.date.getDate(),
                trained: dayObj.trained,
            };
        };

        const todayAbbr = weekDays[localNow.getDay()];

        //lastworkout
        let lastWorkout = null;
        if (result && Array.isArray(result) && result.length > 0)
            lastWorkout = {
                workout_plan: result[0].workout_plan,
                workout_day: result[0].workout_day,
                workout_categories: result[0].workout_categories,
                workout_count_exercises: result[0].workout_count_exercises,
                duration: result[0].duration,
                observation: result[0].observation,
            };

        const output = {
            dashboard: {
                today: todayAbbr,
                days: daysOutput,
                trainedDays: trainedDaysCount,
            },
            lastWorkout
        };

        return output;
    };

};