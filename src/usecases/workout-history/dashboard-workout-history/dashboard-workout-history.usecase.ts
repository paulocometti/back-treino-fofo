import { User } from "../../../domain/user/entities/user";
import { Usecase } from "../../usecase";
import { UserInputDto } from "../../../middleware/keycloakAuth.middleware";
import { WorkoutHistoryGateway } from "../../../domain/workout-history/workout-history.gateway";

export type DashboardWorkoutHistoryUsecaseInputDto = {
  timezone?: string | null;
};

export type DashboardWorkoutHistoryUsecaseOutputDto = {
  dashboard: {
    today: string;
    days: { order: number; day: number; dayString: string; trained: boolean | null }[];
    trainedDays: number;
  };
  lastWorkout: {
    workout_plan: string;
    workout_day: string;
    workout_categories: string;
    workout_count_exercises: number;
    duration: number;
    observation: string;
  } | null;
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
  ) {}

  public static create(
    workoutHistoryGateway: WorkoutHistoryGateway
  ) {
    return new DashboardWorkoutHistoryUsecase(workoutHistoryGateway);
  }

  public async execute(req: DashboardWorkoutHistoryUsecaseInputDto, user: UserInputDto): Promise<DashboardWorkoutHistoryUsecaseOutputDto> {
    const { id: userId } = User.with(user);
    const timeZone = req?.timezone || 'America/Sao_Paulo';
    const result = await this.workoutHistoryGateway.select(userId, 10);
    return this.presentOutput(result, timeZone);
  }

  private presentOutput(result: any, timeZone: string): DashboardWorkoutHistoryUsecaseOutputDto {
    // Configuração dos dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const now = new Date();
    const localNow = convertToLocalDate(now.toISOString(), timeZone);

    type DayData = {
      abbr: string;
      date: Date;
      trained: boolean | null;
      latestWorkout?: Date;
    };

    // Cria o array dos últimos 7 dias
    const last7Days: DayData[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(localNow);
      d.setDate(localNow.getDate() - i);
      const abbr = weekDays[d.getDay()];
      // Dias futuros recebem null
      const trained = (d > localNow) ? null : false;
      last7Days.push({ abbr, date: d, trained });
    }

    // Atualiza o status de treino com base no resultado
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
          }
        }
      }
    }

    const trainedDaysCount = last7Days.filter(day => day.trained === true && day.date <= localNow).length;

    // Formata a saída dos dias para o dashboard
    const daysOutput: { order: number; day: number; dayString: string; trained: boolean | null }[] = [];
    let index = 1;
    for (const dayObj of last7Days) {
      daysOutput.push({
        order: index,
        day: dayObj.date.getDate(),
        dayString: dayObj.abbr,
        trained: dayObj.trained,
      });
      index++;
    }

    const todayAbbr = weekDays[localNow.getDay()];

    // Último treino
    let lastWorkout = null;
    if (result && Array.isArray(result) && result.length > 0) {
      lastWorkout = {
        workout_plan: result[0].workout_plan,
        workout_day: result[0].workout_day,
        workout_categories: result[0].workout_categories,
        workout_count_exercises: result[0].workout_count_exercises,
        duration: result[0].duration,
        observation: result[0].observation,
      };
    }

    return {
      dashboard: {
        today: todayAbbr,
        days: daysOutput,
        trainedDays: trainedDaysCount,
      },
      lastWorkout,
    };
  }
}
