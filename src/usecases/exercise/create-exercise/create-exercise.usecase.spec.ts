import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserInputDto } from './create-exercise.usecase';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { createCategoryWithAdmin } from '../../../utils/category.test.utils';
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase, CreateCategoryUsecaseUserDto } from '../../category/create-category/create-category.usecase';
import { Category } from '../../../domain/category/entities/category';

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
        const categoryUserFake: CreateCategoryUsecaseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryInput: CreateCategoryUsecaseInputDto = { name: 'Yoga' };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [aCategory] };
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'ADMIN'
        };
        const output = await exerciseUseCaseCreate.execute(input, userAdminFake);
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(null);
    });

    it('deve criar um Exercício com sucesso com role USER', async () => {
        const categoryUserFake: CreateCategoryUsecaseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryInput: CreateCategoryUsecaseInputDto = { name: 'Yoga' };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryInput, categoryUserFake);
        const aCategory = Category.with({
            id: categoryOutput.id,
            name: categoryOutput.name,
            user_id: categoryOutput.user_id,
        });
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [aCategory] };
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output = await exerciseUseCaseCreate.execute(input, userFake);
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(userFake.id);
    });

    it('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
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
            id: categoryOutput1.id,
            name: categoryOutput1.name,
            user_id: categoryOutput1.user_id,
        });
        const aCategory2 = Category.with({
            id: categoryOutput2.id,
            name: categoryOutput2.name,
            user_id: categoryOutput2.user_id,
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

        expect(output1.id).toBeDefined();
        expect(output2.id).toBeDefined();
        expect(output1.name).toBe('Lift Weights');
        expect(output2.name).toBe('Lift Weights');
        expect(output1.user_id).toBe(userFake1.id);
        expect(output2.user_id).toBe(userFake2.id);
    });

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
