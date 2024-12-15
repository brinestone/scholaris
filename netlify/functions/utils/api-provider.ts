import Client from '@/lib/api';
import { Request } from "express";
import { userClaimsContextKey, userTokenContextKey } from "../middleware/auth";
import { JwtPayload } from 'jwt-decode';

const apiOrigin = String(process.env['SCHOLARIS_API_ENV']);
export function provideClient(req: Request) {
    const client = new Client(apiOrigin, { auth: () => provideUserToken(req) });
    return client;
}

export function provideUserToken(req: Request) {
    return req.context[userTokenContextKey] as string | undefined;
}

export function provideUserClaims(req: Request) {
    return req.context[userClaimsContextKey] as JwtPayload | undefined;
}
