"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExercise = createExercise;
const vitest_1 = require("vitest");
const faker_1 = require("@faker-js/faker");
const exercise_1 = require("../../exercise/entities/exercise");
const zod_1 = require("zod");
const categoria_spec_1 = require("../../category/entities/categoria.spec");
function createExercise() {
    const exerciseName = faker_1.faker.person.firstName('female');
    const exerciseUserIdAdmin = null;
    const category = (0, categoria_spec_1.createCategory)();
    const exerciseData = {
        name: exerciseName,
        user_id: exerciseUserIdAdmin,
        categories: [category]
    };
    return exercise_1.Exercise.create(exerciseData);
}
;
(0, vitest_1.describe)("Exercise Entity Test ", () => {
    (0, vitest_1.it)("deve criar um Exercicio com nome e id válidos para um Usuario com role Admin", () => {
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        const exerciseData = {
            name: exerciseName,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        const exercise = exercise_1.Exercise.create(exerciseData);
        (0, vitest_1.expect)(exercise.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.name).toBe(exerciseName);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar um Exercicio com nome e id válidos para um Usuario com role User", () => {
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdUser = crypto.randomUUID();
        const category = (0, categoria_spec_1.createCategory)();
        const data = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = exercise_1.Exercise.create(data);
        (0, vitest_1.expect)(exercise.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.name).toBe(exerciseName);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdUser);
    });
    (0, vitest_1.it)("deve criar um Exercicio com nome, category e id válidos para um Usuario com role User", () => {
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdUser = crypto.randomUUID();
        const category = (0, categoria_spec_1.createCategory)();
        const data = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = exercise_1.Exercise.create(data);
        (0, vitest_1.expect)(exercise.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.name).toBe(exerciseName);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdUser);
    });
    (0, vitest_1.it)("deve criar um Exercicio com nome e id válidos e category = null para um Usuario com role User", () => {
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdUser = crypto.randomUUID();
        const category = (0, categoria_spec_1.createCategory)();
        const data = {
            name: exerciseName,
            user_id: exerciseUserIdUser,
            categories: [category]
        };
        const exercise = exercise_1.Exercise.create(data);
        (0, vitest_1.expect)(exercise.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(exercise.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.name).toBe(exerciseName);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar um Exercicio com nome inválido", () => {
        const name = "";
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        const data = {
            name,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        (0, vitest_1.expect)(() => {
            exercise_1.Exercise.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar um Exercicio com nome muito longo", () => {
        const longName = "a".repeat(31);
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        const data = {
            name: longName,
            user_id: exerciseUserIdAdmin,
            categories: [category]
        };
        (0, vitest_1.expect)(() => {
            exercise_1.Exercise.create(data);
        }).toThrowError("Digite um Nome abaixo de 30 caracteres!");
    });
    (0, vitest_1.it)("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        const exercise = exercise_1.Exercise.with({ id, name, user_id: exerciseUserIdAdmin, categories: [category] });
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.id).toBe(id);
        (0, vitest_1.expect)(exercise.name).toBe(name);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar um Exercicio usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const exerciseUserIdUser = crypto.randomUUID();
        const category = (0, categoria_spec_1.createCategory)();
        const exercise = exercise_1.Exercise.with({ id, name, user_id: exerciseUserIdUser, categories: [category] });
        (0, vitest_1.expect)(exercise).toBeInstanceOf(exercise_1.Exercise);
        (0, vitest_1.expect)(exercise.id).toBe(id);
        (0, vitest_1.expect)(exercise.name).toBe(name);
        (0, vitest_1.expect)(exercise.user_id).toBe(exerciseUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar um Exercicio com props 'id' inválido", () => {
        const id = "1";
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        (0, vitest_1.expect)(() => {
            exercise_1.Exercise.with({ id, name: exerciseName, user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Id inválido, não é um UUID.");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar um Exercicio com props 'nome' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const exerciseUserIdAdmin = null;
        const category = (0, categoria_spec_1.createCategory)();
        (0, vitest_1.expect)(() => {
            exercise_1.Exercise.with({ id, name: "", user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar um Exercicio com props 'user_id' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const exerciseName = faker_1.faker.person.firstName('female');
        const exerciseUserIdAdmin = "1";
        const category = (0, categoria_spec_1.createCategory)();
        (0, vitest_1.expect)(() => {
            exercise_1.Exercise.with({ id, name: exerciseName, user_id: exerciseUserIdAdmin, categories: [category] });
        }).toThrowError("Selecione um Usuário válido!");
    });
});
