"use strict";
// import { describe, it, expect, beforeEach } from 'vitest';
// import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
// import { ListExerciseUsecase } from './list-exercise.usecase';
// import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserDto } from '../create-exercise/create-exercise.usecase';
// import { createCategoryWithAdmin } from '../../../utils/category.test.utils';
// import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
// let categoryRepository: CategoryRepositoryInMemory;
// let exerciseRepository: ExerciseRepositoryInMemory;
// let useCaseCreate: CreateExerciseUsecase;
// let useCaseList: ListExerciseUsecase;
// beforeEach(() => {
//     categoryRepository = CategoryRepositoryInMemory.create();
//     exerciseRepository = ExerciseRepositoryInMemory.create();
//     useCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
//     useCaseList = ListExerciseUsecase.create(exerciseRepository);
// });
// describe.skip('ListExerciseUsecase', () => {
//     it('deve listar Categorias sendo Usuário role ADMIN', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const input2: CreateExerciseInputDto = { name: 'Vídeo', category_id: categoryOutput.id };
//         const input3: CreateExerciseInputDto = { name: 'Ferramentas', category_id: categoryOutput.id };
//         const userAdminFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo Admin',
//             role: 'ADMIN'
//         };
//         const userFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User',
//             role: 'USER'
//         };
//         const output1 = await useCaseCreate.execute(input1, userAdminFake);
//         const output2 = await useCaseCreate.execute(input2, userAdminFake);
//         const output3 = await useCaseCreate.execute(input3, userFake);
//         expect(output1).toHaveProperty('id');
//         expect(output1.name).toBe('Eletrônicos');
//         expect(output2).toHaveProperty('id');
//         expect(output2.name).toBe('Vídeo');
//         expect(output3).toHaveProperty('id');
//         expect(output3.name).toBe('Ferramentas');
//         const list = (await useCaseList.execute(undefined, userAdminFake)).exercises;
//         expect(list.length).toBe(2);
//         expect(list[0].name).toBe('Eletrônicos');
//         expect(list[1].name).toBe('Vídeo');
//     });
//     it('deve listar Categorias sendo Usuário role USER', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const input2: CreateExerciseInputDto = { name: 'Vídeo', category_id: categoryOutput.id };
//         const input3: CreateExerciseInputDto = { name: 'Ferramentas', category_id: categoryOutput.id };
//         const input4: CreateExerciseInputDto = { name: 'Nao Aparecer', category_id: categoryOutput.id };
//         const userAdminFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo Admin',
//             role: 'ADMIN'
//         };
//         const userFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User',
//             role: 'USER'
//         };
//         const userFake2: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User2',
//             role: 'USER'
//         };
//         const output1 = await useCaseCreate.execute(input1, userAdminFake);
//         const output2 = await useCaseCreate.execute(input2, userAdminFake);
//         const output3 = await useCaseCreate.execute(input3, userFake);
//         const output4 = await useCaseCreate.execute(input4, userFake2);
//         expect(output1).toHaveProperty('id');
//         expect(output1.name).toBe('Eletrônicos');
//         expect(output2).toHaveProperty('id');
//         expect(output2.name).toBe('Vídeo');
//         expect(output3).toHaveProperty('id');
//         expect(output3.name).toBe('Ferramentas');
//         expect(output4).toHaveProperty('id');
//         expect(output4.name).toBe('Nao Aparecer');
//         const list = (await useCaseList.execute(undefined, userFake)).exercises;
//         expect(list.length).toBe(3);
//         expect(list[0].name).toBe('Eletrônicos');
//         expect(list[1].name).toBe('Vídeo');
//         expect(list[2].name).toBe('Ferramentas');
//     });
// });
