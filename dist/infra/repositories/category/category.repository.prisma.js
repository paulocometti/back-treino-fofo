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
exports.CategoryRepositoryPrisma = void 0;
const category_1 = require("../../../domain/category/entities/category");
class CategoryRepositoryPrisma {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    static create(prismaClient) {
        return new CategoryRepositoryPrisma(prismaClient);
    }
    ;
    existsByName(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            const whereSameName = { name };
            const whereSameIdWhenUpdate = { not: id };
            const whereSameAdminOrUser = [{ user_id: null }, { user_id }];
            let where = whereSameName;
            if (id)
                where.id = whereSameIdWhenUpdate;
            if (user_id)
                where.OR = whereSameAdminOrUser;
            const result = yield this.prismaClient.category.findFirst({ where });
            if (result === null)
                return false;
            return true;
        });
    }
    ;
    findById(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = input;
            const where = { id };
            const result = yield this.prismaClient.category.findUnique({ where });
            if (result === null)
                return false;
            return true;
        });
    }
    ;
    findByIdAndUserId(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            const where = { id, user_id };
            const result = yield this.prismaClient.category.findUnique({ where });
            if (result === null)
                return false;
            return true;
        });
    }
    ;
    insert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            const data = { id, name, user_id };
            const result = yield this.prismaClient.category.create({ data });
            const output = category_1.Category.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id
            });
            return output;
        });
    }
    ;
    update(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id } = input;
            const data = { name };
            const where = { id, user_id };
            const result = yield this.prismaClient.category.update({ data, where });
            const output = category_1.Category.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id
            });
            return output;
        });
    }
    ;
    select(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, user_id } = input;
            let where = { id };
            const whereSameAdminOrUser = [{ user_id: null }, { user_id }];
            const whereSameOnlyAdmin = { user_id: null };
            if (user_id)
                where.OR = whereSameAdminOrUser;
            else
                where = Object.assign(Object.assign({}, where), whereSameOnlyAdmin);
            const result = yield this.prismaClient.category.findUnique({ where });
            if (!result)
                return result;
            const output = category_1.Category.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id
            });
            return output;
        });
    }
    ;
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = input;
            const whereUserId = (user_id) ? { user_id } : {};
            const result = yield this.prismaClient.category.findMany({
                where: { OR: [{ user_id: null }, Object.assign({}, whereUserId)] }
            });
            let output = [];
            for (const t of result) {
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
exports.CategoryRepositoryPrisma = CategoryRepositoryPrisma;
;
