import { faker } from "@faker-js/faker";
import { Category } from "../domain/category/entities/category";
import { UserInputDto } from "../middleware/keycloakAuth.middleware";

export const createMockUser = (role: 'ADMIN' | 'USER'): UserInputDto => {
    const name = faker.person.firstName('female');
    const userFake: UserInputDto = {
        id: crypto.randomUUID(),
        name: name,
        role: role
    };
    return userFake;
};

export const createMockCategory = (role: 'ADMIN' | 'USER'): Category => {
    const name = faker.commerce.department();
    const user_id = role === 'USER' ? crypto.randomUUID() : null;
    return Category.create({
        name,
        user_id,
    });
};