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
exports.ListExerciseUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class ListExerciseUsecase {
    constructor(exerciseGateway) {
        this.exerciseGateway = exerciseGateway;
    }
    static create(exerciseGateway) {
        return new ListExerciseUsecase(exerciseGateway);
    }
    ;
    execute(_, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { user_id: userIdCondition };
            const aExercises = yield this.exerciseGateway.list(input);
            const output = this.presentOutput(aExercises);
            return output;
        });
    }
    ;
    presentOutput(exercises) {
        let output = [];
        for (const t of exercises) {
            let categories = [];
            for (const th of t.categories) {
                categories.push({
                    id: th.id,
                    name: th.name,
                    user_id: th.user_id
                });
            }
            ;
            const exercise = {
                id: t.id,
                name: t.name,
                user_id: t.user_id,
                categories: categories
            };
            output.push(exercise);
        }
        ;
        return { exercises: output };
    }
    ;
}
exports.ListExerciseUsecase = ListExerciseUsecase;
;
