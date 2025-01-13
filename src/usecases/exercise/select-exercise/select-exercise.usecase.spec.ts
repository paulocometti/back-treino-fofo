import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { CreateExerciseInputDto, CreateExerciseUsecase,  CreateExerciseUserInputDto } from '../create-exercise/create-exercise.usecase';
import { SelectExerciseUsecase } from './select-exercise.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecase } from '../../category/create-category/create-category.usecase';
import { categoryCreateMock } from '../../category/create-category/create-category.usecase.spec';

let categoryRepository: CategoryRepositoryInMemory;
let exerciseRepository: ExerciseRepositoryInMemory;
let categoryUseCaseCreate: CreateCategoryUsecase;
let exerciseUseCaseCreate: CreateExerciseUsecase;
let exerciseUseCaseSelect: SelectExerciseUsecase;

beforeEach(() => {
    categoryRepository = CategoryRepositoryInMemory.create();
    exerciseRepository = ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseSelect = SelectExerciseUsecase.create(exerciseRepository);
});

describe('SelectExerciseUsecase', () => {
    it('deve dar Select em um Exercicio sendo Usuário role ADMIN', async () => {
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(null);

        const select = (await exerciseUseCaseSelect.execute(output, userAdminFake)).exercise;
        expect(select.name).toBe(input.name);
        expect(select.user_id).toBe(null);
    });

    it('deve dar Select em um Exercicio sendo Usuário role USER', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(userFake.id);

        const select = (await exerciseUseCaseSelect.execute(output, userFake)).exercise;
        expect(select.name).toBe(input.name);
        expect(select.user_id).toBe(userFake.id);
    });

    it('deve dar Select em um Exercicio OFICIAL sendo Usuário role USER', async () => {
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(null);

        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const select = (await exerciseUseCaseSelect.execute(output, userFake)).exercise;
        expect(select.name).toBe(input.name);
        expect(select.user_id).toBe(null);
    });

    it('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role ADMIN', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(userFake.id);

        const select = (await exerciseUseCaseSelect.execute(output, userFake)).exercise;
        expect(select.name).toBe(input.name);
        expect(select.user_id).toBe(userFake.id);

        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };

        await expect(
            exerciseUseCaseSelect.execute(select, userAdminFake)
        ).rejects.toThrow('Nada encontrado.');
    });

    it('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role USER', async () => {
        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(userFake.id);

        const select = (await exerciseUseCaseSelect.execute(output, userFake)).exercise;
        expect(select.name).toBe(input.name);
        expect(select.user_id).toBe(userFake.id);

        const userFake2: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };

        await expect(
            exerciseUseCaseSelect.execute(select, userFake2)
        ).rejects.toThrow('Nada encontrado.');
    });
});
