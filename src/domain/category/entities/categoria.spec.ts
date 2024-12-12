import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { Category } from "./category";
import { z } from "zod";

describe("Entity Category Test ", () => {
    it("deve criar uma categoria com nome e id válidos para um Usuario com role Admin", () => {
        const categoryName: string = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const category = Category.create(categoryName, categoryUserIdAdmin);
        expect(category.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        expect(idValidation.success).toBe(true);
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(categoryName);
        expect(category.user_id).toBe(null);
    });

    it("deve criar uma categoria com nome e id válidos para um Usuario com role User", () => {
        const categoryUserIdUser: string | null = crypto.randomUUID();
        const categoryName: string = faker.person.firstName('female');
        const category = Category.create(categoryName, categoryUserIdUser);
        expect(category.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(category.id);
        expect(idValidation.success).toBe(true);
        expect(category).toBeInstanceOf(Category);
        expect(category.name).toBe(categoryName);
        expect(category.user_id).toBe(categoryUserIdUser);
    });

    it("deve lançar um erro ao criar uma categoria com nome inválido", () => {
        const categoryUserIdAdmin: string | null = null;
        expect(() => {
            const name = "";
            Category.create(name, categoryUserIdAdmin);
        }).toThrowError("Digite um nome corretamente!");
    });

    it("deve lançar um erro ao criar uma categoria com nome muito longo", () => {
        const categoryUserIdAdmin: string | null = null;
        const longName = "a".repeat(31);
        expect(() => {
            Category.create(longName, categoryUserIdAdmin);
        }).toThrowError("Digite um nome corretamente!");
    });
    
    it("deve criar uma categoria usando o método 'with' com props válidas e user_id nulo", () => {
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const categoryUserIdAdmin: string | null = null;
        const category = Category.with({ id, name, user_id: categoryUserIdAdmin });

        expect(category).toBeInstanceOf(Category);
        expect(category.id).toBe(id);
        expect(category.name).toBe(name);
        expect(category.user_id).toBe(categoryUserIdAdmin);
    });

    it("deve criar uma categoria usando o método 'with' com props válidas e user_id de Usuario com role User", () => {
        const fakeUserId = crypto.randomUUID();
        const id = faker.string.uuid();
        const name = faker.person.firstName('female');
        const category = Category.with({ id, name, user_id: fakeUserId });

        expect(category).toBeInstanceOf(Category);
        expect(category.id).toBe(id);
        expect(category.name).toBe(name);
        expect(category.user_id).toBe(fakeUserId);
    });

    it("deve lançar um erro ao criar uma categoria com props inválidas", () => {
        const id = faker.string.uuid();
        const categoryUserIdAdmin: string | null = null;
        expect(() => {
            Category.with({ id, name: "", user_id: categoryUserIdAdmin });
        }).toThrowError("Digite um nome corretamente!");
    });

});