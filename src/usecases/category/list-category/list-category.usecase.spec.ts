import { describe, it, expect, beforeEach } from 'vitest';
import { CategoryRepositoryInMemory } from '../../../infra/repositories/category/category.repository.in-memory';
import { ListCategoryUsecase } from './list-category.usecase';
import { CreateCategoryInputDto, CreateCategoryUsecase, CreateCategoryUserDto } from '../create-category/create-category.usecase';

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
    const input1: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const input2: CreateCategoryInputDto = { name: 'Vídeo' };
    const input3: CreateCategoryInputDto = { name: 'Ferramentas' };
    const userAdminFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const output1 = await useCaseCreate.execute(input1, userAdminFake);
    const output2 = await useCaseCreate.execute(input2, userAdminFake);
    const output3 = await useCaseCreate.execute(input3, userFake);

    expect(output1).toHaveProperty('id');
    expect(output1.name).toBe('Eletrônicos');
    expect(output2).toHaveProperty('id');
    expect(output2.name).toBe('Vídeo');
    expect(output3).toHaveProperty('id');
    expect(output3.name).toBe('Ferramentas');

    const list = (await useCaseList.execute(undefined, userAdminFake)).categories;
    expect(list.length).toBe(2);
    expect(list[0].name).toBe('Eletrônicos');
    expect(list[1].name).toBe('Vídeo');
  });

  it('deve listar Categorias sendo Usuário role USER', async () => {
    const input1: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const input2: CreateCategoryInputDto = { name: 'Vídeo' };
    const input3: CreateCategoryInputDto = { name: 'Ferramentas' };
    const input4: CreateCategoryInputDto = { name: 'Nao Aparecer' };
    const userAdminFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo Admin',
      role: 'ADMIN'
    };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User',
      role: 'USER'
    };
    const userFake2: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo User2',
      role: 'USER'
    };
    const output1 = await useCaseCreate.execute(input1, userAdminFake);
    const output2 = await useCaseCreate.execute(input2, userAdminFake);
    const output3 = await useCaseCreate.execute(input3, userFake);
    const output4 = await useCaseCreate.execute(input4, userFake2);

    expect(output1).toHaveProperty('id');
    expect(output1.name).toBe('Eletrônicos');
    expect(output2).toHaveProperty('id');
    expect(output2.name).toBe('Vídeo');
    expect(output3).toHaveProperty('id');
    expect(output3.name).toBe('Ferramentas');
    expect(output4).toHaveProperty('id');
    expect(output4.name).toBe('Nao Aparecer');

    const list = (await useCaseList.execute(undefined, userFake)).categories;
    expect(list.length).toBe(3);
    expect(list[0].name).toBe('Eletrônicos');
    expect(list[1].name).toBe('Vídeo');
    expect(list[2].name).toBe('Ferramentas');
  });

});
