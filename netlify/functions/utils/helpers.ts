import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
import { createHash } from "crypto";
import express, { Response, Router } from "express";
import expressContext from "express-request-context";
import { join } from "path";
import serverless from 'serverless-http';
import { APIError } from "../../../lib/api";

export function hashThese(...params: unknown[]) {
    const md5 = createHash('md5');
    const challenge = params.map(p => String(p)).join(',');
    md5.update(challenge);
    const digest = md5.digest().toString('hex');
    return digest
}

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
