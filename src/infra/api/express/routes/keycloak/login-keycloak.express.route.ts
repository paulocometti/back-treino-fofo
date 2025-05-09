import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { LoginKeycloakInputDto, LoginKeycloakUsecase } from "../../../../../usecases/keycloak/login-keycloak/login-keycloak.usecase";

export class LoginKeycloakRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly loginKeycloakService: LoginKeycloakUsecase
    ) { }

    public static create(loginKeycloakService: LoginKeycloakUsecase) {
        return new LoginKeycloakRoute(
            "/user/login",
            HttpMethod.POST,
            loginKeycloakService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { email, password } = request.body;
                const input: LoginKeycloakInputDto = { email, password };
                const result = await this.loginKeycloakService.execute(input, undefined);
                response.status(200).json(result);
            } catch (error: any) {
                response.status(500).json({ message: error?.message || "Error Interno do Servidor." });
            };
        };
    };

    public getPath(): string {
        return this.path;
    };

    public getMethod(): HttpMethod {
        return this.method;
    };

};
