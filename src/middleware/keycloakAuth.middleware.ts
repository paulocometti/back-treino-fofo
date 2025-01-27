import { Request, Response, NextFunction } from 'express';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    sid: string;
    given_name: string;
    resource_access: any;
}

const keycloakAuth = (req: Request, res: Response, next: NextFunction) => {
    console.log(`teste middleware`);

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: 'Authorization header missing' });

    const tokenMatch = authHeader.match(/^Bearer (.+)$/);
    if (!tokenMatch)
        return res.status(401).json({ message: 'Invalid authorization format. Expected Bearer token.' });

    const token = tokenMatch[1];

    try {
        const decodedUser: DecodedToken = jwtDecode<DecodedToken>(token);

        if (!decodedUser.sid || !decodedUser.given_name)
            return res.status(401).json({ message: 'Invalid token payload' });

        (req as any).user = decodedUser;
        console.error('decodedUser:', decodedUser);

        next();
    } catch (error) {
        console.error('Token decoding failed:', error);
        return res.status(401).json({ message: 'Invalid or malformed token' });
    };
};

export { keycloakAuth };
