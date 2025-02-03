"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockCategory = exports.createMockUser = void 0;
const faker_1 = require("@faker-js/faker");
const category_1 = require("../domain/category/entities/category");
const createMockUser = (role) => {
    const name = faker_1.faker.person.firstName('female');
    const userFake = {
        id: crypto.randomUUID(),
        name: name,
        role: role
    };
    return userFake;
};
exports.createMockUser = createMockUser;
const createMockCategory = (role) => {
    const name = faker_1.faker.commerce.department();
    const user_id = role === 'USER' ? crypto.randomUUID() : null;
    return category_1.Category.create({
        name,
        user_id,
    });
};
exports.createMockCategory = createMockCategory;
