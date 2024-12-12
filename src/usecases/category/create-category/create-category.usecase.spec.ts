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
  it('deve criar uma categoria com sucesso', async () => {
    const input: CreateCategoryInputDto = { name: 'Eletrônicos' };
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'ADMIN'
    };
    const output = await useCase.execute(input, userFake);

    expect(output).toHaveProperty('id');
    expect(output.name).toBe('Eletrônicos');

    const userId = userFake.role === 'ADMIN' ? null : userFake.id;
    const categories = await categoryRepository.list(userId);
    expect(categories.length).toBe(1);
    expect(categories[0].name).toBe('Eletrônicos');
  });

  it('deve armazenar múltiplas categorias corretamente', async () => {
    const inputs: CreateCategoryInputDto[] = [
      { name: 'Livros' },
      { name: 'Vestuário' },
    ];
    const userFake: CreateCategoryUserDto = {
      id: crypto.randomUUID(),
      name: 'Paulo',
      role: 'ADMIN'
    };

    for (const input of inputs) {
      await useCase.execute(input, userFake);
    }

    const categories = await categoryRepository.list(userFake.id);
    expect(categories.length).toBe(2);
    expect(categories.map(c => c.name)).toEqual(['Livros', 'Vestuário']);
  });

  // Exemplo com tratamento de erros
  /*it('não deve permitir nomes de categoria duplicados', async () => {
    const input = { name: 'Eletrônicos' };
    await useCase.execute(input);

    const input2 = { name: 'Eletrônicos' };
    await useCase.execute(input2);

    await expect(useCase.execute(input2)).rejects.toThrow('Categoria com este nome já existe');

    const categories = await categoryRepository.list();
    expect(categories.length).toBe(1);
  });*/
});
