"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExpress = void 0;
const express_1 = __importDefault(require("express"));
class ApiExpress {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.app.use(express_1.default.json());
        this.addRoutes(routes);
    }
    ;
    static create(routes) {
        return new ApiExpress(routes);
    }
    ;
    addRoutes(routes) {
        for (const t of routes) {
            const path = t.getPath();
            const method = t.getMethod();
            const handler = t.getHandler();
            this.app[method](path, handler);
        }
        ;
    }
    ;
    start(port) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            this.listRoutes();
        });
    }
    ;
    listRoutes() {
        const routes = this.app._router.stack
            .filter((route) => route.route)
            .map((route) => {
            return {
                path: route.route.path,
                method: route.route.stack[0].method,
            };
        });
        console.log(routes);
    }
    ;
}
exports.ApiExpress = ApiExpress;
;
