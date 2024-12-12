import cookieParser from "cookie-parser";
import express, { Response, Router } from "express";
import expressContext from "express-request-context";
import { json, urlencoded } from "body-parser";
import serverless from 'serverless-http';
import { join } from "path";
import { APIError } from "@/lib/api";

export function handleApiError(e: unknown, res: Response) {
    if (e instanceof APIError) {
        res.status(e.status).json({ message: e.message });
        return
    }
    res.status(500).json(e);
    console.error(e);
}

export function prepareFunction(prefix: string, router: Router) {
    const api = express();
    api.use(cookieParser(), expressContext(), json(), urlencoded({ extended: true }));
    api.use(join('/api', prefix), router);
    return serverless(api);
}
