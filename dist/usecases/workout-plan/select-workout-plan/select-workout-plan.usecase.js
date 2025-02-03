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
exports.SelectWorkoutPlanUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class SelectWorkoutPlanUsecase {
    constructor(workoutPlanGateway) {
        this.workoutPlanGateway = workoutPlanGateway;
    }
    static create(workoutPlanGateway) {
        return new SelectWorkoutPlanUsecase(workoutPlanGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req;
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { id, user_id: userIdCondition };
            const result = yield this.workoutPlanGateway.select(input);
            if (result === null)
                throw new Error('Nada encontrado.');
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(workoutPlan) {
        let wDays = [];
        let wExercises = [];
        for (const t of workoutPlan.workoutDays) {
            for (const th of t.workoutExercises) {
                wExercises.push({
                    sets: th.sets,
                    reps: th.reps,
                    observation: th.observation,
                    exercise_id: th.exercise_id,
                    exercise: th.exercise
                });
            }
            ;
            wDays.push({ name: t.name, workoutExercises: wExercises });
        }
        ;
        const output = { id: workoutPlan.id, name: workoutPlan.name, user_id: workoutPlan.user_id, workoutDays: wDays };
        return { workoutPlan: output };
    }
    ;
}
exports.SelectWorkoutPlanUsecase = SelectWorkoutPlanUsecase;
;
