import { Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { provideClient } from '../utils/api-provider';
import { handleApiError, prepareFunction } from '../utils/helpers';

async function findSubscribed(req: Request, res: Response) {
    const client = provideClient(req);
    const query = req.query;
    try {
        const ans = await client.institutions.Lookup({
            Page: Number(query['page'] ?? 0),
            Size: Number(query['size'] ?? 1000),
            SubscribedOnly: Boolean(query['subscribedOnly'] ?? false)
        });
        res.json(ans.institutions);
    } catch (e) {
        handleApiError(e, res);
    }
}

const router = Router();
router.get('/', auth, findSubscribed);

export const handler = prepareFunction('institutions', router)

