"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_express_1 = require("./infra/api/express/api.express");
const create_category_express_route_1 = require("./infra/api/express/routes/category/create-category.express.route");
const edit_category_express_route_1 = require("./infra/api/express/routes/category/edit-category.express.route");
const list_category_express_route_1 = require("./infra/api/express/routes/category/list-category.express.route");
const select_category_express_route_1 = require("./infra/api/express/routes/category/select-category.express.route");
const category_repository_prisma_1 = require("./infra/repositories/category/category.repository.prisma");
const prisma_1 = require("./package/prisma/prisma");
const create_category_usecase_1 = require("./usecases/category/create-category/create-category.usecase");
const edit_category_usecase_1 = require("./usecases/category/edit-category/edit-category.usecase");
const list_category_usecase_1 = require("./usecases/category/list-category/list-category.usecase");
const select_category_usecase_1 = require("./usecases/category/select-category/select-category.usecase");
function main() {
    const categoryRepository = category_repository_prisma_1.CategoryRepositoryPrisma.create(prisma_1.prisma);
    const createCategoryUseCase = create_category_usecase_1.CreateCategoryUsecase.create(categoryRepository);
    const editCategoryUseCase = edit_category_usecase_1.EditCategoryUsecase.create(categoryRepository);
    const listCategoryUsecase = list_category_usecase_1.ListCategoryUsecase.create(categoryRepository);
    const getCategoryUsecase = select_category_usecase_1.SelectCategoryUsecase.create(categoryRepository);
    const createCategoryRoute = create_category_express_route_1.CreateCategoryRoute.create(createCategoryUseCase);
    const editCategoryRoute = edit_category_express_route_1.EditCategoryRoute.create(editCategoryUseCase);
    const listCategoryRoute = list_category_express_route_1.ListCategoryRoute.create(listCategoryUsecase);
    const getCategoryRoute = select_category_express_route_1.SelectCategoryRoute.create(getCategoryUsecase);
    const api = api_express_1.ApiExpress.create([createCategoryRoute, editCategoryRoute, listCategoryRoute, getCategoryRoute]);
    const port = 8080;
    api.start(port);
}
;
main();
