"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkoutExercise = createWorkoutExercise;
const vitest_1 = require("vitest");
const zod_1 = require("zod");
const workout_exercise_1 = require("./workout-exercise");
const exercise_spec_1 = require("../../exercise/entities/exercise.spec");
const workout_day_spec_1 = require("../../workout-day/entities/workout-day.spec");
function createWorkoutExercise() {
    const setsRandom = Math.floor(Math.random() * 3) + 1;
    const repsRandom = Math.floor(Math.random() * 15) + 1;
    const observation = 'teste';
    const exercise = (0, exercise_spec_1.createExercise)();
    const workoutDay = (0, workout_day_spec_1.createWorkoutDay)();
    const workoutExerciseData = {
        sets: setsRandom,
        reps: repsRandom,
        observation: observation,
        exercise_id: exercise.id,
        //workout_day_id: workoutDay.id
    };
    return workout_exercise_1.WorkoutExercise.create(workoutExerciseData);
}
;
(0, vitest_1.describe)("Workout Exercise (Treino de Exercicio) Entity Test ", () => {
    (0, vitest_1.it)("deve criar um Treino de Exercicio com dados válidos", () => {
        const setsRandom = Math.floor(Math.random() * 3) + 1;
        const repsRandom = Math.floor(Math.random() * 15) + 1;
        const observation = 'teste';
        const exercise = (0, exercise_spec_1.createExercise)();
        //const workoutDay = createWorkoutDay();
        const workoutExerciseData = {
            sets: setsRandom,
            reps: repsRandom,
            observation: observation,
            exercise_id: exercise.id,
            //workout_day_id: workoutDay.id
        };
        const workoutExercise = workout_exercise_1.WorkoutExercise.create(workoutExerciseData);
        (0, vitest_1.expect)(workoutExercise.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutExercise.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(workoutExercise).toBeInstanceOf(workout_exercise_1.WorkoutExercise);
        (0, vitest_1.expect)(workoutExercise.sets).toBe(setsRandom);
        (0, vitest_1.expect)(workoutExercise.reps).toBe(repsRandom);
        (0, vitest_1.expect)(workoutExercise.observation).toBe(observation);
        (0, vitest_1.expect)(workoutExercise.exercise_id).toBe(exercise.id);
        //expect(workoutExercise.workout_day_id).toBe(workoutDay.id);
    });
});
