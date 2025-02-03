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
exports.ListWorkoutPlanRoute = void 0;
const route_1 = require("../route");
const keycloakAuth_middleware_1 = require("../../../../../middleware/keycloakAuth.middleware");
class ListWorkoutPlanRoute {
    constructor(path, method, selectWorkoutPlanService) {
        this.path = path;
        this.method = method;
        this.selectWorkoutPlanService = selectWorkoutPlanService;
    }
    static create(selectWorkoutPlanService) {
        return new ListWorkoutPlanRoute("/workout-plan/list", route_1.HttpMethod.GET, selectWorkoutPlanService);
    }
    ;
    getHandler() {
        return (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const auth = request.headers.authorization;
                const user = (0, keycloakAuth_middleware_1.extractUserFromAuth)(auth);
                const result = yield this.selectWorkoutPlanService.execute(undefined, user);
                response.status(201).json(result);
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
}
exports.ListWorkoutPlanRoute = ListWorkoutPlanRoute;
;
