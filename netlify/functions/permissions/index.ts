import { Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { provideClient } from "../utils/api-provider";
import { handleApiError, prepareFunction } from "../utils/helpers";
import { PermissionDomains, TenantPermissions } from "@/lib/index";

async function getAllDomainPermissions(req: Request, res: Response) {
    const client = provideClient(req);
    try {
        const target = [req.query['domain'], req.query['id']].join(':');
        let queryPermissions = Array<string>();
        switch (req.query['domain']) {
            case PermissionDomains.Tenant:
                queryPermissions = Object.values(TenantPermissions);
                break;
            default:
                throw new Error('Unknonwn domain');
        }

        const { relations } = await client.permissions.ListRelations({
            permissions: queryPermissions,
            target
        });

        res.status(200).json(relations);
    } catch (e) {
        handleApiError(e, res);
    }
}

async function checkPermissions(req: Request, res: Response) {
    const client = provideClient(req);
    try {
        const target = [req.query["domain"], req.query["id"]].join(':');
        const queryRelations = (req.query["relations"] as string).split(',');
        const { relations } = await client.permissions.ListRelations({
            permissions: queryRelations,
            target
        });
        res.status(200).json({ allowed: queryRelations.every(r => relations.includes(r)) });
    } catch (e) {
        handleApiError(e, res);
    }
}

const router = Router().use(auth);
router.get('/check-relations', checkPermissions);
router.get('/get-relations', getAllDomainPermissions);

export const handler = prepareFunction('permissions', router);
