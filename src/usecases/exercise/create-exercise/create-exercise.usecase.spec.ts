import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserInputDto } from './create-exercise.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { CreateCategoryUsecase, CreateCategoryUsecaseInputDto, CreateCategoryUsecaseUserDto } from '../../category/create-category/create-category.usecase';
import { Category } from '../../../domain/category/entities/category';
import { createMockCategory } from '../../category/mock-category';

let categoryRepository: CategoryRepositoryInMemory;
let exerciseRepository: ExerciseRepositoryInMemory;
let categoryUseCaseCreate: CreateCategoryUsecase;
let exerciseUseCaseCreate: CreateExerciseUsecase;

beforeEach(() => {
    categoryRepository = CategoryRepositoryInMemory.create();
    exerciseRepository = ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
});

describe('CreateExerciseUsecase', () => {
    it('deve criar um Exercício com sucesso com role ADMIN', async () => {
        const categoryMock: Category = createMockCategory('ADMIN');
        console.log("categoryMock >> ", categoryMock);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryMock] };
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'ADMIN'
        };
        const output = await exerciseUseCaseCreate.execute(input, userAdminFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(null);
    });

    it('deve criar um Exercício com sucesso com role USER', async () => {
        const categoryMock: Category = createMockCategory('ADMIN');
        console.log("categoryMock >> ", categoryMock);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryMock] };
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output = await exerciseUseCaseCreate.execute(input, userFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(userFake.id);
    });

    /*it('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
        const categoryUserFake1: CreateCategoryUsecaseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 1',
            role: 'USER'
        };
        const categoryUserFake2: CreateCategoryUsecaseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'

        };
        const categoryInput: CreateCategoryUsecaseInputDto = { name: 'Strength Training' };
        const categoryOutput1 = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake1);
        const categoryOutput2 = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake2);

        const aCategory1 = Category.with({
            id: categoryOutput1.category.id,
            name: categoryOutput1.category.name,
            user_id: categoryOutput1.category.user_id,
        });
        const aCategory2 = Category.with({
            id: categoryOutput2.category.id,
            name: categoryOutput2.category.name,
            user_id: categoryOutput2.category.user_id,
        });

        const input1: CreateExerciseInputDto = { name: 'Lift Weights', categories: [aCategory1] };
        const input2: CreateExerciseInputDto = { name: 'Lift Weights', categories: [aCategory2] };

        const userFake1: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 1',
            role: 'USER'
        };
        const userFake2: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };

        const output1 = await exerciseUseCaseCreate.execute(input1, userFake1);
        const output2 = await exerciseUseCaseCreate.execute(input2, userFake2);

        expect(output1.exercise.id).toBeDefined();
        expect(output2.exercise.id).toBeDefined();
        expect(output1.exercise.name).toBe('Lift Weights');
        expect(output2.exercise.name).toBe('Lift Weights');
        expect(output1.exercise.user_id).toBe(userFake1.id);
        expect(output2.exercise.user_id).toBe(userFake2.id);
    });

    it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios oficiais', async () => {
        const categoryInput = { name: 'Cardio' };
        const categoryUserFake: CreateCategoryUsecaseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = Category.with({
            id: categoryOutput.category.id,
            name: categoryOutput.category.name,
            user_id: categoryOutput.category.user_id,
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
        const categoryInput = { name: 'Aerobics' };
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
        ).rejects.toThrow('Já existe um Exercício com este nomePor favor, tente outro nome!');
    });*/

});
