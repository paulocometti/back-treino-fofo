import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';
import crypto from 'crypto';

interface ResourceAccess {
    [key: string]: {
        roles: string[];
    };
};

interface DecodedToken {
    sub: string;
    given_name: string;
    resource_access: ResourceAccess;
};

export interface UserInputDto {
    id: string;
    name: string;
    role: 'USER' | 'ADMIN';
};

const userAdminFake: UserInputDto = {
    id: crypto.randomUUID(),
    name: 'Paulo Admin',
    role: 'ADMIN'
};
const userFake: UserInputDto = {
    id: 'beee6914-5b09-46d2-be94-b09284a31811',
    name: 'Paulo User',
    role: 'USER'
};

export const extractUserFromAuth = (auth: string): UserInputDto => {

    if (process.env.NODE_ENV === 'local') return userAdminFake;
    if (!auth) throw new Error("Authorization header is missing");

    const token = auth.replace(/^Bearer\s+/, '');

    const decodedUser: DecodedToken = jwtDecode<DecodedToken>(token);
    const { sub: userId, given_name: userNome, resource_access: userAcessos } = decodedUser;

    const treinoFofo = userAcessos['treinofofo'];
    if (!treinoFofo || !Array.isArray(treinoFofo.roles) || treinoFofo.roles.length === 0)
        throw new Error("Erro de autenticação: Acesso de usuário inválido");

    const extractedRole = treinoFofo.roles.some(role => role === 'ROLE_ADMIN')
        ? 'ADMIN'
        : treinoFofo.roles[0].replace('ROLE_', '');

    if (extractedRole !== 'ADMIN' && extractedRole !== 'USER')
        throw new Error("Erro de autenticação: A role extraída é inválida");

    const userRole: "USER" | "ADMIN" = extractedRole as "USER" | "ADMIN";

    return { id: userId, name: userNome, role: userRole };
}


const keycloakAuth = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'local') {
        next();
        return;
    }

    if (req.method === 'POST' && (req.url.endsWith('/treinofofo/user/login') || req.url.endsWith('/treinofofo/user/create'))) {
        next();
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }

    const tokenMatch = authHeader.match(/^Bearer (.+)$/);
    if (!tokenMatch) {
        res.status(401).json({ message: 'Invalid authorization format. Expected Bearer token.' });
        return;
    }

    const token = tokenMatch[1];

    try {
        const decodedUser: DecodedToken = jwtDecode<DecodedToken>(token);

        if (!decodedUser.sub || !decodedUser.given_name) {
            res.status(401).json({ message: 'Invalid token payload' });
            return;
        }

        (req as any).user = decodedUser;

        next();
    } catch (error) {
        console.error('Token decoding failed:', error);
        res.status(401).json({ message: 'Invalid or malformed token' });
    }
};

export { keycloakAuth };
