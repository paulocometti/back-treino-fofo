import { describe, expect, it } from "vitest";
import { Exercise, ExerciseCreateProps, ExerciseProps } from "./exercise";
import { faker } from '@faker-js/faker';
import { z } from "zod";
import { Category } from "../category/entities/category";

const uuidSchema = z.string().uuid();

describe("Exercise Entity Test", () => {
    it("deve criar um Exercício com todos os campos válidos para um Usuário com role Admin", () => {
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdAdmin
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).instanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercício com todos os campos válidos para um Usuário com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseCreateProps = {
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        const exercise = Exercise.create(data);
        expect(exercise).instanceOf(Exercise);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.category_id).toBe(categoryFakeId);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercício com nome inválido", () => {
        const exerciseName: string = "";
        const categoryFakeId: number = 1;
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdAdmin
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercício com nome muito longo", () => {
        const longName = "a".repeat(31);
        const categoryFakeId: number = 1;
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseCreateProps = {
            name: longName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdAdmin
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve criar um Exercício usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const exerciseId: string = crypto.randomUUID();
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdAdmin: string | null = null;
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdAdmin
        };
        const exercise = Exercise.with(data);
        expect(exercise).instanceOf(Exercise);
        expect(exercise.id).toBe(exerciseId);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.category_id).toBe(categoryFakeId);
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercício usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const exerciseId: string = crypto.randomUUID();
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        const exercise = Exercise.with(data);
        expect(exercise).instanceOf(Exercise);
        expect(exercise.id).toBe(exerciseId);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.category_id).toBe(categoryFakeId);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercício com props 'id' inválido", () => {
        const exerciseId: string = "1";
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        expect(() => {
            Exercise.with(data);
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar um erro ao criar um Exercício com props 'nome' inválido", () => {
        const exerciseId: string = crypto.randomUUID();
        const exerciseName: string = "";
        const categoryFakeId: number = 1;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        expect(() => {
            Exercise.with(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercício com props 'category_id' inválido", () => {
        const exerciseId: string = crypto.randomUUID();
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = -1;
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        expect(() => { Exercise.with(data); }).toThrowError("Selecione uma Categoria válida!");
    });

    it("deve lançar um erro ao criar um Exercício com props 'user_id' inválido", () => {
        const exerciseId: string = crypto.randomUUID();
        const exerciseName: string = faker.person.firstName('female');
        const categoryFakeId: number = 1;
        const exerciseUserIdUser: string | null = "1";
        const data: ExerciseProps = {
            id: exerciseId,
            name: exerciseName,
            category_id: categoryFakeId,
            user_id: exerciseUserIdUser
        };
        expect(() => { Exercise.with(data); }).toThrowError("Selecione um Usuário válido!");
    });
});