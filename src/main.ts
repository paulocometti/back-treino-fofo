import { ApiExpress } from "./infra/api/express/api.express";
import { CreateCategoryRoute } from "./infra/api/express/routes/category/create-category.express.route";
import { EditCategoryRoute } from "./infra/api/express/routes/category/edit-category.express.route";
import { ListCategoryRoute } from "./infra/api/express/routes/category/list-category.express.route";
import { SelectCategoryRoute } from "./infra/api/express/routes/category/select-category.express.route";
import { CreateExerciseRoute } from "./infra/api/express/routes/exercise/create-exercise.express.route";
import { EditExerciseRoute } from "./infra/api/express/routes/exercise/edit-exercise.express.route";
import { ListExerciseRoute } from "./infra/api/express/routes/exercise/list-exercise.express.route";
import { SelectExerciseRoute } from "./infra/api/express/routes/exercise/select-exercise.express.route";
import { LoginKeycloakRoute } from "./infra/api/express/routes/keycloak/login-keycloak.express.route";
import { CreateWorkoutPlanRoute } from "./infra/api/express/routes/workout-plan/create-workout-plan.express.route";
import { DeleteWorkoutPlanRoute } from "./infra/api/express/routes/workout-plan/delete-workout-plan.express.route";
import { ListWorkoutPlanRoute } from "./infra/api/express/routes/workout-plan/list-workout-plan.express.route";
import { SelectWorkoutPlanRoute } from "./infra/api/express/routes/workout-plan/select-workout-plan.express.route";
import { CategoryRepositoryPrisma } from "./infra/repositories/category/category.repository.prisma";
import { ExerciseRepositoryPrisma } from "./infra/repositories/exercise/exercise.repository.prisma";
import { KeycloakRepository } from "./infra/repositories/keycloak/keycloak.repository";
import { WorkoutPlanRepositoryPrisma } from "./infra/repositories/workout-plan/workout-plan.repository.prisma";
import { keycloakAuth } from "./middleware/keycloakAuth.middleware";
import { prisma } from "./package/prisma/prisma";
import { CreateCategoryUsecase } from "./usecases/category/create-category/create-category.usecase";
import { EditCategoryUsecase } from "./usecases/category/edit-category/edit-category.usecase";
import { ListCategoryUsecase } from "./usecases/category/list-category/list-category.usecase";
import { SelectCategoryUsecase } from "./usecases/category/select-category/select-category.usecase";
import { CreateExerciseUsecase } from "./usecases/exercise/create-exercise/create-exercise.usecase";
import { EditExerciseUsecase } from "./usecases/exercise/edit-exercise/edit-exercise.usecase";
import { ListExerciseUsecase } from "./usecases/exercise/list-exercise/list-exercise.usecase";
import { SelectExerciseUsecase } from "./usecases/exercise/select-exercise/select-exercise.usecase";
import { LoginKeycloakUsecase } from "./usecases/keycloak/login-keycloak/login-keycloak.usecase";
import { CreateWorkoutPlanUsecase } from "./usecases/workout-plan/create-workout-plan/create-workout-plan.usecase";
import { DeleteWorkoutPlanUsecase } from "./usecases/workout-plan/delete-workout-plan/delete-workout-plan.usecase";
import { ListWorkoutPlanUsecase } from "./usecases/workout-plan/list-workout-plan/list-workout-plan.usecase";
import { SelectWorkoutPlanUsecase } from "./usecases/workout-plan/select-workout-plan/select-workout-plan.usecase";

function main() {
    //category
    const categoryRepository = CategoryRepositoryPrisma.create(prisma);

    const createCategoryUseCase = CreateCategoryUsecase.create(categoryRepository);
    const editCategoryUseCase = EditCategoryUsecase.create(categoryRepository);
    const listCategoryUsecase = ListCategoryUsecase.create(categoryRepository);
    const getCategoryUsecase = SelectCategoryUsecase.create(categoryRepository)

    const createCategoryRoute = CreateCategoryRoute.create(createCategoryUseCase);
    const editCategoryRoute = EditCategoryRoute.create(editCategoryUseCase);
    const listCategoryRoute = ListCategoryRoute.create(listCategoryUsecase);
    const getCategoryRoute = SelectCategoryRoute.create(getCategoryUsecase);

    //exercise
    const exerciseRepository = ExerciseRepositoryPrisma.create(prisma);

    const createExerciseUseCase = CreateExerciseUsecase.create(categoryRepository, exerciseRepository);
    const editExerciseUseCase = EditExerciseUsecase.create(categoryRepository, exerciseRepository);
    const listExerciseUseCase = ListExerciseUsecase.create(exerciseRepository);
    const getExerciseUseCase = SelectExerciseUsecase.create(exerciseRepository);

    const createExerciseRoute = CreateExerciseRoute.create(createExerciseUseCase);
    const editExerciseRoute = EditExerciseRoute.create(editExerciseUseCase);
    const listExerciseRoute = ListExerciseRoute.create(listExerciseUseCase);
    const getExerciseRoute = SelectExerciseRoute.create(getExerciseUseCase);

    //workout-plan
    const workoutPlanRepository = WorkoutPlanRepositoryPrisma.create(prisma);

    const createWorkoutPlanUsecase = CreateWorkoutPlanUsecase.create(workoutPlanRepository);
    const listWorkoutPlanUsecase = ListWorkoutPlanUsecase.create(workoutPlanRepository);
    const getWorkoutPlanUsecase = SelectWorkoutPlanUsecase.create(workoutPlanRepository);
    const deleteWorkoutPlanUsecase = DeleteWorkoutPlanUsecase.create(workoutPlanRepository);

    const createWorkoutPlanRoute = CreateWorkoutPlanRoute.create(createWorkoutPlanUsecase);
    const listWorkoutPlanRoute = ListWorkoutPlanRoute.create(listWorkoutPlanUsecase);
    const getWorkoutPlanRoute = SelectWorkoutPlanRoute.create(getWorkoutPlanUsecase);
    const deleteWorkoutPlanRoute = DeleteWorkoutPlanRoute.create(deleteWorkoutPlanUsecase);

    //keycloak
    const keycloakRepository = KeycloakRepository.create();

    const loginKeycloakUsecase = LoginKeycloakUsecase.create(keycloakRepository);
    const loginKeycloakRoute = LoginKeycloakRoute.create(loginKeycloakUsecase);

    const api = ApiExpress.create(
        [
            createCategoryRoute, editCategoryRoute, listCategoryRoute, getCategoryRoute,
            createExerciseRoute, editExerciseRoute, listExerciseRoute, getExerciseRoute,
            createWorkoutPlanRoute, listWorkoutPlanRoute, getWorkoutPlanRoute, deleteWorkoutPlanRoute,
            loginKeycloakRoute
        ],
        [
            keycloakAuth,
        ]
    );
    
    const port: number = 8080;
    api.start(port);
};

main();