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
const list_exercise_usecase_1 = require("./list-exercise.usecase");
const create_exercise_usecase_1 = require("../create-exercise/create-exercise.usecase");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const create_category_usecase_1 = require("../../category/create-category/create-category.usecase");
const create_category_usecase_spec_1 = require("../../category/create-category/create-category.usecase.spec");
let categoryRepository;
let exerciseRepository;
let categoryUseCaseCreate;
let exerciseUseCaseCreate;
let exerciseUseCaseList;
(0, vitest_1.beforeEach)(() => {
    categoryRepository = category_repository_in_memory_1.CategoryRepositoryInMemory.create();
    exerciseRepository = exercise_repository_in_memory_1.ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = create_exercise_usecase_1.CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseList = list_exercise_usecase_1.ListExerciseUsecase.create(exerciseRepository);
});
(0, vitest_1.describe)('ListExerciseUsecase', () => {
    (0, vitest_1.it)('deve listar Categorias sendo Usuário role ADMIN', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const input2 = { name: 'Fight Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        const output2 = (yield exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(null);
        (0, vitest_1.expect)(output2.id).toBeDefined();
        (0, vitest_1.expect)(output2.name).toBe('Fight Practice');
        (0, vitest_1.expect)(output2.user_id).toBe(null);
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const input3 = { name: 'Jump Practice', categories: [categoryOutput.category] };
        const output3 = (yield exerciseUseCaseCreate.execute(input3, userFake)).exercise;
        (0, vitest_1.expect)(output3.id).toBeDefined();
        (0, vitest_1.expect)(output3.name).toBe('Jump Practice');
        (0, vitest_1.expect)(output3.user_id).toBe(userFake.id);
        const list = (yield exerciseUseCaseList.execute(undefined, userAdminFake)).exercises;
        (0, vitest_1.expect)(list.length).toBe(2);
        (0, vitest_1.expect)(list[0].name).toBe('Yoga Practice');
        (0, vitest_1.expect)(list[1].name).toBe('Fight Practice');
    }));
    (0, vitest_1.it)('deve listar Categorias sendo Usuário role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = yield categoryUseCaseCreate.execute(create_category_usecase_spec_1.categoryCreateMock, userAdminFake);
        const input = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const input2 = { name: 'Fight Practice', categories: [categoryOutput.category] };
        const output = (yield exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        const output2 = (yield exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(null);
        (0, vitest_1.expect)(output2.id).toBeDefined();
        (0, vitest_1.expect)(output2.name).toBe('Fight Practice');
        (0, vitest_1.expect)(output2.user_id).toBe(null);
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const input3 = { name: 'Jump Practice', categories: [categoryOutput.category] };
        const output3 = (yield exerciseUseCaseCreate.execute(input3, userFake)).exercise;
        (0, vitest_1.expect)(output3.id).toBeDefined();
        (0, vitest_1.expect)(output3.name).toBe('Jump Practice');
        (0, vitest_1.expect)(output3.user_id).toBe(userFake.id);
        const list = (yield exerciseUseCaseList.execute(undefined, userFake)).exercises;
        (0, vitest_1.expect)(list.length).toBe(3);
        (0, vitest_1.expect)(list[0].name).toBe('Yoga Practice');
        (0, vitest_1.expect)(list[1].name).toBe('Fight Practice');
        (0, vitest_1.expect)(list[2].name).toBe('Jump Practice');
    }));
});
