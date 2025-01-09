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
const exercise_repository_in_memory_1 = require("../../../infra/repositories/exercise/exercise.repository.in-memory");
const category_repository_in_memory_1 = require("../../../infra/repositories/category/category.repository.in-memory");
const create_category_usecase_1 = require("../../category/create-category/create-category.usecase");
const category_1 = require("../../../domain/category/entities/category");
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
        const categoryUserFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryInput = { name: 'Yoga' };
        const categoryOutput = yield categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = category_1.Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input = { name: 'Yoga Practice', categories: [aCategory] };
        const userAdminFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'ADMIN'
        };
        const output = yield exerciseUseCaseCreate.execute(input, userAdminFake);
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(null);
    }));
    (0, vitest_1.it)('deve criar um Exercício com sucesso com role USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const categoryUserFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryInput = { name: 'Yoga' };
        const categoryOutput = yield categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = category_1.Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input = { name: 'Yoga Practice', categories: [aCategory] };
        const userFake = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output = yield exerciseUseCaseCreate.execute(input, userFake);
        (0, vitest_1.expect)(output.id).toBeDefined();
        (0, vitest_1.expect)(output.name).toBe('Yoga Practice');
        (0, vitest_1.expect)(output.user_id).toBe(userFake.id);
    }));
    (0, vitest_1.it)('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const categoryUserFake1 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 1',
            role: 'USER'
        };
        const categoryUserFake2 = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const categoryInput = { name: 'Strength Training' };
        const categoryOutput1 = yield categoryUseCaseCreate.execute(categoryInput, categoryUserFake1);
        const categoryOutput2 = yield categoryUseCaseCreate.execute(categoryInput, categoryUserFake2);
        const aCategory1 = category_1.Category.with({
            id: categoryOutput1.id,
            name: categoryOutput1.name,
            user_id: categoryOutput1.user_id,
        });
        const aCategory2 = category_1.Category.with({
            id: categoryOutput2.id,
            name: categoryOutput2.name,
            user_id: categoryOutput2.user_id,
        });
        const input1 = { name: 'Lift Weights', categories: [aCategory1] };
        const input2 = { name: 'Lift Weights', categories: [aCategory2] };
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
        const output1 = yield exerciseUseCaseCreate.execute(input1, userFake1);
        const output2 = yield exerciseUseCaseCreate.execute(input2, userFake2);
        (0, vitest_1.expect)(output1.id).toBeDefined();
        (0, vitest_1.expect)(output2.id).toBeDefined();
        (0, vitest_1.expect)(output1.name).toBe('Lift Weights');
        (0, vitest_1.expect)(output2.name).toBe('Lift Weights');
        (0, vitest_1.expect)(output1.user_id).toBe(userFake1.id);
        (0, vitest_1.expect)(output2.user_id).toBe(userFake2.id);
    }));
    /*it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios oficiais', async () => {
        const categoryInput: CreateCategoryInputDto = { name: 'Cardio' };
        const categoryUserFake: CreateCategoryUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input: CreateExerciseInputDto = { name: 'Run Marathon', categories: [aCategory] };
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        await exerciseUseCaseCreate.execute(input, userAdminFake);

        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        await expect(
            exerciseUseCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role ADMIN entre Exercícios oficiais', async () => {
        const categoryInput: CreateCategoryInputDto = { name: 'Aerobics' };
        const categoryUserFake: CreateCategoryUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input: CreateExerciseInputDto = { name: 'High Intensity Interval Training', categories: [aCategory] };
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        await exerciseUseCaseCreate.execute(input, userFake);

        await expect(
            exerciseUseCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });*/
});
