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
const exercise_repository_in_memory_1 = require("../../../infra/repositories/exercise/exercise.repository.in-memory");
const create_exercise_usecase_1 = require("../create-exercise/create-exercise.usecase");
const edit_exercise_usecase_1 = require("./edit-exercise.usecase");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const create_category_usecase_spec_1 = require("../../category/create-category/create-category.usecase.spec");
const create_category_usecase_1 = require("../../category/create-category/create-category.usecase");
let categoryRepository;
let exerciseRepository;
let categoryUseCaseCreate;
let exerciseUseCaseCreate;
let exerciseUseCaseEdit;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    exerciseRepository = exercise_repository_in_memory_1.ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = create_exercise_usecase_1.CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseEdit = edit_exercise_usecase_1.EditExerciseUsecase.create(categoryRepository, exerciseRepository);
});
(0, vitest_1.describe)('EditExerciseUsecase', () => {
    (0, vitest_1.it)('deve atualizar um Exercício com sucesso com role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(null);
        const inputEdit = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseEdit.execute(inputEdit, userAdminFake)).exercise;
        (0, vitest_1.expect)(output.id).toBe(exerciseCreated.id);
        (0, vitest_1.expect)(output.name).toBe(inputEdit.name);
        (0, vitest_1.expect)(output.user_id).toBe(null);
        (0, vitest_1.expect)(output.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('deve atualizar um Exercício com sucesso com role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(userFake.id);
        const inputEdit = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseEdit.execute(inputEdit, userFake)).exercise;
        (0, vitest_1.expect)(output.id).toBe(exerciseCreated.id);
        (0, vitest_1.expect)(output.name).toBe(inputEdit.name);
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(output.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('deve atualizar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(exerciseCreated.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const input2 = { name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const exerciseCreated2 = (yield exerciseUseCaseCreate.execute(input2, userFake2)).exercise;
        (0, vitest_1.expect)(exerciseCreated2.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated2.name).toBe('Yoga Practice 2');
        (0, vitest_1.expect)(exerciseCreated2.user_id).toBe(userFake2.id);
        (0, vitest_1.expect)(exerciseCreated2.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
        const inputEdit = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseEdit.execute(inputEdit, userFake)).exercise;
        (0, vitest_1.expect)(output.id).toBe(exerciseCreated.id);
        (0, vitest_1.expect)(output.name).toBe(inputEdit.name);
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
        (0, vitest_1.expect)(output.categories[0].name).toBe(create_category_usecase_spec_1.categoryCreateMock.name);
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(null);
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const input2 = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (yield exerciseUseCaseCreate.execute(input2, userFake2)).exercise;
        (0, vitest_1.expect)(exerciseCreated2.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated2.name).toBe('Yoga');
        (0, vitest_1.expect)(exerciseCreated2.user_id).toBe(userFake2.id);
        const inputEdit = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
        yield (0, vitest_1.expect)(exerciseUseCaseEdit.execute(inputEdit, userFake2)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(userFake.id);
        const input2 = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (yield exerciseUseCaseCreate.execute(input2, userFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated2.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated2.name).toBe('Yoga');
        (0, vitest_1.expect)(exerciseCreated2.user_id).toBe(userFake.id);
        const inputEdit = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(inputEdit, userFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercício duplicados com role ADMIN entre Exercícios oficiais', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(null);
        const input2 = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (yield exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated2.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated2.name).toBe('Yoga');
        (0, vitest_1.expect)(exerciseCreated2.user_id).toBe(null);
        const inputEdit = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(inputEdit, userAdminFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
    (0, vitest_1.it)('não deve permitir nomes de exercício duplicados com role ADMIN entre todas as Exercícios (oficiais e de outros usuários)', () => __awaiter(void 0, void 0, void 0, function* () {
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
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(exerciseCreated.user_id).toBe(userFake.id);
        const input2 = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (yield exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        (0, vitest_1.expect)(exerciseCreated2.id).toBeDefined();
        (0, vitest_1.expect)(exerciseCreated2.name).toBe('Yoga');
        (0, vitest_1.expect)(exerciseCreated2.user_id).toBe(null);
        const inputEdit = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
        yield (0, vitest_1.expect)(exerciseUseCaseCreate.execute(inputEdit, userAdminFake)).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    }));
});
