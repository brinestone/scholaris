import Client from "@/lib/api";
import { Request } from "express";
import { userTokenContextKey } from "../middleware/auth";

const apiOrigin = String(Netlify.env.get('SCHOLARIS_API_ENV'));
export function provideClient(req: Request) {
    const token = req.context[userTokenContextKey] as string | undefined;

    const client = new Client(apiOrigin, { auth: token });
    return client;
}
