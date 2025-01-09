import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase, CreateCategoryUsecaseUserDto } from './create-category.usecase';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { SelectCategoryUsecase } from '../select-category/select-category.usecase';

let categoryRepository: CategoryRepositoryInMemory;
let useCaseCreate: CreateCategoryUsecase;
let useCaseSelect: SelectCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  useCaseCreate = CreateCategoryUsecase.create(categoryRepository);
  useCaseSelect = SelectCategoryUsecase.create(categoryRepository);
});

describe('CreateCategoryUsecase', () => {
  it('deve criar uma categoria com sucesso com role ADMIN', async () => {
    const input: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userAdminFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const output = await useCaseCreate.execute(input, userAdminFake);

    const result = await useCaseSelect.execute({ id: output.category.id }, userAdminFake);
    expect(result.category.id).toBe(output.category.id);
    expect(result.category.name).toBe(output.category.name);
    expect(result.category.user_id).toBe(null);
  });

  it('deve criar uma categoria com sucesso com role USER', async () => {
    const input: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output = await useCaseCreate.execute(input, userFake);

    const result = await useCaseSelect.execute({ id: output.category.id }, userFake);
    expect(result.category.id).toBe(output.category.id);
    expect(result.category.name).toBe(output.category.name);
    expect(result.category.user_id).toBe(userFake.id);
  });

  it('deve criar uma categoria com sucesso com role USER mesmo se existir a mesma CATEGORIA para outro USER', async () => {
    const input: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userFake1: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const userFake2: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User 2',
      role: 'USER'
    };

    const output1 = await useCaseCreate.execute(input, userFake1);
    const output2 = await useCaseCreate.execute(input, userFake2);

    const result1 = await useCaseSelect.execute({ id: output1.category.id }, userFake1);
    expect(result1.category.id).toBe(output1.category.id);
    expect(result1.category.name).toBe(output1.category.name);
    expect(result1.category.user_id).toBe(userFake1.id);

    const result2 = await useCaseSelect.execute({ id: output2.category.id }, userFake2);
    expect(result2.category.id).toBe(output2.category.id);
    expect(result2.category.name).toBe(output2.category.name);
    expect(result2.category.user_id).toBe(userFake2.id);
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias oficiais', async () => {
    const input = { name: 'Eletrônicos' };
    const userAdminFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    await useCaseCreate.execute(input, userAdminFake);

    await expect(
      useCaseCreate.execute(input, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role USER entre as Categorias criadas pelo usuário logado (mesmo USER)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'USER'
    };
    await useCaseCreate.execute(input, userFake);

    await expect(
      useCaseCreate.execute(input, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre Categorias oficiais', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'ADMIN'
    };
    await useCaseCreate.execute(input, userFake);

    await expect(
      useCaseCreate.execute(input, userFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });

  it('não deve permitir nomes de categoria duplicados com role ADMIN entre todas as Categorias (oficiais e de outros usuários)', async () => {
    const input = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const userAdminFake: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };

    await useCaseCreate.execute(input, userFake);

    await expect(
      useCaseCreate.execute(input, userAdminFake)
    ).rejects.toThrow('Já existe uma Categoria com este nome. Por favor, tente outro nome!');
  });


});
