import { describe, it, expect } from "vitest";
import { z } from "zod";
import crypto from "crypto";
import { WorkoutHistory, WorkoutHistoryEntityCreateProps } from "./workout-history";

export function createWorkoutHistory(): WorkoutHistory {
    const now = new Date();
    const validData: WorkoutHistoryEntityCreateProps = {
        user_id: crypto.randomUUID(),
        created_date: now,
        workout_plan: "Treino A",
        workout_day: "Dia 1",
        duration: 60,
        observation: "Observação válida",
    };
    return WorkoutHistory.create(validData);
}

describe("WorkoutHistory Entity Tests", () => {

    it("deve criar um WorkoutHistory com propriedades válidas", () => {
        const now = new Date();
        const validData: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 60,
            observation: "Observação válida",
        };
        const workoutHistory = WorkoutHistory.create(validData);
        expect(workoutHistory.id).toBeDefined();

        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutHistory.id);
        expect(idValidation.success).toBe(true);

        expect(workoutHistory.user_id).toBe(validData.user_id);
        expect(workoutHistory.created_date).toEqual(validData.created_date);
        expect(workoutHistory.workout_plan).toBe(validData.workout_plan);
        expect(workoutHistory.workout_day).toBe(validData.workout_day);
        expect(workoutHistory.duration).toBe(validData.duration);
        expect(workoutHistory.observation).toBe(validData.observation);
    });

    it("deve criar um WorkoutHistory utilizando o método 'with'", () => {
        const now = new Date();
        const id = crypto.randomUUID();
        const props = {
            id,
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino B",
            workout_day: "Dia 2",
            duration: 90,
            observation: "Observação teste",
        };
        const workoutHistory = WorkoutHistory.with(props);
        expect(workoutHistory).toBeInstanceOf(WorkoutHistory);
        expect(workoutHistory.id).toBe(id);
        expect(workoutHistory.workout_plan).toBe("Treino B");
    });

    it("deve lançar erro quando created_date estiver fora do intervalo permitido", () => {
        // Cria uma data inválida (por exemplo, 2 dias atrás)
        const invalidDate = new Date();
        invalidDate.setDate(invalidDate.getDate() - 2);
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: invalidDate,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("A data de criação deve estar entre ontem e hoje.");
    });

    it("deve lançar erro quando o id for inválido (usando 'with')", () => {
        const now = new Date();
        const invalidId = "1";
        expect(() => {
            WorkoutHistory.with({
                id: invalidId,
                user_id: crypto.randomUUID(),
                created_date: now,
                workout_plan: "Treino A",
                workout_day: "Dia 1",
                duration: 60,
                observation: "Observação válida",
            });
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar erro quando workout_plan for vazio", () => {
        const now = new Date();
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "   ",
            workout_day: "Dia 1",
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Escolha um Plano de Treino com Nome do Plano correto, sendo pelo menos 1 caractér!");
    });

    it("deve lançar erro quando workout_plan for muito longo", () => {
        const now = new Date();
        const longPlan = "a".repeat(31);
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: longPlan,
            workout_day: "Dia 1",
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Escolha um Plano de Treino com Nome do Plano correto, sendo até 30 caractéres!");
    });

    it("deve lançar erro quando workout_day for vazio", () => {
        const now = new Date();
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "   ",
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Escolha um Plano de Treino com Nome do Dia correto, sendo pelo menos 1 caractér!");
    });

    it("deve lançar erro quando workout_day for muito longo", () => {
        const now = new Date();
        const longDay = "a".repeat(31);
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: longDay,
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Escolha um Plano de Treino com Nome do Dia correto, sendo até 30 caractéres!");
    });

    it("deve lançar erro quando duration não for um inteiro", () => {
        const now = new Date();
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 60.5,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("O Número de repetições deve ser um inteiro positivo!");
    });

    it("deve lançar erro quando duration estiver fora do intervalo permitido", () => {
        const now = new Date();
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 0,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("O Número de repetições deve ser um inteiro positivo ou até 1440 minutos!");
    });

    it("deve lançar erro quando observation for vazia", () => {
        const now = new Date();
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: crypto.randomUUID(),
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 60,
            observation: "   ",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Digite uma Observação corretamente com pelo menos 1 caractér!");
    });

    it("deve lançar erro quando user_id for inválido", () => {
        const now = new Date();
        const invalidUserId = "1";
        const data: WorkoutHistoryEntityCreateProps = {
            user_id: invalidUserId,
            created_date: now,
            workout_plan: "Treino A",
            workout_day: "Dia 1",
            duration: 60,
            observation: "Observação válida",
        };
        expect(() => {
            WorkoutHistory.create(data);
        }).toThrowError("Selecione um Usuário válido!");
    });

});
