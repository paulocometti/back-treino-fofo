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
exports.WorkoutPlanRepositoryPrisma = void 0;
const workout_plan_1 = require("../../../domain/workout-plan/entities/workout-plan");
const workout_exercise_1 = require("../../../domain/workout-exercise/entities/workout-exercise");
const workout_day_1 = require("../../../domain/workout-day/entities/workout-day");
class WorkoutPlanRepositoryPrisma {
    constructor(prismaClient) {
        this.prismaClient = prismaClient;
    }
    static create(prismaClient) {
        return new WorkoutPlanRepositoryPrisma(prismaClient);
    }
    ;
    insert(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: workoutPlanId, name: workoutPlanName, user_id, workoutDays } = input;
            const dataWorkout = { id: workoutPlanId, name: workoutPlanName, user_id };
            const workoutPlan = yield this.prismaClient.workoutPlan.create({ data: dataWorkout });
            for (const t of workoutDays) {
                const { id: workoutDayId, name: workoutDayName, workoutExercises } = t;
                const workoutDay = yield this.prismaClient.workoutDay.create({
                    data: {
                        id: workoutDayId,
                        name: workoutDayName,
                        workoutPlan: { connect: { id: workoutPlan.id } }
                    }
                });
                for (const th of workoutExercises) {
                    const { id: workoutExercideId, sets, reps, observation, exercise_id } = th;
                    yield this.prismaClient.workoutExercise.create({
                        data: {
                            id: workoutExercideId,
                            sets,
                            reps,
                            observation,
                            exercise: { connect: { id: exercise_id } },
                            workoutDay: { connect: { id: workoutDay.id } }
                        }
                    });
                }
                ;
            }
            ;
            const result = yield this.prismaClient.workoutPlan.findUnique({
                where: { id: workoutPlan.id },
                include: {
                    workoutDay: {
                        include: {
                            workoutExercise: {
                                include: {
                                    exercise: {
                                        include: {
                                            categoryExercise: {
                                                include: {
                                                    category: {
                                                        select: { name: true }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (result === null)
                return null;
            let resultWorkoutDays = [];
            let resultWorkoutExercises = [];
            let resultCategoriesOfWorkoutExercises = [];
            for (const t of result.workoutDay) {
                for (const th of t.workoutExercise) {
                    for (const tha of th.exercise.categoryExercise) {
                        resultCategoriesOfWorkoutExercises.push(tha.category.name);
                    }
                    ;
                    const wExercise = workout_exercise_1.WorkoutExercise.with({
                        id: th.id,
                        sets: th.sets,
                        reps: th.reps,
                        observation: th.observation,
                        exercise_id: th.exercise_id,
                        exercise: {
                            name: th.exercise.name,
                            categories: resultCategoriesOfWorkoutExercises
                        }
                    });
                    resultWorkoutExercises.push(wExercise);
                }
                ;
                const wDay = workout_day_1.WorkoutDay.with({
                    id: t.id,
                    name: t.name,
                    workoutExercises: resultWorkoutExercises
                });
                resultWorkoutDays.push(wDay);
            }
            ;
            const output = workout_plan_1.WorkoutPlan.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id,
                workoutDays: resultWorkoutDays
            });
            return output;
        });
    }
    ;
    select(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: workoutPlanId, user_id: userId } = input;
            const whereUserId = (userId) ? { user_id: userId } : {};
            const result = yield this.prismaClient.workoutPlan.findUnique({
                where: Object.assign({ id: workoutPlanId }, whereUserId),
                include: {
                    workoutDay: {
                        include: {
                            workoutExercise: {
                                include: {
                                    exercise: {
                                        include: {
                                            categoryExercise: {
                                                include: {
                                                    category: {
                                                        select: { name: true }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            if (result === null)
                return null;
            let resultWorkoutDays = [];
            let resultWorkoutExercises = [];
            let resultCategoriesOfWorkoutExercises = [];
            for (const t of result.workoutDay) {
                for (const th of t.workoutExercise) {
                    for (const tha of th.exercise.categoryExercise) {
                        resultCategoriesOfWorkoutExercises.push(tha.category.name);
                    }
                    ;
                    const wExercise = workout_exercise_1.WorkoutExercise.with({
                        id: th.id,
                        sets: th.sets,
                        reps: th.reps,
                        observation: th.observation,
                        exercise_id: th.exercise_id,
                        exercise: {
                            name: th.exercise.name,
                            categories: resultCategoriesOfWorkoutExercises
                        }
                    });
                    resultWorkoutExercises.push(wExercise);
                }
                ;
                const wDay = workout_day_1.WorkoutDay.with({
                    id: t.id,
                    name: t.name,
                    workoutExercises: resultWorkoutExercises
                });
                resultWorkoutDays.push(wDay);
            }
            ;
            const output = workout_plan_1.WorkoutPlan.with({
                id: result.id,
                name: result.name,
                user_id: result.user_id,
                workoutDays: resultWorkoutDays
            });
            return output;
        });
    }
    ;
    list(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id: userId } = input;
            const whereUserId = (userId) ? { OR: [{ user_id: userId }, { user_id: null }] } : { user_id: null };
            const result = yield this.prismaClient.workoutPlan.findMany({
                where: whereUserId,
                include: {
                    workoutDay: {
                        include: {
                            workoutExercise: {
                                include: {
                                    exercise: {
                                        include: {
                                            categoryExercise: {
                                                include: {
                                                    category: {
                                                        select: { name: true }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            let output = [];
            for (const workout of result) {
                let resultWorkoutDays = [];
                let resultWorkoutExercises = [];
                let resultCategoriesOfWorkoutExercises = [];
                for (const t of workout.workoutDay) {
                    for (const th of t.workoutExercise) {
                        for (const tha of th.exercise.categoryExercise) {
                            resultCategoriesOfWorkoutExercises.push(tha.category.name);
                        }
                        ;
                        const wExercise = workout_exercise_1.WorkoutExercise.with({
                            id: th.id,
                            sets: th.sets,
                            reps: th.reps,
                            observation: th.observation,
                            exercise_id: th.exercise_id,
                            exercise: {
                                name: th.exercise.name,
                                categories: resultCategoriesOfWorkoutExercises
                            }
                        });
                        resultWorkoutExercises.push(wExercise);
                    }
                    ;
                    const wDay = workout_day_1.WorkoutDay.with({
                        id: t.id,
                        name: t.name,
                        workoutExercises: resultWorkoutExercises
                    });
                    resultWorkoutDays.push(wDay);
                }
                ;
                const workoutPlan = workout_plan_1.WorkoutPlan.with({
                    id: workout.id,
                    name: workout.name,
                    user_id: workout.user_id,
                    workoutDays: resultWorkoutDays
                });
                output.push(workoutPlan);
            }
            ;
            return output;
        });
    }
    ;
}
exports.WorkoutPlanRepositoryPrisma = WorkoutPlanRepositoryPrisma;
;
