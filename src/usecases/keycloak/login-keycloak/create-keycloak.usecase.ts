import { KeycloakGateway } from "../../../domain/keycloak/keycloak.gateway";
import { Usecase } from "../../usecase";

export type CreateKeycloakInputDto = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type CreateKeycloakUserInputDto = void;

export type CreateKeycloakOutputDto = {
    user: any
};

export class CreateKeycloakUsecase
    implements Usecase<CreateKeycloakInputDto, CreateKeycloakUserInputDto, CreateKeycloakOutputDto> {

    private constructor(private readonly keycloakGateway: KeycloakGateway) { }

    public static create(keycloakGateway: KeycloakGateway) {
        return new CreateKeycloakUsecase(keycloakGateway);
    };

    public async execute(req: CreateKeycloakInputDto, _: CreateKeycloakUserInputDto): Promise<CreateKeycloakOutputDto> {
        const { email, firstName, lastName, password } = req;
        const input = { email, firstName, lastName, password };
        const user = await this.keycloakGateway.insert(input);
        const output = this.presentOutput(user);
        return output;
    };

    private presentOutput(input: any): CreateKeycloakOutputDto {
        return { user: input };
    };
};