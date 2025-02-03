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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepositoryInMemory = void 0;
const category_1 = require("../../../domain/category/entities/category");
class CategoryRepositoryInMemory {
    constructor() {
        this.categories = [];
    }
    static create() {
        return new CategoryRepositoryInMemory();
    }
    ;
    existsByName(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            for (const category of this.categories) {
                if (category.name !== name)
                    continue;
                if (id && category.id === id)
                    continue;
                if (user_id) {
                    if (category.user_id !== null && category.user_id !== user_id)
                        continue;
                }
                ;
                return true;
            }
            ;
            return false;
        });
    }
    ;
    findById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = input;
            for (const category of this.categories) {
                if (category.id === id)
                    return true;
            }
            ;
            return false;
        });
    }
    ;
    findByIdAndUserId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            for (const category of this.categories) {
                if (category.id === id && category.user_id === user_id)
                    return true;
            }
            ;
            return false;
        });
    }
    ;
    insert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            this.categories.push(input);
            const output = category_1.Category.with({
                id: this.categories[this.categories.length - 1].id,
                name: this.categories[this.categories.length - 1].name,
                user_id: this.categories[this.categories.length - 1].user_id
            });
            return output;
        });
    }
    ;
    update(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            const index = this.categories.findIndex((category) => category.id === id && category.user_id === user_id);
            const output = category_1.Category.with({
                id: this.categories[index].id,
                name,
                user_id: this.categories[index].user_id,
            });
            this.categories[index] = output;
            return output;
        });
    }
    ;
    select(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            const category = this.categories.find(t => {
                if (t.id !== id)
                    return false;
                if (user_id) {
                    if (t.user_id !== null && t.user_id !== user_id)
                        return false;
                }
                else {
                    if (t.user_id !== null)
                        return false;
                }
                ;
                return true;
            });
            if (!category)
                return null;
            const output = category_1.Category.with({
                id: category.id,
                name: category.name,
                user_id: category.user_id
            });
            return output;
        });
    }
    ;
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let { user_id } = input;
            const categoriesWithUserIdNull = this.categories.filter(t => t.user_id === null);
            let categoriesWithUserIdSameEqualsUser = [];
            if (user_id)
                categoriesWithUserIdSameEqualsUser = this.categories.filter(t => t.user_id === user_id);
            const resultCategories = categoriesWithUserIdNull.concat(categoriesWithUserIdSameEqualsUser);
            let output = [];
            for (const t of resultCategories) {
                const category = category_1.Category.with({
                    id: t.id,
                    name: t.name,
                    user_id: t.user_id
                });
                output.push(category);
            }
            ;
            return output;
        });
    }
    ;
}
exports.CategoryRepositoryInMemory = CategoryRepositoryInMemory;
;
