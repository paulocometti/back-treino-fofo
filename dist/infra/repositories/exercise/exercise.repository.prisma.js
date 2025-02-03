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
exports.ExerciseRepositoryPrisma = void 0;
const exercise_1 = require("../../../domain/exercise/entities/exercise");
const category_1 = require("../../../domain/category/entities/category");
class ExerciseRepositoryPrisma {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    static create(prismaClient) {
        return new ExerciseRepositoryPrisma(prismaClient);
    }
    ;
    transformCategoryExerciseInCategory(categoryExercise) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultCategories = [];
            for (const t of categoryExercise) {
                const aCategory = category_1.Category.with(t.category);
                resultCategories.push(aCategory);
            }
            ;
            return resultCategories;
        });
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
            const result = yield this.prismaClient.exercise.findFirst({ where });
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
            const result = yield this.prismaClient.exercise.findUnique({ where });
            if (result === null)
                return false;
            return true;
        });
    }
    ;
    insert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id, categories } = input;
            const data = { id, name, user_id };
            const exercise = yield this.prismaClient.exercise.create({ data });
            for (const t of categories) {
                yield this.prismaClient.exerciseCategory.create({
                    data: {
                        exercise: { connect: { id: exercise.id } },
                        category: { connect: { id: t.id } }
                    }
                });
            }
            ;
            const result = yield this.prismaClient.exercise.findUnique({
                where: { id: exercise.id }, include: { categoryExercise: { include: { category: true } } }
            });
            if (result === null)
                return null;
            const resultCategories = yield this.transformCategoryExerciseInCategory(result.categoryExercise);
            const output = exercise_1.Exercise.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id,
                categories: resultCategories
            });
            return output;
        });
    }
    ;
    update(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, user_id, categories } = input;
            const data = { name };
            const where = { id, user_id };
            const exercise = yield this.prismaClient.exercise.update({ data, where });
            yield this.prismaClient.exerciseCategory.deleteMany({ where: { exercise_id: exercise.id } });
            for (const t of categories) {
                yield this.prismaClient.exerciseCategory.create({
                    data: {
                        exercise: { connect: { id: exercise.id } },
                        category: { connect: { id: t.id } }
                    }
                });
            }
            ;
            const result = yield this.prismaClient.exercise.findUnique({
                where: { id: exercise.id }, include: { categoryExercise: { include: { category: true } } }
            });
            if (result === null)
                return null;
            const resultCategories = yield this.transformCategoryExerciseInCategory(result.categoryExercise);
            const output = exercise_1.Exercise.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id,
                categories: resultCategories
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
            const result = yield this.prismaClient.exercise.findUnique({
                include: { categoryExercise: { include: { category: true } } },
                where
            });
            if (!result)
                return result;
            const resultCategories = yield this.transformCategoryExerciseInCategory(result.categoryExercise);
            const output = exercise_1.Exercise.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id,
                categories: resultCategories
            });
            return output;
        });
    }
    ;
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = input;
            const whereUserId = (user_id) ? { user_id } : {};
            const result = yield this.prismaClient.exercise.findMany({
                include: { categoryExercise: { include: { category: true } } },
                where: { OR: [{ user_id: null }, Object.assign({}, whereUserId)] }
            });
            let output = [];
            for (const t of result) {
                const resultCategories = yield this.transformCategoryExerciseInCategory(t.categoryExercise);
                const exercise = exercise_1.Exercise.with({
                    id: t.id,
                    name: t.name,
                    user_id: t.user_id,
                    categories: resultCategories
                });
                output.push(exercise);
            }
            ;
            return output;
        });
    }
    ;
}
exports.ExerciseRepositoryPrisma = ExerciseRepositoryPrisma;
;
