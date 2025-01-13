import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserInputDto } from './create-exercise.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { CreateCategoryUsecase } from '../../category/create-category/create-category.usecase';
import { categoryCreateMock } from '../../category/create-category/create-category.usecase.spec';

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
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake); 
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input, userAdminFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(null);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);
    });

    it('deve criar um Exercício com sucesso com role USER', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake); 
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input, userFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(userFake.id);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);
    });

    it('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma Exercício para outro USER', async () => {
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
        const categoryOutput1 = await categoryUseCaseCreate.execute(categoryCreateMock, userFake1); 
        const input1: CreateExerciseInputDto = { name: 'Yoga Practice 1', categories: [categoryOutput1.category] };
        const output1 = await exerciseUseCaseCreate.execute(input1, userFake1);
        expect(output1.exercise.id).toBeDefined();
        expect(output1.exercise.name).toBe('Yoga Practice 1');
        expect(output1.exercise.user_id).toBe(userFake1.id);
        expect(output1.exercise.categories[0].name).toBe(categoryCreateMock.name);
        
        const categoryOutput2 = await categoryUseCaseCreate.execute(categoryCreateMock, userFake2); 
        const input2: CreateExerciseInputDto = { name: 'Yoga Practice 1', categories: [categoryOutput2.category] };
        const output2 = await exerciseUseCaseCreate.execute(input2, userFake2);
        expect(output2.exercise.id).toBeDefined();
        expect(output2.exercise.name).toBe('Yoga Practice 1');
        expect(output2.exercise.user_id).toBe(userFake2.id);
        expect(output2.exercise.categories[0].name).toBe(categoryCreateMock.name);
    });

    it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios oficiais', async () => {
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake); 
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input, userAdminFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(null);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);
        
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        await expect(
            exerciseUseCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake); 
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input, userFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(userFake.id);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);
        
        await expect(
            exerciseUseCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role ADMIN entre Exercícios oficiais', async () => {
        const userAdminFake1: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake1); 
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input, userAdminFake1);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(null);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);

        const userAdminFake2: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin 2',
            role: 'ADMIN'
        };

        await expect(
            exerciseUseCaseCreate.execute(input, userAdminFake2)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role ADMIN entre todas os Exercícios (oficiais e de outros usuários)', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };

        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake); 
        const input1: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = await exerciseUseCaseCreate.execute(input1, userFake);
        expect(output.exercise.id).toBeDefined();
        expect(output.exercise.name).toBe('Yoga Practice');
        expect(output.exercise.user_id).toBe(userFake.id);
        expect(output.exercise.categories[0].name).toBe(categoryCreateMock.name);

        const input2: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };

        await expect(
            exerciseUseCaseCreate.execute(input2, userAdminFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

});
