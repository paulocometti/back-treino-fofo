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
const list_category_usecase_1 = require("./list-category.usecase");
const create_category_usecase_1 = require("../create-category/create-category.usecase");
let categoryRepository;
let useCaseCreate;
let useCaseList;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    useCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    useCaseList = list_category_usecase_1.ListCategoryUsecase.create(categoryRepository);
});
(0, vitest_1.describe)('ListCategoryUsecase', () => {
    (0, vitest_1.it)('deve listar Categorias sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const input2 = { name: 'Vídeo' };
        const input3 = { name: 'Ferramentas' };
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
        const output2 = yield useCaseCreate.execute(input2, userAdminFake);
        const output3 = yield useCaseCreate.execute(input3, userFake);
        (0, vitest_1.expect)(output1.category).toHaveProperty('id');
        (0, vitest_1.expect)(output1.category.name).toBe('Eletrônicos');
        (0, vitest_1.expect)(output2.category).toHaveProperty('id');
        (0, vitest_1.expect)(output2.category.name).toBe('Vídeo');
        (0, vitest_1.expect)(output3.category).toHaveProperty('id');
        (0, vitest_1.expect)(output3.category.name).toBe('Ferramentas');
        const list = (yield useCaseList.execute(undefined, userAdminFake)).categories;
        (0, vitest_1.expect)(list.length).toBe(2);
        (0, vitest_1.expect)(list[0].name).toBe('Eletrônicos');
        (0, vitest_1.expect)(list[1].name).toBe('Vídeo');
    }));
    (0, vitest_1.it)('deve listar Categorias sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const input1 = { name: 'Eletrônicos' };
        const input2 = { name: 'Vídeo' };
        const input3 = { name: 'Ferramentas' };
        const input4 = { name: 'Nao Aparecer' };
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
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User2',
            role: 'USER'
        };
        const output1 = yield useCaseCreate.execute(input1, userAdminFake);
        const output2 = yield useCaseCreate.execute(input2, userAdminFake);
        const output3 = yield useCaseCreate.execute(input3, userFake);
        const output4 = yield useCaseCreate.execute(input4, userFake2);
        (0, vitest_1.expect)(output1.category).toHaveProperty('id');
        (0, vitest_1.expect)(output1.category.name).toBe('Eletrônicos');
        (0, vitest_1.expect)(output2.category).toHaveProperty('id');
        (0, vitest_1.expect)(output2.category.name).toBe('Vídeo');
        (0, vitest_1.expect)(output3.category).toHaveProperty('id');
        (0, vitest_1.expect)(output3.category.name).toBe('Ferramentas');
        (0, vitest_1.expect)(output4.category).toHaveProperty('id');
        (0, vitest_1.expect)(output4.category.name).toBe('Nao Aparecer');
        const list = (yield useCaseList.execute(undefined, userFake)).categories;
        (0, vitest_1.expect)(list.length).toBe(3);
        (0, vitest_1.expect)(list[0].name).toBe('Eletrônicos');
        (0, vitest_1.expect)(list[1].name).toBe('Vídeo');
        (0, vitest_1.expect)(list[2].name).toBe('Ferramentas');
    }));
});
