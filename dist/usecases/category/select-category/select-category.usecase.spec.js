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
const select_category_usecase_1 = require("./select-category.usecase");
let categoryRepository;
let useCaseCreate;
let useCaseSelect;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    useCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    useCaseSelect = select_category_usecase_1.SelectCategoryUsecase.create(categoryRepository);
});
(0, vitest_1.describe)('SelectCategoryUsecase', () => {
    (0, vitest_1.it)('deve dar Select em uma Categoria sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const output1 = yield useCaseCreate.execute(input1, userAdminFake);
        (0, vitest_1.expect)(output1.category).toHaveProperty('id');
        (0, vitest_1.expect)(output1.category.name).toBe(input1.name);
        (0, vitest_1.expect)(output1.category.user_id).toBe(null);
        const select = (yield useCaseSelect.execute(output1.category, userAdminFake)).category;
        (0, vitest_1.expect)(select.name).toBe(input1.name);
        (0, vitest_1.expect)(output1.category.user_id).toBe(null);
    }));
    (0, vitest_1.it)('deve dar Select em uma Categoria sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output1 = yield useCaseCreate.execute(input1, userFake);
        (0, vitest_1.expect)(output1.category).toHaveProperty('id');
        (0, vitest_1.expect)(output1.category.name).toBe(input1.name);
        (0, vitest_1.expect)(output1.category.user_id).toBe(userFake.id);
        const select = (yield useCaseSelect.execute(output1.category, userFake)).category;
        (0, vitest_1.expect)(select.name).toBe(input1.name);
        (0, vitest_1.expect)(select.user_id).toBe(userFake.id);
    }));
    (0, vitest_1.it)('deve dar Select em uma Categoria OFICIAL sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
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
        const output1 = yield useCaseCreate.execute(input1, userAdminFake);
        (0, vitest_1.expect)(output1.category).toHaveProperty('id');
        (0, vitest_1.expect)(output1.category.name).toBe(input1.name);
        (0, vitest_1.expect)(output1.category.user_id).toBe(null);
        const select = (yield useCaseSelect.execute(output1.category, userFake)).category;
        (0, vitest_1.expect)(select.name).toBe(input1.name);
        (0, vitest_1.expect)(select.user_id).toBe(null);
    }));
    (0, vitest_1.it)('não deve dar Select em uma Categoria de outro USUÁRIO sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'ADMIN'
        };
        yield useCaseCreate.execute(input1, userFake);
        const input2 = { name: 'Vídeo' };
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User2',
            role: 'USER'
        };
        const output2 = yield useCaseCreate.execute(input2, userFake2);
        yield (0, vitest_1.expect)(useCaseSelect.execute(output2.category, userFake)).rejects.toThrow('Nada encontrado.');
    }));
    (0, vitest_1.it)('não deve dar Select em uma Categoria de outro USUÁRIO sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output1 = yield useCaseCreate.execute(input1, userFake);
        const input2 = { name: 'Vídeo' };
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User2',
            role: 'USER'
        };
        yield useCaseCreate.execute(input2, userFake2);
        yield (0, vitest_1.expect)(useCaseSelect.execute(output1.category, userFake2)).rejects.toThrow('Nada encontrado.');
    }));
});
