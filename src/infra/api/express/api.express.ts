import { Api } from "../api";
import express, { Express, RequestHandler, Router } from 'express';
import { Route } from "./routes/route";
import cors from 'cors';


export class ApiExpress implements Api {
    private app: Express;
    private router: Router;

    private constructor(routes: Route[], middlewares: RequestHandler[] = []) {
        this.app = express();
        this.router = express.Router();

        this.app.use(express.json());
        this.app.use(cors());
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });

        this.addRoutes(routes);

        this.app.use('/treinofofo', this.router);
    }

    public static create(routes: Route[], middlewares: RequestHandler[] = []) {
        return new ApiExpress(routes, middlewares);
    }

    private addRoutes(routes: Route[]) {
        for (const route of routes) {
            const path = route.getPath();
            const method = route.getMethod();
            const handler = route.getHandler();

            this.router[method](path, handler);
        }
    }

    public start(port: number) {
        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            this.listRoutes();
        });
    }

    private listRoutes() {
        const routes = this.app._router.stack
            .filter((layer: any) => layer.name === 'router')
            .flatMap((layer: any) =>
                layer.handle.stack.map((route: any) => ({
                    path: `/treinofofo${route.route.path}`,
                    method: route.route.stack[0].method,
                }))
            );

        console.log(routes);
    }
}