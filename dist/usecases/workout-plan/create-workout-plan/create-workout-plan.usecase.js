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
exports.CreateWorkoutPlanUsecase = void 0;
const user_1 = require("../../../domain/user/entities/user");
const workout_day_1 = require("../../../domain/workout-day/entities/workout-day");
const workout_exercise_1 = require("../../../domain/workout-exercise/entities/workout-exercise");
const workout_plan_1 = require("../../../domain/workout-plan/entities/workout-plan");
class CreateWorkoutPlanUsecase {
    constructor(workoutPlanGateway) {
        this.workoutPlanGateway = workoutPlanGateway;
    }
    static create(workoutPlanGateway) {
        return new CreateWorkoutPlanUsecase(workoutPlanGateway);
    }
    ;
    execute(req, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name: workoutPlanName, workoutDays } = req;
            const { id: userId, role: userRole } = user_1.User.with(user);
            const userIdCondition = userRole === 'ADMIN' ? null : userId;
            let aWorkoutDays = [];
            let aWorkoutExercises = [];
            for (const t of workoutDays) {
                for (const th of t.workoutExercise) {
                    //usar gateway do exercise para criar o objeto dele
                    const aWorkoutExercise = workout_exercise_1.WorkoutExercise.create({
                        sets: th.sets,
                        reps: th.reps,
                        observation: th.observation,
                        exercise_id: th.exercise_id
                    });
                    aWorkoutExercises.push(aWorkoutExercise);
                }
                ;
                const aWorkoutDay = workout_day_1.WorkoutDay.create({ name: t.name, workoutExercises: aWorkoutExercises });
                aWorkoutDays.push(aWorkoutDay);
            }
            ;
            const aWorkoutPlan = workout_plan_1.WorkoutPlan.create({ name: workoutPlanName, user_id: userIdCondition, workoutDays: aWorkoutDays });
            // >> 
            // testar se os exerciseId escolhidos sao valido
            // tambem testar se ambos sao null (oficiais) ou do mesmo dono
            // caso ok prosseguir com o cadastro, caso nao informar erro ao controller.
            // fazer depois
            const result = yield this.workoutPlanGateway.insert(aWorkoutPlan);
            if (result === null)
                throw new Error();
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
exports.CreateWorkoutPlanUsecase = CreateWorkoutPlanUsecase;
;
