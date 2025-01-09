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
exports.CreateExerciseUsecase = void 0;
const exercise_1 = require("../../../domain/exercise/entities/exercise");
const user_1 = require("../../../domain/user/entities/user");
const category_1 = require("../../../domain/category/entities/category");
class CreateExerciseUsecase {
    constructor(categoryGateway, exerciseGateway) {
        this.categoryGateway = categoryGateway;
        this.exerciseGateway = exerciseGateway;
    }
    static create(categoryGateway, exerciseGateway) {
        return new CreateExerciseUsecase(categoryGateway, exerciseGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: exerciseName, categories } = req;
            let aCategories = [];
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const testExerciseExistsByName = yield this.exerciseGateway.existsByName({ name: exerciseName, user_id: userIdCondition });
            if (testExerciseExistsByName === true)
                throw new Error('Já existe um Exercício com este nome. Por favor, tente outro nome!');
            if (categories && Array.isArray(categories) && categories.length > 0) {
                for (const t of categories) {
                    const category = yield this.categoryGateway.findById({ id: t.id });
                    aCategories.push(category_1.Category.with({
                        id: t.id,
                        name: t.name,
                        user_id: t.user_id
                    }));
                    if (category === false)
                        throw new Error('A Categoria selecionada não é válida. Por favor, tente escolher outra!');
                }
                ;
            }
            ;
            const aExercise = exercise_1.Exercise.create({ name: exerciseName, user_id: userIdCondition, categories: aCategories });
            const result = yield this.exerciseGateway.insert(aExercise, aCategories);
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(exercise) {
        const output = {
            id: exercise.id,
            name: exercise.name,
            user_id: exercise.user_id,
            categories: exercise.categories
        };
        return output;
    }
}
exports.CreateExerciseUsecase = CreateExerciseUsecase;
;
