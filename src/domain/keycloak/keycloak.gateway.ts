export interface KeycloakGatewayInsertInputDTO {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export interface KeycloakGatewayLoginInputDTO {
    email: string;
    password: string;
};

export interface KeycloakGateway {
    getTokenAdmin(): Promise<any>
    checkEmailIsAlreadyCreated(email: string): Promise<any>
    insert(data: KeycloakGatewayInsertInputDTO): Promise<any>
    login(data: KeycloakGatewayLoginInputDTO): Promise<any>
};
