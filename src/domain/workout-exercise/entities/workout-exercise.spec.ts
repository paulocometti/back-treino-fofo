import { describe, it, expect } from "vitest";
import { z } from "zod";
import { WorkoutExercise, WorkoutExerciseEntityCreateProps } from "./workout-exercise";
import { createExercise } from "../../exercise/entities/exercise.spec";
import { createWorkoutDay } from "../../workout-day/entities/workout-day.spec";

export function createWorkoutExercise(){
    const setsRandom: number = Math.floor(Math.random() * 3) + 1;
    const repsRandom: number = Math.floor(Math.random() * 15) + 1;
    const observation: string = 'teste';
    const exercise = createExercise();
    const workoutDay = createWorkoutDay();
    
    const workoutExerciseData: WorkoutExerciseEntityCreateProps = {
        sets: setsRandom,
        reps: repsRandom,
        observation: observation,

        exercise_id: exercise.id,
        //workout_day_id: workoutDay.id
    };
    return WorkoutExercise.create(workoutExerciseData);
};

describe("Workout Exercise (Treino de Exercicio) Entity Test ", () => {
    it("deve criar um Treino de Exercicio com dados válidos", () => {
        const setsRandom: number = Math.floor(Math.random() * 3) + 1;
        const repsRandom: number = Math.floor(Math.random() * 15) + 1;
        const observation: string = 'teste';
        const exercise = createExercise();
        //const workoutDay = createWorkoutDay();
        
        const workoutExerciseData: WorkoutExerciseEntityCreateProps = {
            sets: setsRandom,
            reps: repsRandom,
            observation: observation,

            exercise_id: exercise.id,
            //workout_day_id: workoutDay.id
        };
        const workoutExercise = WorkoutExercise.create(workoutExerciseData);

        expect(workoutExercise.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutExercise.id);
        expect(idValidation.success).toBe(true);
        expect(workoutExercise).toBeInstanceOf(WorkoutExercise);
        expect(workoutExercise.sets).toBe(setsRandom);
        expect(workoutExercise.reps).toBe(repsRandom);
        expect(workoutExercise.observation).toBe(observation);
        expect(workoutExercise.exercise_id).toBe(exercise.id);
        //expect(workoutExercise.workout_day_id).toBe(workoutDay.id);
    });
});
