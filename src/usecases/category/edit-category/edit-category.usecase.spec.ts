import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecase, CreateCategoryUsecaseInputDto, CreateCategoryUsecaseUserDto } from '../create-category/create-category.usecase';
import { EditCategoryUsecase, EditCategoryInputDto } from './edit-category.usecase';

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
    const inputCreate: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userAdmin: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const createdCategory = await createUseCase.execute(inputCreate, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: createdCategory.category.id,
      name: 'Eletrônicos 2',
      user_id: userAdmin.id,
    };
    const output = await editUseCase.execute(editInput, userAdmin);

    expect(output.category.id).toBe(createdCategory.category.id);
    expect(output.category.name).toBe('Eletrônicos 2');
    expect(output.category.user_id).toBe(null);
  });

  it('deve atualizar uma categoria com sucesso com role USER', async () => {
    const inputCreate: CreateCategoryUsecaseInputDto = { name: 'Esportes' };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    const createdCategory = await createUseCase.execute(inputCreate, userFake);

    const editInput: EditCategoryInputDto = {
      id: createdCategory.category.id,
      name: 'Esportes e Lazer',
      user_id: userFake.id,
    };
    const output = await editUseCase.execute(editInput, userFake);

    expect(output.category.id).toBe(createdCategory.category.id);
    expect(output.category.name).toBe('Esportes e Lazer');
    expect(output.category.user_id).toBe(userFake.id);
  });

  it('deve atualizar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
    const user1: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User1',
      role: 'USER'
    };
    await createUseCase.execute({ name: 'Eletrônicos' }, user1);

    const user2: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User2',
      role: 'USER'
    };
    const categoryUser2 = await createUseCase.execute({ name: 'Eletrônicos Pro' }, user2);

    const editInput: EditCategoryInputDto = {
      id: categoryUser2.category.id,
      name: 'Eletrônicos',
      user_id: user2.id,
    };
    const output = await editUseCase.execute(editInput, user2);

    expect(output.category.id).toBe(categoryUser2.category.id);
    expect(output.category.name).toBe('Eletrônicos');
    expect(output.category.user_id).toBe(user2.id);
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias oficiais', async () => {
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    const categoryOfUser = await createUseCase.execute({ name: 'Eletrônicos' }, userFake);

    const userAdmin: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const categoryOfAdmin = await createUseCase.execute({ name: 'Domésticos' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: categoryOfUser.category.id,
      name: categoryOfAdmin.category.name,
      user_id: userFake.id,
    };

    await expect(
      editUseCase.execute(editInput, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias criadas pelo usuário logado (mesmo USER)', async () => {
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    const category1 = await createUseCase.execute({ name: 'Eletrônicos' }, userFake);
    const category2 = await createUseCase.execute({ name: 'Domésticos' }, userFake);

    const editInput: EditCategoryInputDto = {
      id: category2.category.id,
      name: category1.category.name,
      user_id: userFake.id,
    };

    await expect(
      editUseCase.execute(editInput, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', async () => {
    const userAdmin: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    await createUseCase.execute({ name: 'Eletrônicos' }, userAdmin);
    const cat2 = await createUseCase.execute({ name: 'Domésticos' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: cat2.category.id,
      name: 'Eletrônicos',
      user_id: null,
    };

    await expect(
      editUseCase.execute(editInput, userAdmin)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', async () => {
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'User Test',
      role: 'USER'
    };
    await createUseCase.execute({ name: 'Eletrônicos' }, userFake);

    const userAdmin: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Admin Test',
      role: 'ADMIN'
    };
    const categoryByAdmin = await createUseCase.execute({ name: 'Oficial Cat' }, userAdmin);

    const editInput: EditCategoryInputDto = {
      id: categoryByAdmin.category.id,
      name: 'Eletrônicos',
      user_id: null,
    };

    await expect(
      editUseCase.execute(editInput, userAdmin)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });


});
