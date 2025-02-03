"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_express_1 = require("./infra/api/express/api.express");
const create_category_express_route_1 = require("./infra/api/express/routes/category/create-category.express.route");
const edit_category_express_route_1 = require("./infra/api/express/routes/category/edit-category.express.route");
const list_category_express_route_1 = require("./infra/api/express/routes/category/list-category.express.route");
const select_category_express_route_1 = require("./infra/api/express/routes/category/select-category.express.route");
const create_exercise_express_route_1 = require("./infra/api/express/routes/exercise/create-exercise.express.route");
const edit_exercise_express_route_1 = require("./infra/api/express/routes/exercise/edit-exercise.express.route");
const list_exercise_express_route_1 = require("./infra/api/express/routes/exercise/list-exercise.express.route");
const select_exercise_express_route_1 = require("./infra/api/express/routes/exercise/select-exercise.express.route");
const login_keycloak_express_route_1 = require("./infra/api/express/routes/keycloak/login-keycloak.express.route");
const create_workout_plan_express_route_1 = require("./infra/api/express/routes/workout-plan/create-workout-plan.express.route");
const list_workout_plan_express_route_1 = require("./infra/api/express/routes/workout-plan/list-workout-plan.express.route");
const select_workout_plan_express_route_1 = require("./infra/api/express/routes/workout-plan/select-workout-plan.express.route");
const category_repository_prisma_1 = require("./infra/repositories/category/category.repository.prisma");
const exercise_repository_prisma_1 = require("./infra/repositories/exercise/exercise.repository.prisma");
const keycloak_repository_1 = require("./infra/repositories/keycloak/keycloak.repository");
const workout_plan_repository_prisma_1 = require("./infra/repositories/workout-plan/workout-plan.repository.prisma");
const keycloakAuth_middleware_1 = require("./middleware/keycloakAuth.middleware");
const prisma_1 = require("./package/prisma/prisma");
const create_category_usecase_1 = require("./usecases/category/create-category/create-category.usecase");
const edit_category_usecase_1 = require("./usecases/category/edit-category/edit-category.usecase");
const list_category_usecase_1 = require("./usecases/category/list-category/list-category.usecase");
const select_category_usecase_1 = require("./usecases/category/select-category/select-category.usecase");
const create_exercise_usecase_1 = require("./usecases/exercise/create-exercise/create-exercise.usecase");
const edit_exercise_usecase_1 = require("./usecases/exercise/edit-exercise/edit-exercise.usecase");
const list_exercise_usecase_1 = require("./usecases/exercise/list-exercise/list-exercise.usecase");
const select_exercise_usecase_1 = require("./usecases/exercise/select-exercise/select-exercise.usecase");
const login_keycloak_usecase_1 = require("./usecases/keycloak/login-keycloak/login-keycloak.usecase");
const create_workout_plan_usecase_1 = require("./usecases/workout-plan/create-workout-plan/create-workout-plan.usecase");
const list_workout_plan_usecase_1 = require("./usecases/workout-plan/list-workout-plan/list-workout-plan.usecase");
const select_workout_plan_usecase_1 = require("./usecases/workout-plan/select-workout-plan/select-workout-plan.usecase");
function main() {
    //category
    const categoryRepository = category_repository_prisma_1.CategoryRepositoryPrisma.create(prisma_1.prisma);
    const createCategoryUseCase = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    const editCategoryUseCase = edit_category_usecase_1.EditCategoryUsecase.create(categoryRepository);
    const listCategoryUsecase = list_category_usecase_1.ListCategoryUsecase.create(categoryRepository);
    const getCategoryUsecase = select_category_usecase_1.SelectCategoryUsecase.create(categoryRepository);
    const createCategoryRoute = create_category_express_route_1.CreateCategoryRoute.create(createCategoryUseCase);
    const editCategoryRoute = edit_category_express_route_1.EditCategoryRoute.create(editCategoryUseCase);
    const listCategoryRoute = list_category_express_route_1.ListCategoryRoute.create(listCategoryUsecase);
    const getCategoryRoute = select_category_express_route_1.SelectCategoryRoute.create(getCategoryUsecase);
    //exercise
    const exerciseRepository = exercise_repository_prisma_1.ExerciseRepositoryPrisma.create(prisma_1.prisma);
    const createExerciseUseCase = create_exercise_usecase_1.CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    const editExerciseUseCase = edit_exercise_usecase_1.EditExerciseUsecase.create(categoryRepository, exerciseRepository);
    const listExerciseUseCase = list_exercise_usecase_1.ListExerciseUsecase.create(exerciseRepository);
    const getExerciseUseCase = select_exercise_usecase_1.SelectExerciseUsecase.create(exerciseRepository);
    const createExerciseRoute = create_exercise_express_route_1.CreateExerciseRoute.create(createExerciseUseCase);
    const editExerciseRoute = edit_exercise_express_route_1.EditExerciseRoute.create(editExerciseUseCase);
    const listExerciseRoute = list_exercise_express_route_1.ListExerciseRoute.create(listExerciseUseCase);
    const getExerciseRoute = select_exercise_express_route_1.SelectExerciseRoute.create(getExerciseUseCase);
    //workout-plan
    const workoutPlanRepository = workout_plan_repository_prisma_1.WorkoutPlanRepositoryPrisma.create(prisma_1.prisma);
    const createWorkoutPlanUsecase = create_workout_plan_usecase_1.CreateWorkoutPlanUsecase.create(workoutPlanRepository);
    const listWorkoutPlanUsecase = list_workout_plan_usecase_1.ListWorkoutPlanUsecase.create(workoutPlanRepository);
    const getWorkoutPlanUsecase = select_workout_plan_usecase_1.SelectWorkoutPlanUsecase.create(workoutPlanRepository);
    const createWorkoutPlanRoute = create_workout_plan_express_route_1.CreateWorkoutPlanRoute.create(createWorkoutPlanUsecase);
    const listWorkoutPlanRoute = list_workout_plan_express_route_1.ListWorkoutPlanRoute.create(listWorkoutPlanUsecase);
    const getWorkoutPlanRoute = select_workout_plan_express_route_1.SelectWorkoutPlanRoute.create(getWorkoutPlanUsecase);
    //keycloak
    const keycloakRepository = keycloak_repository_1.KeycloakRepository.create();
    const loginKeycloakUsecase = login_keycloak_usecase_1.LoginKeycloakUsecase.create(keycloakRepository);
    const loginKeycloakRoute = login_keycloak_express_route_1.LoginKeycloakRoute.create(loginKeycloakUsecase);
    //const allCategoriesRoutes = [createCategoryRoute, editCategoryRoute, listCategoryRoute, getCategoryRoute];
    //const allExercisesRoutes = [createExerciseRoute];
    //const allRoutes = allCategoriesRoutes.concat(allExercisesRoutes);
    const api = api_express_1.ApiExpress.create([
        createCategoryRoute, editCategoryRoute, listCategoryRoute, getCategoryRoute,
        createExerciseRoute, editExerciseRoute, listExerciseRoute, getExerciseRoute,
        createWorkoutPlanRoute, listWorkoutPlanRoute, getWorkoutPlanRoute,
        loginKeycloakRoute
    ], [
        keycloakAuth_middleware_1.keycloakAuth,
    ]);
    const port = 8080;
    api.start(port);
}
;
main();
