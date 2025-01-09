"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const faker_1 = require("@faker-js/faker");
const category_1 = require("./category");
const zod_1 = require("zod");
(0, vitest_1.describe)("Category Entity Test ", () => {
    (0, vitest_1.it)("deve criar uma Categoria com nome e id válidos para um Usuario com role Admin", () => {
        const categoryName = faker_1.faker.person.firstName('female');
        const categoryUserIdAdmin = null;
        const data = {
            name: categoryName,
            user_id: categoryUserIdAdmin
        };
        const category = category_1.Category.create(data);
        (0, vitest_1.expect)(category.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(category).toBeInstanceOf(category_1.Category);
        (0, vitest_1.expect)(category.name).toBe(categoryName);
        (0, vitest_1.expect)(category.user_id).toBe(categoryUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar uma Categoria com nome e id válidos para um Usuario com role User", () => {
        const categoryName = faker_1.faker.person.firstName('female');
        const categoryUserIdUser = crypto.randomUUID();
        const data = {
            name: categoryName,
            user_id: categoryUserIdUser
        };
        const category = category_1.Category.create(data);
        (0, vitest_1.expect)(category.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(category).toBeInstanceOf(category_1.Category);
        (0, vitest_1.expect)(category.name).toBe(categoryName);
        (0, vitest_1.expect)(category.user_id).toBe(categoryUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Categoria com nome inválido", () => {
        const name = "";
        const categoryUserIdAdmin = null;
        const data = {
            name,
            user_id: categoryUserIdAdmin
        };
        (0, vitest_1.expect)(() => {
            category_1.Category.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Categoria com nome muito longo", () => {
        const longName = "a".repeat(31);
        const categoryUserIdAdmin = null;
        const data = {
            name: longName,
            user_id: categoryUserIdAdmin
        };
        (0, vitest_1.expect)(() => {
            category_1.Category.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve criar uma Categoria usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const categoryUserIdAdmin = null;
        const category = category_1.Category.with({ id, name, user_id: categoryUserIdAdmin });
        (0, vitest_1.expect)(category).toBeInstanceOf(category_1.Category);
        (0, vitest_1.expect)(category.id).toBe(id);
        (0, vitest_1.expect)(category.name).toBe(name);
        (0, vitest_1.expect)(category.user_id).toBe(categoryUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar uma Categoria usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const categoryUserIdUser = crypto.randomUUID();
        const category = category_1.Category.with({ id, name, user_id: categoryUserIdUser });
        (0, vitest_1.expect)(category).toBeInstanceOf(category_1.Category);
        (0, vitest_1.expect)(category.id).toBe(id);
        (0, vitest_1.expect)(category.name).toBe(name);
        (0, vitest_1.expect)(category.user_id).toBe(categoryUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Categoria com props 'id' inválido", () => {
        const id = "1";
        const categoryName = faker_1.faker.person.firstName('female');
        const categoryUserIdAdmin = null;
        (0, vitest_1.expect)(() => {
            category_1.Category.with({ id, name: categoryName, user_id: categoryUserIdAdmin });
        }).toThrowError("Id inválido, não é um UUID.");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Categoria com props 'nome' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const categoryUserIdAdmin = null;
        (0, vitest_1.expect)(() => {
            category_1.Category.with({ id, name: "", user_id: categoryUserIdAdmin });
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Categoria com props 'user_id' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const categoryName = faker_1.faker.person.firstName('female');
        const categoryUserIdAdmin = "1";
        (0, vitest_1.expect)(() => {
            category_1.Category.with({ id, name: categoryName, user_id: categoryUserIdAdmin });
        }).toThrowError("Selecione um Usuário válido!");
    });
});
