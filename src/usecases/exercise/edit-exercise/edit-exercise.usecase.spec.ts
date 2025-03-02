import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { CreateExerciseUsecase, CreateExerciseInputDto } from '../create-exercise/create-exercise.usecase';
import { EditExerciseUsecase, EditExerciseInputDto, } from './edit-exercise.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { categoryCreateMock } from '../../category/create-category/create-category.usecase.spec';
import { CreateCategoryUsecase } from '../../category/create-category/create-category.usecase';
import { UserInputDto } from '../../../middleware/keycloakAuth.middleware';
import crypto from 'crypto';

let categoryRepository: CategoryRepositoryInMemory;
let exerciseRepository: ExerciseRepositoryInMemory;
let categoryUseCaseCreate: CreateCategoryUsecase;
let exerciseUseCaseCreate: CreateExerciseUsecase;
let exerciseUseCaseEdit: EditExerciseUsecase;

beforeEach(() => {
    categoryRepository = CategoryRepositoryInMemory.create();
    exerciseRepository = ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseEdit = EditExerciseUsecase.create(categoryRepository, exerciseRepository);
});

describe('EditExerciseUsecase', () => {
    it('deve atualizar um Exercício com sucesso com role ADMIN', async () => {
        const userAdminFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(null);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseEdit.execute(inputEdit, userAdminFake)).exercise;

        expect(output.id).toBe(exerciseCreated.id);
        expect(output.name).toBe(inputEdit.name);
        expect(output.user_id).toBe(null);
        expect(output.categories[0].name).toBe(categoryCreateMock.name);
    });

    it('deve atualizar um Exercício com sucesso com role USER', async () => {
        const userFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(userFake.id);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseEdit.execute(inputEdit, userFake)).exercise;

        expect(output.id).toBe(exerciseCreated.id);
        expect(output.name).toBe(inputEdit.name);
        expect(output.user_id).toBe(userFake.id);
        expect(output.categories[0].name).toBe(categoryCreateMock.name);
    });
  
    it('deve atualizar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
        const userAdminFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const userFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(userFake.id);
        expect(exerciseCreated.categories[0].name).toBe(categoryCreateMock.name);
        
        const userFake2: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const input2: CreateExerciseInputDto = { name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const exerciseCreated2 = (await exerciseUseCaseCreate.execute(input2, userFake2)).exercise;
        expect(exerciseCreated2.id).toBeDefined();
        expect(exerciseCreated2.name).toBe('Yoga Practice 2');
        expect(exerciseCreated2.user_id).toBe(userFake2.id);
        expect(exerciseCreated2.categories[0].name).toBe(categoryCreateMock.name);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated.id, name: 'Yoga Practice 2', categories: [categoryOutput.category] };
        const output = (await exerciseUseCaseEdit.execute(inputEdit, userFake)).exercise;

        expect(output.id).toBe(exerciseCreated.id);
        expect(output.name).toBe(inputEdit.name);
        expect(output.user_id).toBe(userFake.id);
        expect(output.categories[0].name).toBe(categoryCreateMock.name);
    });
  
    it('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios oficiais', async () => {
        const userAdminFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(null);

        const userFake2: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User 2',
            role: 'USER'
        };
        const input2: CreateExerciseInputDto = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (await exerciseUseCaseCreate.execute(input2, userFake2)).exercise;
        expect(exerciseCreated2.id).toBeDefined();
        expect(exerciseCreated2.name).toBe('Yoga');
        expect(exerciseCreated2.user_id).toBe(userFake2.id);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
        
      await expect(
        exerciseUseCaseEdit.execute(inputEdit, userFake2)
      ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });
  
    it('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', async () => {
        const userFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(userFake.id);

        const input2: CreateExerciseInputDto = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (await exerciseUseCaseCreate.execute(input2, userFake)).exercise;
        expect(exerciseCreated2.id).toBeDefined();
        expect(exerciseCreated2.name).toBe('Yoga');
        expect(exerciseCreated2.user_id).toBe(userFake.id);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
  
      await expect(
        exerciseUseCaseCreate.execute(inputEdit, userFake)
      ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });
  
    it('não deve permitir nomes de exercício duplicados com role ADMIN entre Exercícios oficiais', async () => {
        const userAdminFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(null);

        const input2: CreateExerciseInputDto = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (await exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        expect(exerciseCreated2.id).toBeDefined();
        expect(exerciseCreated2.name).toBe('Yoga');
        expect(exerciseCreated2.user_id).toBe(null);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
  
      await expect(
        exerciseUseCaseCreate.execute(inputEdit, userAdminFake)
      ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });
  
    it('não deve permitir nomes de exercício duplicados com role ADMIN entre todas as Exercícios (oficiais e de outros usuários)', async () => {
        const userAdminFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const userFake: UserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const exerciseCreated = (await exerciseUseCaseCreate.execute(input, userFake)).exercise;
        expect(exerciseCreated.id).toBeDefined();
        expect(exerciseCreated.name).toBe('Yoga Practice');
        expect(exerciseCreated.user_id).toBe(userFake.id);

        const input2: CreateExerciseInputDto = { name: 'Yoga', categories: [categoryOutput.category] };
        const exerciseCreated2 = (await exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        expect(exerciseCreated2.id).toBeDefined();
        expect(exerciseCreated2.name).toBe('Yoga');
        expect(exerciseCreated2.user_id).toBe(null);

        const inputEdit: EditExerciseInputDto = { id: exerciseCreated2.id, name: 'Yoga Practice', categories: [categoryOutput.category] };
  
      await expect(
        exerciseUseCaseCreate.execute(inputEdit, userAdminFake)
      ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
    });

});
