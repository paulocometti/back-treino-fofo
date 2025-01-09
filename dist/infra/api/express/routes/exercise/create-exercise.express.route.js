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
exports.CreateExerciseRoute = void 0;
const route_1 = require("../route");
class CreateExerciseRoute {
    constructor(path, method, createExerciseService) {
        this.path = path;
        this.method = method;
        this.createExerciseService = createExerciseService;
    }
    static create(createExerciseService) {
        return new CreateExerciseRoute("/exercise/create", route_1.HttpMethod.POST, createExerciseService);
    }
    ;
    getHandler() {
        return (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, categories } = request.body;
                const input = { name, categories };
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
                const user = userAdminFake;
                const result = yield this.createExerciseService.execute(input, user);
                const output = this.presente(result);
                response.status(201).json(output);
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
    presente(input) {
        const response = { id: input.id, name: input.name, categories: input.categories, user_id: input.user_id };
        return {
            exercise: response
        };
    }
    ;
}
exports.CreateExerciseRoute = CreateExerciseRoute;
;
