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
exports.EditExerciseUsecase = void 0;
const exercise_1 = require("../../../domain/exercise/entities/exercise");
const user_1 = require("../../../domain/user/entities/user");
const category_1 = require("../../../domain/category/entities/category");
class EditExerciseUsecase {
    constructor(categoryGateway, exerciseGateway) {
        this.categoryGateway = categoryGateway;
        this.exerciseGateway = exerciseGateway;
    }
    static create(categoryGateway, exerciseGateway) {
        return new EditExerciseUsecase(categoryGateway, exerciseGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: exerciseId, name: exerciseName, categories } = req;
            let aCategories = [];
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const found = yield this.exerciseGateway.findByIdAndUserId({ id: exerciseId, user_id: userIdCondition });
            if (found === false)
                throw new Error('O Exercício que você está tentando editar não existe!');
            const testExerciseExistsByName = yield this.exerciseGateway.existsByName({ name: exerciseName, user_id: userIdCondition });
            if (testExerciseExistsByName === true)
                throw new Error('Já existe um Exercício com este nome. Por favor, tente outro nome!');
            if (categories && Array.isArray(categories) && categories.length > 0) {
                for (const t of categories) {
                    const category = yield this.categoryGateway.select(t);
                    if (category === null)
                        throw new Error('A Categoria selecionada não é válida. Por favor, tente escolher outra!');
                    const categoryNotOfficial = category.user_id !== null;
                    if (categoryNotOfficial && category.user_id !== user.id)
                        throw new Error('A Categoria existe porém não pode ser selecionada pois não é válida. Por favor, tente escolher outra!');
                    aCategories.push(category_1.Category.with({
                        id: category.id,
                        name: category.name,
                        user_id: category.user_id
                    }));
                }
                ;
            }
            ;
            const aExercise = exercise_1.Exercise.with({ id: exerciseId, name: exerciseName, user_id: userIdCondition, categories: aCategories });
            const result = yield this.exerciseGateway.update(aExercise);
            if (result === null)
                throw new Error();
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(exercise) {
        let categories = [];
        for (const t of exercise.categories) {
            categories.push({
                id: t.id,
                name: t.name,
                user_id: t.user_id
            });
        }
        ;
        const output = {
            id: exercise.id,
            name: exercise.name,
            user_id: exercise.user_id,
            categories: categories
        };
        return { exercise: output };
    }
}
exports.EditExerciseUsecase = EditExerciseUsecase;
;
