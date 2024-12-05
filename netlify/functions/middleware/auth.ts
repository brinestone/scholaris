import { NextFunction, Request, Response } from "express";

export const userTokenContextKey = 'token';

export function auth(req: Request, res: Response, next: NextFunction) {
    const sessionCookie = req.cookies['__session'];
    if (!sessionCookie) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    req.context[userTokenContextKey] = sessionCookie;
    return next();
}
