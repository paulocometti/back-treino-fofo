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
const select_exercise_usecase_1 = require("./select-exercise.usecase");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const create_category_usecase_1 = require("../../category/create-category/create-category.usecase");
const create_category_usecase_spec_1 = require("../../category/create-category/create-category.usecase.spec");
let categoryRepository;
let exerciseRepository;
let categoryUseCaseCreate;
let exerciseUseCaseCreate;
let exerciseUseCaseSelect;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    exerciseRepository = exercise_repository_in_memory_1.ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = create_exercise_usecase_1.CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseSelect = select_exercise_usecase_1.SelectExerciseUsecase.create(exerciseRepository);
});
(0, vitest_1.describe)('SelectExerciseUsecase', () => {
    (0, vitest_1.it)('deve dar Select em um Exercicio sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(null);
        const select = (yield exerciseUseCaseSelect.execute(output, userAdminFake)).exercise;
        (0, vitest_1.expect)(select.name).toBe(input.name);
        (0, vitest_1.expect)(select.user_id).toBe(null);
    }));
    (0, vitest_1.it)('deve dar Select em um Exercicio sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
        const select = (yield exerciseUseCaseSelect.execute(output, userFake)).exercise;
        (0, vitest_1.expect)(select.name).toBe(input.name);
        (0, vitest_1.expect)(select.user_id).toBe(userFake.id);
    }));
    (0, vitest_1.it)('deve dar Select em um Exercicio OFICIAL sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(null);
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const select = (yield exerciseUseCaseSelect.execute(output, userFake)).exercise;
        (0, vitest_1.expect)(select.name).toBe(input.name);
        (0, vitest_1.expect)(select.user_id).toBe(null);
    }));
    (0, vitest_1.it)('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
        const select = (yield exerciseUseCaseSelect.execute(output, userFake)).exercise;
        (0, vitest_1.expect)(select.name).toBe(input.name);
        (0, vitest_1.expect)(select.user_id).toBe(userFake.id);
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        yield (0, vitest_1.expect)(exerciseUseCaseSelect.execute(select, userAdminFake)).rejects.toThrow('Nada encontrado.');
    }));
    (0, vitest_1.it)('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
        const select = (yield exerciseUseCaseSelect.execute(output, userFake)).exercise;
        (0, vitest_1.expect)(select.name).toBe(input.name);
        (0, vitest_1.expect)(select.user_id).toBe(userFake.id);
        const userFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        yield (0, vitest_1.expect)(exerciseUseCaseSelect.execute(select, userFake2)).rejects.toThrow('Nada encontrado.');
    }));
});
