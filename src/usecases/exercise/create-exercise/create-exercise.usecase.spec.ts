import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserDto } from './create-exercise.usecase';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { SelectExerciseUsecase } from '../select-exercise/select-exercise.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { createCategoryWithAdmin } from '../../../utils/category.test.utils';

let categoryRepository: CategoryRepositoryInMemory;
let exerciseRepository: ExerciseRepositoryInMemory;
let useCaseCreate: CreateExerciseUsecase;
let useCaseSelect: SelectExerciseUsecase;

beforeEach(() => {
    categoryRepository = CategoryRepositoryInMemory.create();
    exerciseRepository = ExerciseRepositoryInMemory.create();
    useCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    useCaseSelect = SelectExerciseUsecase.create(exerciseRepository);
});

describe('CreateExerciseUsecase', () => {
    it('deve criar um Exercício com sucesso com role ADMIN', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userAdminFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const output = await useCaseCreate.execute(input, userAdminFake);

        const result = await useCaseSelect.execute({ id: output.id }, userAdminFake);
        expect(result.exercise.id).toBe(output.id);
        expect(result.exercise.name).toBe(output.name);
        expect(result.exercise.category_id).toBe(categoryExpect);
        expect(result.exercise.user_id).toBe(null);
    });

    it('deve criar um Exercício com sucesso com role USER', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const output = await useCaseCreate.execute(input, userFake);

        const result = await useCaseSelect.execute({ id: output.id }, userFake);
        expect(result.exercise.id).toBe(output.id);
        expect(result.exercise.name).toBe(output.name);
        expect(result.exercise.category_id).toBe(categoryExpect);
        expect(result.exercise.user_id).toBe(userFake.id);
    });

    it('deve criar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userFake1: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const userFake2: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };

        const output1 = await useCaseCreate.execute(input, userFake1);
        const output2 = await useCaseCreate.execute(input, userFake2);

        const result1 = await useCaseSelect.execute({ id: output1.id }, userFake1);
        expect(result1.exercise.id).toBe(output1.id);
        expect(result1.exercise.name).toBe(output1.name);
        expect(result1.exercise.category_id).toBe(categoryExpect);
        expect(result1.exercise.user_id).toBe(userFake1.id);

        const result2 = await useCaseSelect.execute({ id: output2.id }, userFake2);
        expect(result2.exercise.id).toBe(output2.id);
        expect(result2.exercise.name).toBe(output2.name);
        expect(result2.exercise.category_id).toBe(categoryExpect);
        expect(result2.exercise.user_id).toBe(userFake2.id);
    });

    it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios oficiais', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userAdminFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const userFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        await useCaseCreate.execute(input, userAdminFake);

        await expect(
            useCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo',
            role: 'USER'
        };
        await useCaseCreate.execute(input, userFake);

        await expect(
            useCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role ADMIN entre Exercícios oficiais', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo',
            role: 'ADMIN'
        };
        await useCaseCreate.execute(input, userFake);

        await expect(
            useCaseCreate.execute(input, userFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

    it('não deve permitir nomes de exercicio duplicados com role ADMIN entre todas as Exercícios (oficiais e de outros usuários)', async () => {
        const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
        const categoryExpect = categoryOutput ? categoryOutput.id : null;
        const input: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
        const userFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const userAdminFake: CreateExerciseUserDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };

        await useCaseCreate.execute(input, userFake);

        await expect(
            useCaseCreate.execute(input, userAdminFake)
        ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });


});
