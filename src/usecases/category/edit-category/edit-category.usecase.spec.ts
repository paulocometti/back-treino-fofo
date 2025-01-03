import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecase, CreateCategoryInputDto, CreateCategoryUserDto } from '../create-category/create-category.usecase';
import { EditCategoryUsecase, EditCategoryInputDto, EditCategoryUserDto } from './edit-category.usecase';

let categoryRepository: CategoryRepositoryInMemory;
let createUseCase: CreateCategoryUsecase;
let editUseCase: EditCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  createUseCase = CreateCategoryUsecase.create(categoryRepository);
  editUseCase = EditCategoryUsecase.create(categoryRepository);
});

describe('EditCategoryUsecase', () => {
  it('deve atualizar uma categoria com sucesso com role ADMIN', async () => {
    const inputCreate: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userAdmin: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const createdCategory = await createUseCase.execute(inputCreate, userAdmin);
    console.log("createdCategory >> ", createdCategory);

    const editInput: EditCategoryInputDto = {
      id: createdCategory.id,
      name: 'Eletrônicos 2',
      user_id: userAdmin.id,
    };
    const output = await editUseCase.execute(editInput, userAdmin);

    expect(output.id).toBe(createdCategory.id);
    expect(output.name).toBe('Eletrônicos 2');
    expect(output.user_id).toBe(null);
  });

  it('deve atualizar uma categoria com sucesso com role USER', async () => {
    const inputCreate: CreateCategoryInputDto = { name: 'Esportes' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    const createdCategory = await createUseCase.execute(inputCreate, userFake);

    const editInput: EditCategoryInputDto = {
      id: createdCategory.id,
      name: 'Esportes e Lazer',
      user_id: userFake.id,
    };
    const output = await editUseCase.execute(editInput, userFake);

    expect(output.id).toBe(createdCategory.id);
    expect(output.name).toBe('Esportes e Lazer');
    expect(output.user_id).toBe(userFake.id);
  });

  it('deve atualizar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
    const user1: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'User1',
      role: 'USER'
    };
    await createUseCase.execute({ name: 'Eletrônicos' }, user1);

    const user2: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'User2',
      role: 'USER'
    };
    const categoryUser2 = await createUseCase.execute({ name: 'Eletrônicos' }, user2);

    const editInput: EditCategoryInputDto = {
      id: categoryUser2.id,
      name: 'Eletrônicos Pro',
      user_id: user2.id,
    };
    const output = await editUseCase.execute(editInput, user2);

    expect(output.id).toBe(categoryUser2.id);
    expect(output.name).toBe('Eletrônicos Pro');
    expect(output.user_id).toBe(user2.id);
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', async () => {
    const userAdmin: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const cat1 = await createUseCase.execute({ name: 'Eletrônicos' }, userAdmin);
    const cat2 = await createUseCase.execute({ name: 'Domésticos' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: cat2.id,
      name: 'Eletrônicos',
      user_id: null,
    };

    await expect(
      editUseCase.execute(editInput, userAdmin)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', async () => {
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    const userCategory = await createUseCase.execute({ name: 'Eletrônicos' }, userFake);

    const userAdmin: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const adminCategory = await createUseCase.execute({ name: 'Oficial Cat' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: adminCategory.id,
      name: 'Eletrônicos',
      user_id: null,
    };

    await expect(
      editUseCase.execute(editInput, userAdmin)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias (oficiais e criadas pelo usuário logado)', async () => {

    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    await createUseCase.execute({ name: 'Eletrônicos' }, userFake);

    const userAdmin: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const catUser2 = await createUseCase.execute({ name: 'Domésticos' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: catUser2.id,
      name: 'Eletrônicos',
      user_id: userFake.id,
    };

    await expect(
      editUseCase.execute(editInput, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });
});
