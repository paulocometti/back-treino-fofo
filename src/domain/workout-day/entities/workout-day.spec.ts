import { describe, it, expect } from "vitest";
import { faker } from '@faker-js/faker';
import { z } from "zod";
import { WorkoutDay, WorkoutDayEntityCreateProps } from "./workout-day";
import { createWorkoutPlan } from "../../workout-plan/entities/wokout-plan.spec";

export function createWorkoutDay() {
    const workoutDayName: string = faker.person.firstName('female');
    const workoutPlan = createWorkoutPlan();

    const workoutDayData: WorkoutDayEntityCreateProps = {
        name: workoutDayName,
        //workout_plan_id: workoutPlan.id,
        workoutExercises: []
    };
    return WorkoutDay.create(workoutDayData);
};

describe("Workout Day (Dia de Treino) Entity Test ", () => {
    it("deve criar um Dia de Treino com dados válidos", () => {
        const workoutDayName: string = faker.person.firstName('female');
        const workoutPlan = createWorkoutPlan();

        const workoutDayData: WorkoutDayEntityCreateProps = {
            name: workoutDayName,
            //workout_plan_id: workoutPlan.id,
            workoutExercises: []
        };
        const workoutDay = WorkoutDay.create(workoutDayData);
        expect(workoutDay.id).toBeDefined();
        const uuidSchema = z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutDay.id);
        expect(idValidation.success).toBe(true);
        expect(workoutDay).toBeInstanceOf(WorkoutDay);
        expect(workoutDay.name).toBe(workoutDayName);
        //expect(workoutDay.workout_plan_id).toBe(workoutPlan.id);
    });

});
