"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryCreateMock = void 0;
const vitest_1 = require("vitest");
const create_category_usecase_1 = require("./create-category.usecase");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const faker_1 = require("@faker-js/faker");
let categoryRepository;
let useCaseCreate;
exports.categoryCreateMock = { name: faker_1.faker.person.firstName('female') };
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    useCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
});
(0, vitest_1.describe)('CreateCategoryUsecase', () => {
    (0, vitest_1.it)('deve criar uma categoria com sucesso com role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const output = yield useCaseCreate.execute(input, userAdminFake);
        (0, vitest_1.expect)(output.category.id).toBe(output.category.id);
        (0, vitest_1.expect)(output.category.name).toBe(output.category.name);
        (0, vitest_1.expect)(output.category.user_id).toBe(null);
    }));
    (0, vitest_1.it)('deve criar uma categoria com sucesso com role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output = yield useCaseCreate.execute(input, userFake);
        (0, vitest_1.expect)(output.category.id).toBe(output.category.id);
        (0, vitest_1.expect)(output.category.name).toBe(output.category.name);
        (0, vitest_1.expect)(output.category.user_id).toBe(userFake.id);
    }));
    (0, vitest_1.it)('deve criar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userFake1 = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const output1 = yield useCaseCreate.execute(input, userFake1);
        const output2 = yield useCaseCreate.execute(input, userFake2);
        (0, vitest_1.expect)(output1.category.id).toBe(output1.category.id);
        (0, vitest_1.expect)(output1.category.name).toBe(output1.category.name);
        (0, vitest_1.expect)(output1.category.user_id).toBe(userFake1.id);
        (0, vitest_1.expect)(output2.category.id).toBe(output2.category.id);
        (0, vitest_1.expect)(output2.category.name).toBe(output2.category.name);
        (0, vitest_1.expect)(output2.category.user_id).toBe(userFake2.id);
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role USER entre as Categorias oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        yield useCaseCreate.execute(input, userAdminFake);
        yield (0, vitest_1.expect)(useCaseCreate.execute(input, userFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role USER entre as Categorias criadas pelo usuário logado (mesmo USER)', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo',
            role: 'USER'
        };
        yield useCaseCreate.execute(input, userFake);
        yield (0, vitest_1.expect)(useCaseCreate.execute(input, userFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo',
            role: 'ADMIN'
        };
        yield useCaseCreate.execute(input, userFake);
        yield (0, vitest_1.expect)(useCaseCreate.execute(input, userFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', () => __awaiter(void 0, void 0, void 0, function* () {
        const input = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        yield useCaseCreate.execute(input, userFake);
        yield (0, vitest_1.expect)(useCaseCreate.execute(input, userAdminFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
});
