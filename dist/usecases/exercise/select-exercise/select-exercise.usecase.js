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
exports.SelectExerciseUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class SelectExerciseUsecase {
    constructor(exerciseGateway) {
        this.exerciseGateway = exerciseGateway;
    }
    static create(exerciseGateway) {
        return new SelectExerciseUsecase(exerciseGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req;
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { id, user_id: userIdCondition };
            const aExercise = yield this.exerciseGateway.select(input);
            if (aExercise === null)
                throw new Error('Nada encontrado.');
            const output = this.presentOutput(aExercise);
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
            exercise: {
                id: exercise.id,
                name: exercise.name,
                user_id: exercise.user_id,
                categories: categories
            }
        };
        return output;
    }
    ;
}
exports.SelectExerciseUsecase = SelectExerciseUsecase;
;
