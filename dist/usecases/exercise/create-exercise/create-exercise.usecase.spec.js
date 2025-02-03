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
const create_exercise_usecase_1 = require("./create-exercise.usecase");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const exercise_repository_in_memory_1 = require("../../../infra/repositories/exercise/exercise.repository.in-memory");
const create_category_usecase_1 = require("../../category/create-category/create-category.usecase");
const create_category_usecase_spec_1 = require("../../category/create-category/create-category.usecase.spec");
let categoryRepository;
let exerciseRepository;
let categoryUseCaseCreate;
let exerciseUseCaseCreate;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    exerciseRepository = exercise_repository_in_memory_1.ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = create_exercise_usecase_1.CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
});
(0, vitest_1.describe)('CreateExerciseUsecase', () => {
    (0, vitest_1.it)('deve criar um Exercício com sucesso com role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input, userAdminFake);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(null);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('deve criar um Exercício com sucesso com role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input, userFake);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma Exercício para outro USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake1 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 1',
            role: 'USER'
        };
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const categoryOutput1 = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake1);
        const input1 = { name: 'Yoga Practice 1', categories: [categoryOutput1.category] };
        const output1 = yield exerciseUseCaseCreate.execute(input1, userFake1);
        (0, vitest_1.expect)(output1.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output1.exercise.name).toBe('Yoga Practice 1');
        (0, vitest_1.expect)(output1.exercise.user_id).toBe(userFake1.id);
        (0, vitest_1.expect)(output1.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const categoryOutput2 = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake2);
        const input2 = { name: 'Yoga Practice 1', categories: [categoryOutput2.category] };
        const output2 = yield exerciseUseCaseCreate.execute(input2, userFake2);
        (0, vitest_1.expect)(output2.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output2.exercise.name).toBe('Yoga Practice 1');
        (0, vitest_1.expect)(output2.exercise.user_id).toBe(userFake2.id);
        (0, vitest_1.expect)(output2.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input, userAdminFake);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(null);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(input, userFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input, userFake);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(input, userFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercicio duplicados com role ADMIN entre Exercícios oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake1 = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake1);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input, userAdminFake1);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(null);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const userAdminFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin 2',
            role: 'ADMIN'
        };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(input, userAdminFake2)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercicio duplicados com role ADMIN entre todas os Exercícios (oficiais e de outros usuários)', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input1 = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = yield exerciseUseCaseCreate.execute(input1, userFake);
        (0, vitest_1.expect)(output.exercise.id).toBeDefined();
        (0, vitest_1.expect)(output.exercise.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.exercise.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(output.exercise.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const input2 = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(input2, userAdminFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
});
