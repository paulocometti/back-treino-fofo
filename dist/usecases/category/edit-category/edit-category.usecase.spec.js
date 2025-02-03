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
const vitest_1 = require("vitest");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const create_category_usecase_1 = require("../create-category/create-category.usecase");
const edit_category_usecase_1 = require("./edit-category.usecase");
let categoryRepository;
let createUseCase;
let editUseCase;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    createUseCase = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    editUseCase = edit_category_usecase_1.EditCategoryUsecase.create(categoryRepository);
});
(0, vitest_1.describe)('EditCategoryUsecase', () => {
    (0, vitest_1.it)('deve atualizar uma categoria com sucesso com role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputCreate = { name: 'Eletrônicos' };
        const userAdmin = {
            id: crypto.randomUUID(),
            name: 'Admin Test',
            role: 'ADMIN'
        };
        const createdCategory = yield createUseCase.execute(inputCreate, userAdmin);
        const editInput = {
            id: createdCategory.category.id,
            name: 'Eletrônicos 2',
            user_id: userAdmin.id,
        };
        const output = yield editUseCase.execute(editInput, userAdmin);
        (0, vitest_1.expect)(output.category.id).toBe(createdCategory.category.id);
        (0, vitest_1.expect)(output.category.name).toBe('Eletrônicos 2');
        (0, vitest_1.expect)(output.category.user_id).toBe(null);
    }));
    (0, vitest_1.it)('deve atualizar uma categoria com sucesso com role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const inputCreate = { name: 'Esportes' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'User Test',
            role: 'USER'
        };
        const createdCategory = yield createUseCase.execute(inputCreate, userFake);
        const editInput = {
            id: createdCategory.category.id,
            name: 'Esportes e Lazer',
            user_id: userFake.id,
        };
        const output = yield editUseCase.execute(editInput, userFake);
        (0, vitest_1.expect)(output.category.id).toBe(createdCategory.category.id);
        (0, vitest_1.expect)(output.category.name).toBe('Esportes e Lazer');
        (0, vitest_1.expect)(output.category.user_id).toBe(userFake.id);
    }));
    (0, vitest_1.it)('deve atualizar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = {
            id: crypto.randomUUID(),
            name: 'User1',
            role: 'USER'
        };
        yield createUseCase.execute({ name: 'Eletrônicos' }, user1);
        const user2 = {
            id: crypto.randomUUID(),
            name: 'User2',
            role: 'USER'
        };
        const categoryUser2 = yield createUseCase.execute({ name: 'Eletrônicos Pro' }, user2);
        const editInput = {
            id: categoryUser2.category.id,
            name: 'Eletrônicos',
            user_id: user2.id,
        };
        const output = yield editUseCase.execute(editInput, user2);
        (0, vitest_1.expect)(output.category.id).toBe(categoryUser2.category.id);
        (0, vitest_1.expect)(output.category.name).toBe('Eletrônicos');
        (0, vitest_1.expect)(output.category.user_id).toBe(user2.id);
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role USER entre as Categorias oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'User Test',
            role: 'USER'
        };
        const categoryOfUser = yield createUseCase.execute({ name: 'Eletrônicos' }, userFake);
        const userAdmin = {
            id: crypto.randomUUID(),
            name: 'Admin Test',
            role: 'ADMIN'
        };
        const categoryOfAdmin = yield createUseCase.execute({ name: 'Domésticos' }, userAdmin);
        const editInput = {
            id: categoryOfUser.category.id,
            name: categoryOfAdmin.category.name,
            user_id: userFake.id,
        };
        yield (0, vitest_1.expect)(editUseCase.execute(editInput, userFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role USER entre as Categorias criadas pelo usuário logado (mesmo USER)', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'User Test',
            role: 'USER'
        };
        const category1 = yield createUseCase.execute({ name: 'Eletrônicos' }, userFake);
        const category2 = yield createUseCase.execute({ name: 'Domésticos' }, userFake);
        const editInput = {
            id: category2.category.id,
            name: category1.category.name,
            user_id: userFake.id,
        };
        yield (0, vitest_1.expect)(editUseCase.execute(editInput, userFake)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdmin = {
            id: crypto.randomUUID(),
            name: 'Admin Test',
            role: 'ADMIN'
        };
        yield createUseCase.execute({ name: 'Eletrônicos' }, userAdmin);
        const cat2 = yield createUseCase.execute({ name: 'Domésticos' }, userAdmin);
        const editInput = {
            id: cat2.category.id,
            name: 'Eletrônicos',
            user_id: null,
        };
        yield (0, vitest_1.expect)(editUseCase.execute(editInput, userAdmin)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'User Test',
            role: 'USER'
        };
        yield createUseCase.execute({ name: 'Eletrônicos' }, userFake);
        const userAdmin = {
            id: crypto.randomUUID(),
            name: 'Admin Test',
            role: 'ADMIN'
        };
        const categoryByAdmin = yield createUseCase.execute({ name: 'Oficial Cat' }, userAdmin);
        const editInput = {
            id: categoryByAdmin.category.id,
            name: 'Eletrônicos',
            user_id: null,
        };
        yield (0, vitest_1.expect)(editUseCase.execute(editInput, userAdmin)).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
    }));
});
