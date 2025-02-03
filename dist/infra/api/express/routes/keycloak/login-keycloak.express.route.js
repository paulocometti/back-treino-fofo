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
exports.LoginKeycloakRoute = void 0;
const route_1 = require("../route");
class LoginKeycloakRoute {
    constructor(path, method, createExerciseService) {
        this.path = path;
        this.method = method;
        this.createExerciseService = createExerciseService;
    }
    static create(createExerciseService) {
        return new LoginKeycloakRoute("/login", route_1.HttpMethod.POST, createExerciseService);
    }
    ;
    getHandler() {
        return (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = request.body;
                const input = { email, password };
                const result = yield this.createExerciseService.execute(input, undefined);
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
exports.LoginKeycloakRoute = LoginKeycloakRoute;
;
