import { describe, it, expect, beforeEach } from 'vitest';
import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
import { ListExerciseUsecase } from './list-exercise.usecase';
import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserInputDto } from '../create-exercise/create-exercise.usecase';
import { createCategoryWithAdmin } from '../../../utils/category.test.utils';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecase } from '../../category/create-category/create-category.usecase';
import { categoryCreateMock } from '../../category/create-category/create-category.usecase.spec';

let categoryRepository: CategoryRepositoryInMemory;
let exerciseRepository: ExerciseRepositoryInMemory;
let categoryUseCaseCreate: CreateCategoryUsecase;
let exerciseUseCaseCreate: CreateExerciseUsecase;
let exerciseUseCaseList: ListExerciseUsecase;

beforeEach(() => {
    categoryRepository = CategoryRepositoryInMemory.create();
    exerciseRepository = ExerciseRepositoryInMemory.create();
    categoryUseCaseCreate = CreateCategoryUsecase.create(categoryRepository);
    exerciseUseCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    exerciseUseCaseList = ListExerciseUsecase.create(exerciseRepository);
});

describe('ListExerciseUsecase', () => {
    it('deve listar Categorias sendo Usuário role ADMIN', async () => {
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const input2: CreateExerciseInputDto = { name: 'Fight Practice', categories: [categoryOutput.category] };

        const output = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        const output2 = (await exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(null);
        expect(output2.id).toBeDefined();
        expect(output2.name).toBe('Fight Practice');
        expect(output2.user_id).toBe(null);

        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const input3: CreateExerciseInputDto = { name: 'Jump Practice', categories: [categoryOutput.category] };
        const output3 = (await exerciseUseCaseCreate.execute(input3, userFake)).exercise;
        expect(output3.id).toBeDefined();
        expect(output3.name).toBe('Jump Practice');
        expect(output3.user_id).toBe(userFake.id);

        const list = (await exerciseUseCaseList.execute(undefined, userAdminFake)).exercises;
        expect(list.length).toBe(2);
        expect(list[0].name).toBe('Yoga Practice');
        expect(list[1].name).toBe('Fight Practice');
    });

    it('deve listar Categorias sendo Usuário role USER', async () => {
        const userAdminFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo Admin',
            role: 'ADMIN'
        };
        const categoryOutput = await categoryUseCaseCreate.execute(categoryCreateMock, userAdminFake);
        const input: CreateExerciseInputDto = { name: 'Yoga Practice', categories: [categoryOutput.category] };
        const input2: CreateExerciseInputDto = { name: 'Fight Practice', categories: [categoryOutput.category] };

        const output = (await exerciseUseCaseCreate.execute(input, userAdminFake)).exercise;
        const output2 = (await exerciseUseCaseCreate.execute(input2, userAdminFake)).exercise;
        expect(output.id).toBeDefined();
        expect(output.name).toBe('Yoga Practice');
        expect(output.user_id).toBe(null);
        expect(output2.id).toBeDefined();
        expect(output2.name).toBe('Fight Practice');
        expect(output2.user_id).toBe(null);

        const userFake: CreateExerciseUserInputDto = {
            id: crypto.randomUUID(),
            name: 'Paulo User',
            role: 'USER'
        };
        const input3: CreateExerciseInputDto = { name: 'Jump Practice', categories: [categoryOutput.category] };
        const output3 = (await exerciseUseCaseCreate.execute(input3, userFake)).exercise;
        expect(output3.id).toBeDefined();
        expect(output3.name).toBe('Jump Practice');
        expect(output3.user_id).toBe(userFake.id);

        const list = (await exerciseUseCaseList.execute(undefined, userFake)).exercises;
        expect(list.length).toBe(3);
        expect(list[0].name).toBe('Yoga Practice');
        expect(list[1].name).toBe('Fight Practice');
        expect(list[2].name).toBe('Jump Practice');
    });

});
