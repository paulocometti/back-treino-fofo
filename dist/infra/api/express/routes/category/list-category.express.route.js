"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCategoryRoute = void 0;
const route_1 = require("../route");
class ListCategoryRoute {
    constructor(path, method, listCategorySerivce) {
        this.path = path;
        this.method = method;
        this.listCategorySerivce = listCategorySerivce;
    }
    ;
    static create(listCategorySerivce) {
        return new ListCategoryRoute("/category/list", route_1.HttpMethod.GET, listCategorySerivce);
    }
    ;
    getHandler() {
        return (_, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userAdminFake = {
                    id: crypto.randomUUID(),
                    name: 'Paulo',
                    role: 'ADMIN'
                };
                const userFake = {
                    id: 'beee6914-5b09-46d2-be94-b09284a31811',
                    name: 'Paulo',
                    role: 'USER'
                };
                //const user = (Math.random() < 0.5) ? userAdminFake : userFake;
                const user = userFake;
                const result = yield this.listCategorySerivce.execute(undefined, user);
                const output = this.present(result);
                response.status(200).json(output).send();
            }
            catch (error) {
                response.status(500).json({ message: (error === null || error === void 0 ? void 0 : error.message) || "Error Interno do Servidor." });
            }
            ;
        });
    }
    ;
    getPath() {
        return this.path;
    }
    ;
    getMethod() {
        return this.method;
    }
    ;
    present(input) {
        const response = [];
        const categories = input.categories;
        for (const t of categories) {
            response.push({
                id: t.id,
                name: t.name
            });
        }
        ;
        return { categories: response };
    }
    ;
}
exports.ListCategoryRoute = ListCategoryRoute;
;
