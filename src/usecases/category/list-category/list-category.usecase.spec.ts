import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { ListCategoryUsecase } from './list-category.usecase';
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase, CreateCategoryUsecaseUserDto } from '../create-category/create-category.usecase';

let categoryRepository: CategoryRepositoryInMemory;
let useCaseCreate: CreateCategoryUsecase;
let useCaseList: ListCategoryUsecase;

beforeEach(() => {
  categoryRepository = CategoryRepositoryInMemory.create();
  useCaseCreate = CreateCategoryUsecase.create(categoryRepository);
  useCaseList = ListCategoryUsecase.create(categoryRepository);
});

describe('ListCategoryUsecase', () => {
  it('deve listar Categorias sendo Usuário role ADMIN', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const input2: CreateCategoryUsecaseInputDto = { name: 'Vídeo' };
    const input3: CreateCategoryUsecaseInputDto = { name: 'Ferramentas' };
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
    const output1 = await useCaseCreate.execute(input1, userAdminFake);
    const output2 = await useCaseCreate.execute(input2, userAdminFake);
    const output3 = await useCaseCreate.execute(input3, userFake);

    expect(output1.category).toHaveProperty('id');
    expect(output1.category.name).toBe('Eletrônicos');
    expect(output2.category).toHaveProperty('id');
    expect(output2.category.name).toBe('Vídeo');
    expect(output3.category).toHaveProperty('id');
    expect(output3.category.name).toBe('Ferramentas');

    const list = (await useCaseList.execute(undefined, userAdminFake)).categories;
    expect(list.length).toBe(2);
    expect(list[0].name).toBe('Eletrônicos');
    expect(list[1].name).toBe('Vídeo');
  });

  it('deve listar Categorias sendo Usuário role USER', async () => {
    const input1: CreateCategoryUsecaseInputDto = { name: 'Eletrônicos' };
    const input2: CreateCategoryUsecaseInputDto = { name: 'Vídeo' };
    const input3: CreateCategoryUsecaseInputDto = { name: 'Ferramentas' };
    const input4: CreateCategoryUsecaseInputDto = { name: 'Nao Aparecer' };
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
    const userFake2: CreateCategoryUsecaseUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User2',
      role: 'USER'
    };
    const output1 = await useCaseCreate.execute(input1, userAdminFake);
    const output2 = await useCaseCreate.execute(input2, userAdminFake);
    const output3 = await useCaseCreate.execute(input3, userFake);
    const output4 = await useCaseCreate.execute(input4, userFake2);

    expect(output1.category).toHaveProperty('id');
    expect(output1.category.name).toBe('Eletrônicos');
    expect(output2.category).toHaveProperty('id');
    expect(output2.category.name).toBe('Vídeo');
    expect(output3.category).toHaveProperty('id');
    expect(output3.category.name).toBe('Ferramentas');
    expect(output4.category).toHaveProperty('id');
    expect(output4.category.name).toBe('Nao Aparecer');

    const list = (await useCaseList.execute(undefined, userFake)).categories;
    expect(list.length).toBe(3);
    expect(list[0].name).toBe('Eletrônicos');
    expect(list[1].name).toBe('Vídeo');
    expect(list[2].name).toBe('Ferramentas');
  });

});
