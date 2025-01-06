// import { describe, it, expect, beforeEach } from 'vitest';
// import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
// import { CreateExerciseInputDto, CreateExerciseUsecase, CreateExerciseUserDto } from '../create-exercise/create-exercise.usecase';
// import { SelectExerciseUsecase } from './select-exercise.usecase';
// import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
// import { createCategoryWithAdmin } from '../../../utils/category.test.utils';

// let categoryRepository: CategoryRepositoryInMemory;
// let exerciseRepository: ExerciseRepositoryInMemory;
// let useCaseCreate: CreateExerciseUsecase;
// let useCaseSelect: SelectExerciseUsecase;

// beforeEach(() => {
//     categoryRepository = CategoryRepositoryInMemory.create();
//     exerciseRepository = ExerciseRepositoryInMemory.create();
//     useCaseCreate = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
//     useCaseSelect = SelectExerciseUsecase.create(exerciseRepository);
// });

// describe.skip('SelectExerciseUsecase', () => {
//     it('deve dar Select em um Exercicio sendo Usuário role ADMIN', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const userAdminFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo Admin',
//             role: 'ADMIN'
//         };
//         const output1 = await useCaseCreate.execute(input1, userAdminFake);

//         expect(output1).toHaveProperty('id');
//         expect(output1.name).toBe(input1.name);
//         expect(output1.user_id).toBe(null);

//         const select = (await useCaseSelect.execute(output1, userAdminFake)).exercise;
//         expect(select.name).toBe(input1.name);
//         expect(output1.user_id).toBe(null);
//     });

//     it('deve dar Select em um Exercicio sendo Usuário role USER', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const userFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User',
//             role: 'USER'
//         };
//         const output1 = await useCaseCreate.execute(input1, userFake);

//         expect(output1).toHaveProperty('id');
//         expect(output1.name).toBe(input1.name);
//         expect(output1.user_id).toBe(userFake.id);

//         const select = (await useCaseSelect.execute(output1, userFake)).exercise;
//         expect(select.name).toBe(input1.name);
//         expect(select.user_id).toBe(userFake.id);
//     });

//     it('deve dar Select em um Exercicio OFICIAL sendo Usuário role USER', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
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

//         expect(output1).toHaveProperty('id');
//         expect(output1.name).toBe(input1.name);
//         expect(output1.user_id).toBe(null);

//         const select = (await useCaseSelect.execute(output1, userFake)).exercise;
//         expect(select.name).toBe(input1.name);
//         expect(select.user_id).toBe(null);
//     });

//     it('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role ADMIN', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const userFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User',
//             role: 'ADMIN'
//         };
//         await useCaseCreate.execute(input1, userFake);

//         const input2: CreateExerciseInputDto = { name: 'Vídeo', category_id: categoryOutput.id };
//         const userFake2: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User2',
//             role: 'USER'
//         };
//         const output2 = await useCaseCreate.execute(input2, userFake2);

//         await expect(
//             useCaseSelect.execute(output2, userFake)
//         ).rejects.toThrow('Nada encontrado.');
//     });

//     it('não deve dar Select em um Exercicio de outro USUÁRIO sendo Usuário role USER', async () => {
//         const categoryOutput = await createCategoryWithAdmin(categoryRepository);
//         const input1: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryOutput.id };
//         const userFake: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User',
//             role: 'USER'
//         };
//         const output1 = await useCaseCreate.execute(input1, userFake);

//         const input2: CreateExerciseInputDto = { name: 'Vídeo', category_id: categoryOutput.id };
//         const userFake2: CreateExerciseUserDto = {
//             id: crypto.randomUUID(),
//             name: 'Paulo User2',
//             role: 'USER'
//         };
//         await useCaseCreate.execute(input2, userFake2);

//         await expect(
//             useCaseSelect.execute(output1, userFake2)
//         ).rejects.toThrow('Nada encontrado.');
//     });
// });
