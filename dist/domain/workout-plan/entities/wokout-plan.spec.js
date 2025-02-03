"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkoutPlan = createWorkoutPlan;
const vitest_1 = require("vitest");
const faker_1 = require("@faker-js/faker");
const zod_1 = require("zod");
const workout_plan_1 = require("./workout-plan");
function createWorkoutPlan() {
    const workoutPlanName = faker_1.faker.person.firstName('female');
    const workoutPlanUserIdAdmin = null;
    const data = {
        name: workoutPlanName,
        user_id: workoutPlanUserIdAdmin,
        workoutDays: []
    };
    return workout_plan_1.WorkoutPlan.create(data);
}
;
(0, vitest_1.describe)("WorkoutPlan Entity Test ", () => {
    (0, vitest_1.it)("deve criar uma Workout Plan (Treino de Academia) com nome e id válidos para um Usuario com role Admin", () => {
        const workoutPlanName = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdAdmin = null;
        const data = {
            name: workoutPlanName,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        const workoutPlan = workout_plan_1.WorkoutPlan.create(data);
        (0, vitest_1.expect)(workoutPlan.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutPlan.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(workoutPlan).toBeInstanceOf(workout_plan_1.WorkoutPlan);
        (0, vitest_1.expect)(workoutPlan.name).toBe(workoutPlanName);
        (0, vitest_1.expect)(workoutPlan.user_id).toBe(workoutPlanUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar uma Workout Plan (Treino de Academia) com nome e id válidos para um Usuario com role User", () => {
        const workoutPlanName = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdUser = crypto.randomUUID();
        const data = {
            name: workoutPlanName,
            user_id: workoutPlanUserIdUser,
            workoutDays: []
        };
        const workoutPlan = workout_plan_1.WorkoutPlan.create(data);
        (0, vitest_1.expect)(workoutPlan.id).toBeDefined();
        const uuidSchema = zod_1.z.string().uuid();
        const idValidation = uuidSchema.safeParse(workoutPlan.id);
        (0, vitest_1.expect)(idValidation.success).toBe(true);
        (0, vitest_1.expect)(workoutPlan).toBeInstanceOf(workout_plan_1.WorkoutPlan);
        (0, vitest_1.expect)(workoutPlan.name).toBe(workoutPlanName);
        (0, vitest_1.expect)(workoutPlan.user_id).toBe(workoutPlanUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com nome inválido", () => {
        const name = "";
        const workoutPlanUserIdAdmin = null;
        const data = {
            name,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        (0, vitest_1.expect)(() => {
            workout_plan_1.WorkoutPlan.create(data);
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com nome muito longo", () => {
        const longName = "a".repeat(31);
        const workoutPlanUserIdAdmin = null;
        const data = {
            name: longName,
            user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        };
        (0, vitest_1.expect)(() => {
            workout_plan_1.WorkoutPlan.create(data);
        }).toThrowError("Digite um Nome abaixo de 30 caracteres!");
    });
    (0, vitest_1.it)("deve criar uma Workout Plan (Treino de Academia) usando o método 'with' com props válidas e user_id de Usuário com role Admin", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdAdmin = null;
        const workoutPlan = workout_plan_1.WorkoutPlan.with({
            id, name, user_id: workoutPlanUserIdAdmin,
            workoutDays: []
        });
        (0, vitest_1.expect)(workoutPlan).toBeInstanceOf(workout_plan_1.WorkoutPlan);
        (0, vitest_1.expect)(workoutPlan.id).toBe(id);
        (0, vitest_1.expect)(workoutPlan.name).toBe(name);
        (0, vitest_1.expect)(workoutPlan.user_id).toBe(workoutPlanUserIdAdmin);
    });
    (0, vitest_1.it)("deve criar uma Workout Plan (Treino de Academia) usando o método 'with' com props válidas e user_id de Usuário com role User", () => {
        const id = faker_1.faker.string.uuid();
        const name = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdUser = crypto.randomUUID();
        const workoutPlan = workout_plan_1.WorkoutPlan.with({
            id, name, user_id: workoutPlanUserIdUser,
            workoutDays: []
        });
        (0, vitest_1.expect)(workoutPlan).toBeInstanceOf(workout_plan_1.WorkoutPlan);
        (0, vitest_1.expect)(workoutPlan.id).toBe(id);
        (0, vitest_1.expect)(workoutPlan.name).toBe(name);
        (0, vitest_1.expect)(workoutPlan.user_id).toBe(workoutPlanUserIdUser);
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'id' inválido", () => {
        const id = "1";
        const workoutPlanName = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdAdmin = null;
        (0, vitest_1.expect)(() => {
            workout_plan_1.WorkoutPlan.with({
                id, name: workoutPlanName, user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Id inválido, não é um UUID.");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'nome' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const workoutPlanUserIdAdmin = null;
        (0, vitest_1.expect)(() => {
            workout_plan_1.WorkoutPlan.with({
                id, name: "", user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Digite um Nome corretamente!");
    });
    (0, vitest_1.it)("deve lançar um erro ao criar uma Workout Plan (Treino de Academia) com props 'user_id' inválido", () => {
        const id = faker_1.faker.string.uuid();
        const workoutPlanName = faker_1.faker.person.firstName('female');
        const workoutPlanUserIdAdmin = "1";
        (0, vitest_1.expect)(() => {
            workout_plan_1.WorkoutPlan.with({
                id, name: workoutPlanName, user_id: workoutPlanUserIdAdmin,
                workoutDays: []
            });
        }).toThrowError("Selecione um Usuário válido!");
    });
});
