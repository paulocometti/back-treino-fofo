"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkoutDay = createWorkoutDay;
const vitest_1 = require("vitest");
const faker_1 = require("@faker-js/faker");
const zod_1 = require("zod");
const workout_day_1 = require("./workout-day");
const wokout_plan_spec_1 = require("../../workout-plan/entities/wokout-plan.spec");
function createWorkoutDay() {
    const workoutDayName = faker_1.faker.person.firstName('female');
    const workoutPlan = (0, wokout_plan_spec_1.createWorkoutPlan)();
    const workoutDayData = {
        name: workoutDayName,
        //workout_plan_id: workoutPlan.id,
        workoutExercises: []
    };
    return workout_day_1.WorkoutDay.create(workoutDayData);
}
;
(0, vitest_1.describe)("Workout Day (Dia de Treino) Entity Test ", () => {
    (0, vitest_1.it)("deve criar um Dia de Treino com dados válidos", () => {
        const workoutDayName = faker_1.faker.person.firstName('female');
        const workoutPlan = (0, wokout_plan_spec_1.createWorkoutPlan)();
        const workoutDayData = {
            name: workoutDayName,
            //workout_plan_id: workoutPlan.id,
            workoutExercises: []
        };
        const workoutDay = workout_day_1.WorkoutDay.create(workoutDayData);
        (0, vitest_1.expect)(workoutDay.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutDay.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(workoutDay).toBeInstanceOf(workout_day_1.WorkoutDay);
        (0, vitest_1.expect)(workoutDay.name).toBe(workoutDayName);
        //expect(workoutDay.workout_plan_id).toBe(workoutPlan.id);
    });
});
