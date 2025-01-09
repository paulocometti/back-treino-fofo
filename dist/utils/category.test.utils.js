"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryWithAdmin = createCategoryWithAdmin;
const crypto_1 = __importDefault(require("crypto"));
const create_category_usecase_1 = require("../usecases/category/create-category/create-category.usecase");
const faker_1 = require("@faker-js/faker");
function createCategoryWithAdmin(categoryRepository) {
    return __awaiter(this, void 0, void 0, function* () {
        const createCategoryUseCase = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
        const userAdminFake = {
            id: crypto_1.default.randomUUID(),
            name: 'Paulo Admin - Test',
            role: 'ADMIN',
        };
        const categoryName = faker_1.faker.person.firstName('female');
        const input = { name: categoryName, };
        const output = yield createCategoryUseCase.execute(input, userAdminFake);
        return output;
    });
}
;
