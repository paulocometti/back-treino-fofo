import { KeycloakGateway } from "../../../domain/keycloak/keycloak.gateway";
import { Usecase } from "../../usecase";
import { jwtDecode } from 'jwt-decode';

export type LoginKeycloakInputDto = {
    email: string;
    password: string;
};

export type LoginKeycloakUserInputDto = void;

export type LoginKeycloakOutputDto = {
    user: any
    /*
    user: z.object({
        access_token: z.string(),
        expires_in: z.number(),
        refresh_expires_in: z.number(),
        refresh_token: z.string(),
        token_type: z.string(),
        "not-before-policy": z.number(),
        session_state: z.string(),
        scope: z.string(),
        email_verified: z.boolean(),
    })
    */
};

export class LoginKeycloakUsecase
    implements Usecase<LoginKeycloakInputDto, LoginKeycloakUserInputDto, LoginKeycloakOutputDto> {

    private constructor(private readonly keycloakGateway: KeycloakGateway) { }

    public static create(keycloakGateway: KeycloakGateway) {
        return new LoginKeycloakUsecase(keycloakGateway);
    };

    public async execute(req: LoginKeycloakInputDto, _: LoginKeycloakUserInputDto): Promise<LoginKeycloakOutputDto> {
        const { email, password } = req;
        const input = { email, password };
        const user = await this.keycloakGateway.login(input);
        const decoded: { email: string, email_verified: boolean } = jwtDecode<{ email: string, email_verified: boolean }>(user?.access_token);
        if(decoded.email_verified){
            const emailIsNotCreatedOnUserProfile: boolean = !(await this.keycloakGateway.checkEmailIsAlreadyCreated(decoded.email));
            if(emailIsNotCreatedOnUserProfile) 
                throw new Error();
                //await this.keycloakGateway.insert({ email: decoded.email });
        };
        const result = { email_verified: decoded.email_verified, ...user };
        const output = this.presentOutput(result);
        return output;
    };

    private presentOutput(input: any): LoginKeycloakOutputDto {
        return { user: input };
    };
};