import { ApiExpress } from "./infra/api/express/routes/api.express";
import { CreateCategoryRoute } from "./infra/api/express/routes/create-category.express.route";
import { ListCategoryRoute } from "./infra/api/express/routes/list-category.express.route";
import { CategoryRepositoryPrisma } from "./infra/repositories/category/category.repository.prisma";
import { prisma } from "./package/prisma/prisma";
import { CreateCategoryUsecase } from "./usecases/category/create-category/create-category.usecase";
import { ListCategoryUsecase } from "./usecases/category/list-category/list-category.usecase";

function main(){
    const aRepository = CategoryRepositoryPrisma.create(prisma);

    const createCategoryUseCase = CreateCategoryUsecase.create(aRepository);
    const listCategoryUsecase = ListCategoryUsecase.create(aRepository);

    const createRoute = CreateCategoryRoute.create(createCategoryUseCase);
    const listRoute = ListCategoryRoute.create(listCategoryUsecase);

    const api = ApiExpress.create([createRoute, listRoute]);
    const port = 8080;
    api.start(port);
};

main();