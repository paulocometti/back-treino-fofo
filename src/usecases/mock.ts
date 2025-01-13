import { faker } from "@faker-js/faker";
import { Category } from "../domain/category/entities/category";
import { CreateExerciseUserInputDto } from "./exercise/create-exercise/create-exercise.usecase";

export const createMockUser = (role: 'ADMIN' | 'USER'): CreateExerciseUserInputDto => {
    const name = faker.person.firstName('female');
    const userFake: CreateExerciseUserInputDto = {
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