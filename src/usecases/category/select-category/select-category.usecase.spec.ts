import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase } from '../create-category/create-category.usecase';
import { SelectCategoryUsecase } from './select-category.usecase';
import { UserInputDto } from '../../../middleware/keycloakAuth.middleware';

let categoryRepository: CategoryRepositoryInMemory;
let useCaseCreate: CreateCategoryUsecase;
let useCaseSelect: SelectCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  useCaseCreate = CreateCategoryUsecase.create(categoryRepository);
  useCaseSelect = SelectCategoryUsecase.create(categoryRepository);
});

describe('SelectCategoryUsecase', () => {
  it('deve dar Select em uma Categoria sendo Usuário role ADMIN', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userAdminFake: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const output1 = await useCaseCreate.execute(input1, userAdminFake);

    expect(output1.category).toHaveProperty('id');
    expect(output1.category.name).toBe(input1.name);
    expect(output1.category.user_id).toBe(null);

    const select = (await useCaseSelect.execute(output1.category, userAdminFake)).category;
    expect(select.name).toBe(input1.name);
    expect(output1.category.user_id).toBe(null);
  });

  it('deve dar Select em uma Categoria sendo Usuário role USER', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userFake: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output1 = await useCaseCreate.execute(input1, userFake);

    expect(output1.category).toHaveProperty('id');
    expect(output1.category.name).toBe(input1.name);
    expect(output1.category.user_id).toBe(userFake.id);

    const select = (await useCaseSelect.execute(output1.category, userFake)).category;
    expect(select.name).toBe(input1.name);
    expect(select.user_id).toBe(userFake.id);
  });

  it('deve dar Select em uma Categoria OFICIAL sendo Usuário role USER', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
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
    const output1 = await useCaseCreate.execute(input1, userAdminFake);

    expect(output1.category).toHaveProperty('id');
    expect(output1.category.name).toBe(input1.name);
    expect(output1.category.user_id).toBe(null);

    const select = (await useCaseSelect.execute(output1.category, userFake)).category;
    expect(select.name).toBe(input1.name);
    expect(select.user_id).toBe(null);
  });

  it('não deve dar Select em uma Categoria de outro USUÁRIO sendo Usuário role ADMIN', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userFake: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'ADMIN'
    };
    await useCaseCreate.execute(input1, userFake);

    const input2: CreateCategoryUsecaseInputDto = { name: 'Vídeo' };
    const userFake2: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User2',
      role: 'USER'
    };
    const output2 = await useCaseCreate.execute(input2, userFake2);

    await expect(
      useCaseSelect.execute(output2.category, userFake)
    ).rejects.toThrow('Nada encontrado.');
  });

  it('não deve dar Select em uma Categoria de outro USUÁRIO sendo Usuário role USER', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const userFake: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output1 = await useCaseCreate.execute(input1, userFake);

    const input2: CreateCategoryUsecaseInputDto = { name: 'Vídeo' };
    const userFake2: UserInputDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User2',
      role: 'USER'
    };
    await useCaseCreate.execute(input2, userFake2);

    await expect(
      useCaseSelect.execute(output1.category, userFake2)
    ).rejects.toThrow('Nada encontrado.');
  });
});
