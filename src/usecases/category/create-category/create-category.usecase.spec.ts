import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCategoryInputDto, CreateCategoryUsecase, CreateCategoryUserDto } from './create-category.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { ListCategoryUsecase } from '../list-category/list-category.usecase';

let categoryRepository: CategoryRepositoryInMemory;
let useCaseCreate: CreateCategoryUsecase;
let useCaseList: ListCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  useCaseCreate = CreateCategoryUsecase.create(categoryRepository);
  useCaseList = ListCategoryUsecase.create(categoryRepository);
});

describe('CreateCategoryUsecase', () => {
  it('deve criar uma categoria com sucesso com role ADMIN', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const output = await useCaseCreate.execute(input, userFake);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const result = await useCaseList.execute(undefined, userFake);
    expect(result.categories.length).toBe(1);
    expect(result.categories[0].name).toBe('Eletrônicos');
  });

  it('deve criar uma categoria com sucesso com role USER', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output = await useCaseCreate.execute(input, userFake);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const result = await useCaseList.execute(undefined, userFake);
    expect(result.categories.length).toBe(1);
    expect(result.categories[0].name).toBe('Eletrônicos');
  });

  it('deve criar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    await useCaseCreate.execute(input, userFake);

    const input2: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake2: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User 2',
      role: 'USER'
    };
    const output = await useCaseCreate.execute(input2, userFake2);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const result = await useCaseList.execute(undefined, userFake);
    expect(result.categories.length).toBe(1);
    expect(result.categories[0].name).toBe('Eletrônicos');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'ADMIN'
    };
    await useCaseCreate.execute(input, userFake);

    const input2 = { name: 'Eletrônicos' };

    await expect(
      useCaseCreate.execute(input2, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it.only('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const cat1 = await useCaseCreate.execute(input, userFake);
    console.log("cat1 >> ",cat1);
    
    const userAdminFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };

    await expect(
      useCaseCreate.execute(input, userAdminFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias (oficiais e criadas pelo usuário logado)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'USER'
    };
    await useCaseCreate.execute(input, userFake);

    const input2 = { name: 'Eletrônicos' };

    await expect(
      useCaseCreate.execute(input2, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });
});
