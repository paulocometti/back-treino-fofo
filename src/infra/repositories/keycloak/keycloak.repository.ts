
import axios from "axios";
import { KeycloakGateway, KeycloakGatewayInsertInputDTO, KeycloakGatewayLoginInputDTO } from "../../../domain/keycloak/keycloak.gateway";

export class KeycloakRepository implements KeycloakGateway {

    private constructor() { }

    public static create() {
        return new KeycloakRepository();
    };

    public async getTokenAdmin(): Promise<any> {
        const kcUrlMasterGetToken: string = process.env.KC_URL + "/realms/master/protocol/openid-connect/token";
        const formattedData = new URLSearchParams();
        const kcAdminClient: string = process.env.KC_ADMIN_CLIENT as string;
        const kcAdminSecret: string = process.env.KC_ADMIN_SECRET as string;
        formattedData.append('client_id', kcAdminClient);
        formattedData.append('client_secret', kcAdminSecret);
        formattedData.append('grant_type', 'client_credentials');

        const optionsGetToken = {
            method: 'POST',
            url: kcUrlMasterGetToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formattedData.toString(),
        };
        const result: any = await axios(optionsGetToken);
        if (typeof result?.data.access_token !== `string`) return null;
        const tokenAdmin = result.data.access_token;
        return tokenAdmin;
    };

    public async checkEmailIsAlreadyCreated(email: string): Promise<any> {
        const kcUrlCheckUser: string = `${process.env.KC_URL}/admin/realms/login/users?email=${encodeURIComponent(email)}`;
        const tokenAdmin: string = await this.getTokenAdmin();
        const optionsCheckUser = {
            method: 'GET',
            url: kcUrlCheckUser,
            headers: { 'Authorization': 'Bearer ' + tokenAdmin, },
        };
        const result: any = await axios(optionsCheckUser);
        if (result.status === 200 && result.data && result.data.length > 0) return true;
        return false;
    };

    public async insert(data: KeycloakGatewayInsertInputDTO): Promise<any> {
        const kcUrlLoginManagementUsers: string = process.env.KC_URL + "/admin/realms/login/users";
        const tokenAdmin: string = await this.getTokenAdmin();
        const formattedData = {
            enabled: true,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            credentials: [{
                type: "password",
                value: data.password,
                temporary: false
            }]
        };
        const optionsCreateUser = {
            method: 'POST',
            url: kcUrlLoginManagementUsers,
            headers: {
                'Authorization': 'Bearer ' + tokenAdmin,
            },
            data: formattedData,
        };
        const result: any = await axios(optionsCreateUser);
        return result?.data || null;
        // if (error.response && error.response.status === 409) 
        //    throw new Error("Erro: Usuário já cadastrado com este e-mail!");
        //throw new Error("Erro ao tentar cadastrar!");
    };

    public async login(data: KeycloakGatewayLoginInputDTO): Promise<any> {
        const kcUrlLoginGetToken: string = process.env.KC_URL + "/realms/login/protocol/openid-connect/token"
        const { email, password } = data;
        const formattedData = new URLSearchParams();
        const kcLoginClient: string = process.env.KC_LOGIN_CLIENT as string;
        const kcLoginSecret: string = process.env.KC_LOGIN_SECRET as string;
        formattedData.append('client_id', kcLoginClient);
        formattedData.append('client_secret', kcLoginSecret);
        formattedData.append('username', email);
        formattedData.append('password', password);
        formattedData.append('grant_type', 'password');

        const optionsGetToken = {
            method: 'POST',
            url: kcUrlLoginGetToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: formattedData.toString()
        };
        const result: any = await axios(optionsGetToken);
        if (typeof result?.data.access_token !== `string`) return null;
        return result.data;
    };
};
