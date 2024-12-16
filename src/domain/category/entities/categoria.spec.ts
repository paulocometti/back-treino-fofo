import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { Category, CategoryCreateProps } from "./category";
import { z } from "zod";

describe("Category Entity Test ", () => {
    it("deve criar uma Categoria com nome e id válidos para um Usuario com role Admin", () => {
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const data: CategoryCreateProps = {
            name: categoryName,
            user_id: categoryUserIdAdmin
        };
        const category = Category.create(data);
        expect(category.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        expect(idValidation.success).toBe(true);
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(categoryName);
        expect(category.user_id).toBe(categoryUserIdAdmin);
    });

    it("deve criar uma Categoria com nome e id válidos para um Usuario com role User", () => {
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdUser: string | null = crypto.randomUUID();
        const data: CategoryCreateProps = {
            name: categoryName,
            user_id: categoryUserIdUser
        };
        const category = Category.create(data);
        expect(category.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        expect(idValidation.success).toBe(true);
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(categoryName);
        expect(category.user_id).toBe(categoryUserIdUser);
    });

    it("deve lançar um erro ao criar uma Categoria com nome inválido", () => {
        const name = "";
        const categoryUserIdAdmin: string | null = null;
        const data: CategoryCreateProps = {
            name,
            user_id: categoryUserIdAdmin
        };
        expect(() => {
            Category.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar uma Categoria com nome muito longo", () => {
        const longName = "a".repeat(31);
        const categoryUserIdAdmin: string | null = null;
        const data: CategoryCreateProps = {
            name: longName,
            user_id: categoryUserIdAdmin
        };
        expect(() => {
            Category.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    
    it("deve criar uma Categoria usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const category = Category.with({ id, name, user_id: categoryUserIdAdmin });

        expect(category).toBeInstanceOf(Category);
        expect(category.id).toBe(id);
        expect(category.name).toBe(name);
        expect(category.user_id).toBe(categoryUserIdAdmin);
    });

    it("deve criar uma Categoria usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const categoryUserIdUser = crypto.randomUUID();
        const category = Category.with({ id, name, user_id: categoryUserIdUser });

        expect(category).toBeInstanceOf(Category);
        expect(category.id).toBe(id);
        expect(category.name).toBe(name);
        expect(category.user_id).toBe(categoryUserIdUser);
    });

    it("deve lançar um erro ao criar uma Categoria com props 'id' inválido", () => {
        const id = "1";
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        expect(() => {
            Category.with({ id, name: categoryName, user_id: categoryUserIdAdmin });
        }).toThrowError("Id inválido, não é um UUID.");
    });

    it("deve lançar um erro ao criar uma Categoria com props 'nome' inválido", () => {
        const id = faker.string.uuid();
        const categoryUserIdAdmin: string | null = null;
        expect(() => {
            Category.with({ id, name: "", user_id: categoryUserIdAdmin });
        }).toThrowError("Digite um Nome corretamente!");
    });

    it("deve lançar um erro ao criar uma Categoria com props 'user_id' inválido", () => {
        const id = faker.string.uuid();
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = "1";
        expect(() => {
            Category.with({ id, name: categoryName, user_id: categoryUserIdAdmin });
        }).toThrowError("Selecione um Usuário válido!");
    });

});