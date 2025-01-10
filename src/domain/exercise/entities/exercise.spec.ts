import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { Exercise, ExerciseEntityCreateProps } from "../../exercise/entities/exercise";
import { z } from "zod";
import { Category, CategoryEntityCreateProps } from "../../category/entities/category";

describe("Exercise Entity Test ", () => {
    function createCategory() {
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const categoryData: CategoryEntityCreateProps = {
            name: categoryName,
            user_id: categoryUserIdAdmin
        };
        return Category.create(categoryData);
    }

    it("deve criar um Exercicio com nome e id válidos para um Usuario com role Admin", () => {
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const categoryData: CategoryEntityCreateProps = {
            name: categoryName,
            user_id: categoryUserIdAdmin
        };
        const category = Category.create(categoryData);
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdAdmin: string | null = null;
        const exerciseData: ExerciseEntityCreateProps = {
            name: exerciseName,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        const exercise = Exercise.create(exerciseData);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercicio com nome e id válidos para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const category = createCategory();
        const data: ExerciseEntityCreateProps = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve criar um Exercicio com nome, category e id válidos para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const categoryIdRandom: string | null = crypto.randomUUID();
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const category = createCategory();
        const data: ExerciseEntityCreateProps = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve criar um Exercicio com nome e id válidos e category = null para um Usuario com role User", () => {
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdUser: string | null = crypto.randomUUID();
        const category = createCategory();
        const data: ExerciseEntityCreateProps = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = Exercise.create(data);
        expect(exercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        expect(idValidation.success).toBe(true);
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.name).toBe(exerciseName);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercicio com nome inválido", () => {
        const name = "";
        const exerciseUserIdAdmin: string | null = null;
        const category = createCategory();
        const data: ExerciseEntityCreateProps = {
            name,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercicio com nome muito longo", () => {
        const longName = "a".repeat(31);
        const exerciseUserIdAdmin: string | null = null;
        const category = createCategory();
        const data: ExerciseEntityCreateProps = {
            name: longName,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        expect(() => {
            Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const exerciseUserIdAdmin: string | null = null;
        const category = createCategory();
        const exercise = Exercise.with({ id, name, user_id: exerciseUserIdAdmin, categories: [category] });
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe(id);
        expect(exercise.name).toBe(name);
        expect(exercise.user_id).toBe(exerciseUserIdAdmin);
    });

    it("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const exerciseUserIdUser = crypto.randomUUID();
        const category = createCategory();
        const exercise = Exercise.with({ id, name, user_id: exerciseUserIdUser, categories: [category] });
        expect(exercise).toBeInstanceOf(Exercise);
        expect(exercise.id).toBe(id);
        expect(exercise.name).toBe(name);
        expect(exercise.user_id).toBe(exerciseUserIdUser);
    });

    it("deve lançar um erro ao criar um Exercicio com props 'id' inválido", () => {
        const id = "1";
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdAdmin: string | null = null;
        const category = createCategory();
        expect(() => {
            Exercise.with({ id, name: exerciseName, user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar um erro ao criar um Exercicio com props 'nome' inválido", () => {
        const id = faker.string.uuid();
        const exerciseUserIdAdmin: string | null = null;
        const category = createCategory();
        expect(() => {
            Exercise.with({ id, name: "", user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar um Exercicio com props 'user_id' inválido", () => {
        const id = faker.string.uuid();
        const exerciseName: string = faker.person.firstName('female');
        const exerciseUserIdAdmin: string | null = "1";
        const category = createCategory();
        expect(() => {
            Exercise.with({ id, name: exerciseName, user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Selecione um Usuário válido!");
    });

});
