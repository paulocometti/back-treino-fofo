import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateKeycloakInputDto, CreateKeycloakUsecase } from "../../../../../usecases/keycloak/login-keycloak/create-keycloak.usecase";

export class CreateKeycloakRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly loginKeycloakService: CreateKeycloakUsecase
    ) { }

    public static create(loginKeycloakService: CreateKeycloakUsecase) {
        return new CreateKeycloakRoute(
            "/user/create",
            HttpMethod.POST,
            loginKeycloakService
        );
    };

    public getHandler() {
        return async (request: Request, response: Response) => {
            try {
                const { email, firstName, lastName, password } = request.body;
                const input: CreateKeycloakInputDto = { email, firstName, lastName, password };
                await this.loginKeycloakService.execute(input, undefined);
                response.status(200).json({ message: "Usuário criado com sucesso!" });
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
