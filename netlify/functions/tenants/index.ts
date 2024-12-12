import { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth';
import { provideClient } from '../utils/api-provider';
import { handleApiError, prepareFunction } from '../utils/helpers';

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

export const handler = prepareFunction('tenants', router);
