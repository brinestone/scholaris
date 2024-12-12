import '@netlify/functions';
import { Request } from "express";
import { userTokenContextKey } from "../middleware/auth";
import Client from '@/lib/api';

const apiOrigin = String(Netlify.env.get('SCHOLARIS_API_ENV'));
export function provideClient(req: Request) {
    const client = new Client(apiOrigin, { auth: () => req.context[userTokenContextKey] as string | undefined });
    return client;
}
