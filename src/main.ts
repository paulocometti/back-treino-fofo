import { ApiExpress } from "./infra/api/express/routes/api.express";
import { CreateCategoryRoute } from "./infra/api/express/routes/create-category.express.route";
import { ListCategoryRoute } from "./infra/api/express/routes/list-category.express.route";
import { SelectCategoryRoute } from "./infra/api/express/routes/select-category.express.route";
import { CategoryRepositoryPrisma } from "./infra/repositories/category/category.repository.prisma";
import { prisma } from "./package/prisma/prisma";
import { CreateCategoryUsecase } from "./usecases/category/create-category/create-category.usecase";
import { ListCategoryUsecase } from "./usecases/category/list-category/list-category.usecase";
import { SelectCategoryUsecase } from "./usecases/category/select-category/select-category.usecase";

function main(){
    const categoryRepository = CategoryRepositoryPrisma.create(prisma);

    const createCategoryUseCase = CreateCategoryUsecase.create(categoryRepository);
    const listCategoryUsecase = ListCategoryUsecase.create(categoryRepository);
    const getCategoryUsecase = SelectCategoryUsecase.create(categoryRepository)

    const createCategoryRoute = CreateCategoryRoute.create(createCategoryUseCase);
    const listCategoryRoute = ListCategoryRoute.create(listCategoryUsecase);
    const getCategoryRoute = SelectCategoryRoute.create(getCategoryUsecase);

    const api = ApiExpress.create([createCategoryRoute, listCategoryRoute, getCategoryRoute]);
    const port = 8080;
    api.start(port);
};

main();