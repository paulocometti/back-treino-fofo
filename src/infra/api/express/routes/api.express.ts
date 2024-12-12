import { Api } from "../../api";
import express, { Express } from 'express';
import { Route } from "./route";

export class ApiExpress implements Api {
    
    private app: Express;

    private constructor(routes: Route[]) {
        this.app = express();
        this.app.use(express.json());
        this.addRoutes(routes);
    };

    public static create(routes: Route[]){
        return new ApiExpress(routes);
    };

    private addRoutes(routes: Route[]){
        for(const t of routes){
            const path = t.getPath();
            const method = t.getMethod();
            const handler = t.getHandler();

            this.app[method](path, handler);
        };
    };

    public start(port: number){
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            this.listRoutes();
        });
    };

    private listRoutes(){
        const routes = this.app._router.stack
            .filter((route: any) => route.route)
            .map((route: any) => {
                return {
                    path: route.route.path,
                    method: route.route.stack[0].method,
                }
            });

        console.log(routes);
    };
};
