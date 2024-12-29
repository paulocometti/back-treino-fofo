import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCategoryInputDto, CreateCategoryUsecase, CreateCategoryUserDto } from './create-category.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';

let categoryRepository: CategoryRepositoryInMemory;
let useCase: CreateCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  useCase = CreateCategoryUsecase.create(categoryRepository);
});

describe('CreateCategoryUsecase', () => {
  it('deve criar uma categoria com sucesso com role ADMIN', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const output = await useCase.execute(input, userFake);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const userId: string | undefined = userFake.role === 'ADMIN' ? undefined : userFake.id;
    const categories = await categoryRepository.list(userId);
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Eletrônicos');
    expect(categories[0].user_id).toBe(null);
  });

  it('deve criar uma categoria com sucesso com role USER', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output = await useCase.execute(input, userFake);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const userId: string | undefined = userFake.role === 'ADMIN' ? undefined : userFake.id;
    const categories = await categoryRepository.list(userId);
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Eletrônicos');
    expect(categories[0].user_id).toBe(userFake.id);
  });

  it('deve criar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    await useCase.execute(input, userFake);

    const input2: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake2: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User 2',
      role: 'USER'
    };
    const output = await useCase.execute(input2, userFake2);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const userId2: string | undefined = userFake2.role === 'ADMIN' ? undefined : userFake2.id;
    const categories = await categoryRepository.list(userId2);
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Eletrônicos');
    expect(categories[0].user_id).toBe(userFake2.id);
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'ADMIN'
    };
    await useCase.execute(input, userFake);

    const input2 = { name: 'Eletrônicos' };

    await expect(
      useCase.execute(input2, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    await useCase.execute(input, userFake);
    
    const userAdminFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };

    await expect(
      useCase.execute(input, userAdminFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias (oficiais e criadas pelo usuário logado)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'USER'
    };
    await useCase.execute(input, userFake);

    const input2 = { name: 'Eletrônicos' };

    await expect(
      useCase.execute(input2, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });
});
