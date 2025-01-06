// import { describe, it, expect, beforeEach } from 'vitest';
// import { ExerciseRepositoryInMemory } from '../../../infra/repositories/exercise/exercise.repository.in-memory';
// import { CreateExerciseUsecase, CreateExerciseInputDto, CreateExerciseUserDto } from '../create-exercise/create-exercise.usecase';
// import { EditExerciseUsecase, EditExerciseInputDto, EditExerciseUserDto } from './edit-exercise.usecase';
// import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
// import { createCategoryWithAdmin } from '../../../utils/category.test.utils';

// let categoryRepository: CategoryRepositoryInMemory;
// let exerciseRepository: ExerciseRepositoryInMemory;
// let createUseCase: CreateExerciseUsecase;
// let editUseCase: EditExerciseUsecase;

// beforeEach(() => {
//   categoryRepository = CategoryRepositoryInMemory.create();
//   exerciseRepository = ExerciseRepositoryInMemory.create();
//   createUseCase = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
//   editUseCase = EditExerciseUsecase.create(categoryRepository, exerciseRepository);
// });

// describe.skip('EditExerciseUsecase', () => {
//   it('deve atualizar um Exercício com sucesso com role ADMIN', async () => {
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const inputCreate: CreateExerciseInputDto = { name: 'Eletrônicos', category_id: categoryExpect };
//     const userAdmin: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'Admin Test',
//       role: 'ADMIN'
//     };
//     const createdExercise = await createUseCase.execute(inputCreate, userAdmin);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: createdExercise.id,
//       name: 'Eletrônicos 2',
//       category_id: categoryExpectEdit,
//       user_id: userAdmin.id,
//     };
//     const output = await editUseCase.execute(editInput, userAdmin);

//     expect(output.id).toBe(createdExercise.id);
//     expect(output.name).toBe(editInput.name);
//     expect(output.category_id).toBe(categoryExpectEdit);
//     expect(output.user_id).toBe(null);
//   });

//   it('deve atualizar um Exercício com sucesso com role USER', async () => {
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const inputCreate: CreateExerciseInputDto = { name: 'Esportes', category_id: categoryExpect };
//     const userFake: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User Test',
//       role: 'USER'
//     };
//     const createdExercise = await createUseCase.execute(inputCreate, userFake);

//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: createdExercise.id,
//       name: 'Esportes e Lazer',
//       category_id: categoryExpect2,
//       user_id: userFake.id,
//     };
//     const output = await editUseCase.execute(editInput, userFake);

//     expect(output.id).toBe(createdExercise.id);
//     expect(output.name).toBe(editInput.name);
//     expect(output.category_id).toBe(categoryExpect2);
//     expect(output.user_id).toBe(userFake.id);
//   });

//   it('deve atualizar um Exercício com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const user1: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User1',
//       role: 'USER'
//     };
//     await createUseCase.execute({ name: 'Eletrônicos', category_id: categoryExpect }, user1);

//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const user2: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User2',
//       role: 'USER'
//     };
//     const exerciseUser2 = await createUseCase.execute({ name: 'Eletrônicos Pro', category_id: categoryExpect2 }, user2);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: exerciseUser2.id,
//       name: 'Eletrônicos',
//       category_id: categoryExpectEdit,
//       user_id: user2.id,
//     };
//     const output = await editUseCase.execute(editInput, user2);

//     expect(output.id).toBe(exerciseUser2.id);
//     expect(output.name).toBe(editInput.name);
//     expect(output.category_id).toBe(categoryExpectEdit);
//     expect(output.user_id).toBe(user2.id);
//   });

//   it('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios oficiais', async () => {
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const userFake: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User Test',
//       role: 'USER'
//     };
//     const exerciseOfUser = await createUseCase.execute({ name: 'Eletrônicos', category_id: categoryExpect }, userFake);

//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const userAdmin: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'Admin Test',
//       role: 'ADMIN'
//     };
//     const exerciseOfAdmin = await createUseCase.execute({ name: 'Domésticos', category_id: categoryExpect2 }, userAdmin);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: exerciseOfUser.id,
//       name: exerciseOfAdmin.name,
//       category_id: categoryExpectEdit,
//       user_id: userFake.id,
//     };

//     await expect(
//       editUseCase.execute(editInput, userFake)
//     ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
//   });

//   it('não deve permitir nomes de exercício duplicados com role USER entre as Exercícios criadas pelo usuário logado (mesmo USER)', async () => {
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const userFake: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User Test',
//       role: 'USER'
//     };
//     const exercise1 = await createUseCase.execute({ name: 'Eletrônicos', category_id: categoryExpect }, userFake);

//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const exercise2 = await createUseCase.execute({ name: 'Domésticos', category_id: categoryExpect2 }, userFake);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: exercise2.id,
//       name: exercise1.name,
//       category_id: categoryExpectEdit,
//       user_id: userFake.id,
//     };

//     await expect(
//       editUseCase.execute(editInput, userFake)
//     ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
//   });

//   it('não deve permitir nomes de exercício duplicados com role ADMIN entre Exercícios oficiais', async () => {
//     const userAdmin: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'Admin Test',
//       role: 'ADMIN'
//     };
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     const cat1 = await createUseCase.execute({ name: 'Eletrônicos', category_id: categoryExpect }, userAdmin);

//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const cat2 = await createUseCase.execute({ name: 'Domésticos', category_id: categoryExpect2 }, userAdmin);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: cat2.id,
//       name: 'Eletrônicos',
//       category_id: categoryExpectEdit,
//       user_id: null,
//     };

//     await expect(
//       editUseCase.execute(editInput, userAdmin)
//     ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
//   });

//   it('não deve permitir nomes de exercício duplicados com role ADMIN entre todas as Exercícios (oficiais e de outros usuários)', async () => {
//     const userFake: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'User Test',
//       role: 'USER'
//     };
//     const categoryOutput = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect = categoryOutput ? categoryOutput.id : null;
//     await createUseCase.execute({ name: 'Eletrônicos', category_id: categoryExpect }, userFake);

//     const userAdmin: CreateExerciseUserDto = {
//       id: crypto.randomUUID(),
//       name: 'Admin Test',
//       role: 'ADMIN'
//     };
//     const categoryOutput2 = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpect2 = categoryOutput2 ? categoryOutput2.id : null;
//     const exerciseByAdmin = await createUseCase.execute({ name: 'Oficial Cat', category_id: categoryExpect2 }, userAdmin);

//     const categoryOutputEdit = (Math.random() < 0.5) ? (await createCategoryWithAdmin(categoryRepository)) : null;
//     const categoryExpectEdit = categoryOutputEdit ? categoryOutputEdit.id : null;
//     const editInput: EditExerciseInputDto = {
//       id: exerciseByAdmin.id,
//       name: 'Eletrônicos',
//       category_id: categoryExpectEdit,
//       user_id: null,
//     };

//     await expect(
//       editUseCase.execute(editInput, userAdmin)
//     ).rejects.toThrow('Já existe um Exercício com este nome. Por favor, tente outro nome!');
//   });

// });
