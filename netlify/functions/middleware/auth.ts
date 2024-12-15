import { NextFunction, Request, Response } from "express";
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const userTokenContextKey = 'token';
export const userClaimsContextKey = 'claims';

export function auth(req: Request, res: Response, next: NextFunction) {
    const sessionCookie = req.cookies['__session'];
    if (!sessionCookie) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    req.context[userTokenContextKey] = sessionCookie;
    req.context[userClaimsContextKey] = jwtDecode<JwtPayload>(sessionCookie);
    return next();
}
