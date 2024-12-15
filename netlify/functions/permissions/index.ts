import { PermissionDomains, TenantPermissions } from "@/lib/permissions";
import { Request, Response, Router } from "express";
import { LRUCache } from 'lru-cache';
import { auth } from "../middleware/auth";
import { provideClient, provideUserClaims } from "../utils/api-provider";
import { handleApiError, hashThese, prepareFunction } from "../utils/helpers";

const cache = new LRUCache<string, string[]>({
    max: 500,
    maxSize: 5000,
    sizeCalculation: (v) => v.length,
    ttl: 3_600_000 * 24
});

function computeCacheKey(target: string, req: Request) {
    return hashThese(target, provideUserClaims(req)?.sub);
}

async function getAllDomainPermissions(req: Request, res: Response) {
    try {
        const target = [req.query['domain'], req.query['id']].join(':');
        const cacheKey = computeCacheKey(target, req);
        let queryPermissions = Array<string>();
        switch (req.query['domain']) {
            case PermissionDomains.Tenant:
                queryPermissions = Object.values(TenantPermissions);
                break;
            default:
                throw new Error('Unknonwn domain');
        }

        let relations = cache.get(cacheKey);
        if (!relations) {
            const client = provideClient(req);
            const ans = await client.permissions.ListRelations({
                permissions: queryPermissions,
                target
            });
            relations = ans.relations;
            cache.set(cacheKey, ans.relations);
        }

        res.status(200).json(relations);
        cache.set(cacheKey, relations);
    } catch (e) {
        handleApiError(e, res);
    }
}

async function checkPermissions(req: Request, res: Response) {
    const client = provideClient(req);
    try {
        const target = [req.query["domain"], req.query["id"]].join(':');
        const relationsArg = (req.query["relations"] as string).split(',');
        const cacheKey = computeCacheKey(target, req);
        let permissions = cache.get(cacheKey);

        let queryPermissions = Array<string>();
        switch (req.query['domain']) {
            case PermissionDomains.Tenant:
                queryPermissions = Object.values(TenantPermissions);
                break;
            default:
                throw new Error('Unknonwn domain');
        }

        if (!permissions) {
            const ans = await client.permissions.ListRelations({
                permissions: queryPermissions,
                target
            });

            permissions = ans.relations;
            cache.set(cacheKey, ans.relations);
        }
        res.status(200).json({ allowed: relationsArg.every(r => permissions.includes(r)) });
    } catch (e) {
        handleApiError(e, res);
    }
}

const router = Router().use(auth);
router.get('/check-relations', checkPermissions);
router.get('/get-relations', getAllDomainPermissions);

export const handler = prepareFunction('permissions', router);
