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
exports.ListWorkoutPlanUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
class ListWorkoutPlanUsecase {
    constructor(workoutPlanGateway) {
        this.workoutPlanGateway = workoutPlanGateway;
    }
    static create(workoutPlanGateway) {
        return new ListWorkoutPlanUsecase(workoutPlanGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            const input = { user_id: userIdCondition };
            const result = yield this.workoutPlanGateway.list(input);
            const output = this.presentOutput(result);
            return output;
        });
    }
    ;
    presentOutput(workoutPlan) {
        let output = [];
        for (const workout of workoutPlan) {
            let wDays = [];
            let wExercises = [];
            for (const t of workout.workoutDays) {
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
            const workoutPlan = { id: workout.id, name: workout.name, user_id: workout.user_id, workoutDays: wDays };
            output.push(workoutPlan);
        }
        ;
        return { workoutPlans: output };
    }
    ;
}
exports.ListWorkoutPlanUsecase = ListWorkoutPlanUsecase;
;
