import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { z } from "zod";
import { WorkoutPlan, WorkoutPlanEntityCreateProps } from "./workout-plan";
import crypto from 'crypto';

export function createWorkoutPlan() {
    const workoutPlanName: string = faker.person.firstName('female');
    const workoutPlanUserIdAdmin: string | null = null;
    const data: WorkoutPlanEntityCreateProps = {
        name: workoutPlanName,
        user_id: workoutPlanUserIdAdmin,
        workoutDays: []
    };
    return WorkoutPlan.create(data);
};

describe("WorkoutPlan Entity Test ", () => {
    it("deve criar uma Workout Plan (Treino de Academia) com nome e id válidos para um Usuario com role Admin", () => {
        const workoutPlanName: string = faker.person.firstName('female');
        const workoutPlanUserIdAdmin: string | null = null;
        const data: WorkoutPlanEntityCreateProps = {
            name: workoutPlanName,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        const workoutPlan = WorkoutPlan.create(data);
        expect(workoutPlan.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutPlan.id);
        expect(idValidation.success).toBe(true);
        expect(workoutPlan).toBeInstanceOf(WorkoutPlan);
        expect(workoutPlan.name).toBe(workoutPlanName);
        expect(workoutPlan.user_id).toBe(workoutPlanUserIdAdmin);
    });

    it("deve criar uma Workout Plan (Treino de Academia) com nome e id válidos para um Usuario com role User", () => {
        const workoutPlanName: string = faker.person.firstName('female');
        const workoutPlanUserIdUser: string | null = crypto.randomUUID();
        const data: WorkoutPlanEntityCreateProps = {
            name: workoutPlanName,
            user_id: workoutPlanUserIdUser,
            workoutDays: []
        };
        const workoutPlan = WorkoutPlan.create(data);
        expect(workoutPlan.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutPlan.id);
        expect(idValidation.success).toBe(true);
        expect(workoutPlan).toBeInstanceOf(WorkoutPlan);
        expect(workoutPlan.name).toBe(workoutPlanName);
        expect(workoutPlan.user_id).toBe(workoutPlanUserIdUser);
    });

    it("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com nome inválido", () => {
        const name = "";
        const workoutPlanUserIdAdmin: string | null = null;
        const data: WorkoutPlanEntityCreateProps = {
            name,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        expect(() => {
            WorkoutPlan.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com nome muito longo", () => {
        const longName = "a".repeat(31);
        const workoutPlanUserIdAdmin: string | null = null;
        const data: WorkoutPlanEntityCreateProps = {
            name: longName,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        expect(() => {
            WorkoutPlan.create(data);
        }).toThrowError("Digite um Nome abaixo de 30 caracteres!");
    });

    it("deve criar uma Workout Plan (Treino de Academia) usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const workoutPlanUserIdAdmin: string | null = null;
        const workoutPlan = WorkoutPlan.with({
            id, name, user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        });

        expect(workoutPlan).toBeInstanceOf(WorkoutPlan);
        expect(workoutPlan.id).toBe(id);
        expect(workoutPlan.name).toBe(name);
        expect(workoutPlan.user_id).toBe(workoutPlanUserIdAdmin);
    });

    it("deve criar uma Workout Plan (Treino de Academia) usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const workoutPlanUserIdUser = crypto.randomUUID();
        const workoutPlan = WorkoutPlan.with({
            id, name, user_id: workoutPlanUserIdUser,
            workoutDays: []
        });

        expect(workoutPlan).toBeInstanceOf(WorkoutPlan);
        expect(workoutPlan.id).toBe(id);
        expect(workoutPlan.name).toBe(name);
        expect(workoutPlan.user_id).toBe(workoutPlanUserIdUser);
    });

    it("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'id' inválido", () => {
        const id = "1";
        const workoutPlanName: string = faker.person.firstName('female');
        const workoutPlanUserIdAdmin: string | null = null;
        expect(() => {
            WorkoutPlan.with({
                id, name: workoutPlanName, user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'nome' inválido", () => {
        const id = faker.string.uuid();
        const workoutPlanUserIdAdmin: string | null = null;
        expect(() => {
            WorkoutPlan.with({
                id, name: "", user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'user_id' inválido", () => {
        const id = faker.string.uuid();
        const workoutPlanName: string = faker.person.firstName('female');
        const workoutPlanUserIdAdmin: string | null = "1";
        expect(() => {
            WorkoutPlan.with({
                id, name: workoutPlanName, user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Selecione um Usuário válido!");
    });

});