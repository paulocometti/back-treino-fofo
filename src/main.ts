import { ApiExpress } from "./infra/api/express/routes/api.express";
import { CreateCategoryRoute } from "./infra/api/express/routes/create-category.express.route";
import { EditCategoryRoute } from "./infra/api/express/routes/edit-category.express.route";
import { ListCategoryRoute } from "./infra/api/express/routes/list-category.express.route";
import { SelectCategoryRoute } from "./infra/api/express/routes/select-category.express.route";
import { CategoryRepositoryPrisma } from "./infra/repositories/category/category.repository.prisma";
import { prisma } from "./package/prisma/prisma";
import { CreateCategoryUsecase } from "./usecases/category/create-category/create-category.usecase";
import { EditCategoryUsecase } from "./usecases/category/edit-category/edit-category.usecase";
import { ListCategoryUsecase } from "./usecases/category/list-category/list-category.usecase";
import { SelectCategoryUsecase } from "./usecases/category/select-category/select-category.usecase";

function main(){
    const categoryRepository = CategoryRepositoryPrisma.create(prisma);

    const createCategoryUseCase = CreateCategoryUsecase.create(categoryRepository);
    const editCategoryUseCase = EditCategoryUsecase.create(categoryRepository);
    const listCategoryUsecase = ListCategoryUsecase.create(categoryRepository);
    const getCategoryUsecase = SelectCategoryUsecase.create(categoryRepository)

    const createCategoryRoute = CreateCategoryRoute.create(createCategoryUseCase);
    const editCategoryRoute = EditCategoryRoute.create(editCategoryUseCase);
    const listCategoryRoute = ListCategoryRoute.create(listCategoryUsecase);
    const getCategoryRoute = SelectCategoryRoute.create(getCategoryUsecase);

    const api = ApiExpress.create([createCategoryRoute, editCategoryRoute, listCategoryRoute, getCategoryRoute]);
    const port = 8080;
    api.start(port);
};

main();