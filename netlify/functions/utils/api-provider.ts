import Client from '@/lib/api';
import { Request } from "express";
import { userTokenContextKey } from "../middleware/auth";

const apiOrigin = String(process.env['SCHOLARIS_API_ENV']);
export function provideClient(req: Request) {
    const client = new Client(apiOrigin, { auth: () => req.context[userTokenContextKey] as string | undefined });
    return client;
}
