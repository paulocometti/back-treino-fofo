"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keycloakAuth = void 0;
exports.extractUserFromAuth = extractUserFromAuth;
const jwt_decode_1 = require("jwt-decode");
;
;
;
const userAdminFake = {
    id: crypto.randomUUID(),
    name: 'Paulo',
    role: 'ADMIN'
};
const userFake = {
    id: 'beee6914-5b09-46d2-be94-b09284a31811',
    name: 'Paulo',
    role: 'USER'
};
function extractUserFromAuth(auth) {
    if (process.env.NODE_ENV === 'local')
        return userAdminFake;
    if (!auth)
        throw new Error("Authorization header is missing");
    const token = auth.replace(/^Bearer\s+/, '');
    const decodedUser = (0, jwt_decode_1.jwtDecode)(token);
    const { sid: userId, given_name: userNome, resource_access: userAcessos } = decodedUser;
    const treinoFofo = userAcessos['treino-fofo'];
    if (!treinoFofo || !Array.isArray(treinoFofo.roles) || treinoFofo.roles.length === 0)
        throw new Error("Erro de autenticação: Acesso de usuário inválido");
    const extractedRole = treinoFofo.roles.some(role => role === 'ROLE_ADMIN')
        ? 'ADMIN'
        : treinoFofo.roles[0].replace('ROLE_', '');
    if (extractedRole !== 'ADMIN' && extractedRole !== 'USER')
        throw new Error("Erro de autenticação: A role extraída é inválida");
    const userRole = extractedRole;
    return { id: userId, name: userNome, role: userRole };
}
const keycloakAuth = (req, res, next) => {
    if (process.env.NODE_ENV === 'local')
        return next();
    if (req.method === 'POST' && req.url.endsWith('/login'))
        return next();
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'Authorization header missing' });
    const tokenMatch = authHeader.match(/^Bearer (.+)$/);
    if (!tokenMatch)
        return res.status(401).json({ message: 'Invalid authorization format. Expected Bearer token.' });
    const token = tokenMatch[1];
    try {
        const decodedUser = (0, jwt_decode_1.jwtDecode)(token);
        if (!decodedUser.sid || !decodedUser.given_name)
            return res.status(401).json({ message: 'Invalid token payload' });
        req.user = decodedUser;
        console.error('decodedUser:', decodedUser);
        next();
    }
    catch (error) {
        console.error('Token decoding failed:', error);
        return res.status(401).json({ message: 'Invalid or malformed token' });
    }
    ;
};
exports.keycloakAuth = keycloakAuth;
