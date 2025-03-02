import { CategoryRepositoryInMemory } from '../infra/repositories/category/category.repository.in-memory';
import { CreateCategoryUsecaseInputDto, CreateCategoryUsecase } from '../usecases/category/create-category/create-category.usecase';
import { faker } from '@faker-js/faker';
import { UserInputDto } from '../middleware/keycloakAuth.middleware';
import crypto from 'crypto';

export async function createCategoryWithAdmin(categoryRepository: CategoryRepositoryInMemory) {
  const createCategoryUseCase = CreateCategoryUsecase.create(categoryRepository);

  const userAdminFake: UserInputDto = {
    id: crypto.randomUUID(),
    name: 'Paulo Admin - Test',
    role: 'ADMIN',
  };

  const categoryName: string = faker.person.firstName('female');
  const input: CreateCategoryUsecaseInputDto = { name: categoryName, };
  const output = await createCategoryUseCase.execute(input, userAdminFake);
  return output;
};
