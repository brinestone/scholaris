import cookieParser from 'cookie-parser';
import express, { Request, Response, Router } from 'express';
import expressContext from "express-request-context";
import serverless from 'serverless-http';
import { auth } from '../middleware/auth';
import { provideClient } from '../utils/api-provider';
import { handleApiError } from '../utils/helpers';
import { json, urlencoded } from 'body-parser';

async function findSubscribedTenants(req: Request, response: Response) {
    const client = provideClient(req);
    try {
        const res = await client.tenants.Lookup();
        response.json(res.tenants);
    } catch (e) {
        handleApiError(e, response);
    }
}

async function isNameAvailable(req: Request, res: Response) {
    const client = provideClient(req);
    const Name = req.query['name'] as string;
    if (Name.length <= 3) {
        res.json({ available: false });
        return;
    }
    try {
        const ans = await client.tenants.NameAvailable({ Name })
        res.json(ans);
    } catch (e) {
        handleApiError(e, res);
    }
}

async function createNewTenant(req: Request, res: Response) {
    const client = provideClient(req);
    const { captcha, name } = req.body;
    try {
        await client.tenants.NewTenant({ name, captchaToken: captcha });
        res.status(201).send();
        return;
    } catch (e) {
        handleApiError(e, res);
    }
}

const router = Router();
router.get('/', auth, findSubscribedTenants);
router.get('/name-available', isNameAvailable);
router.post('/', auth, createNewTenant);

const api = express();
api.use(cookieParser(), expressContext(), json(), urlencoded({ extended: true }));
api.use('/api/tenants', router);
export const handler = serverless(api);
