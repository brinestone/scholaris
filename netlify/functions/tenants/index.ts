import { Request, Response, Router } from 'express';
import { auth } from '../middleware/auth';
import { provideClient } from '../utils/api-provider';
import { handleApiError, prepareHandler } from '../utils/helpers';
import { PermissionDomains } from '@/lib/permissions';

async function getSettings(req: Request, response: Response) {
    const client = provideClient(req);
    try {
        const tenant = Number(req.params['id']);
        if (isNaN(tenant)) {
            throw new Error('Invalid id param');
        }

        const res = await client.settings.FindSettings({
            Owner: tenant,
            OwnerType: PermissionDomains.Tenant
        });

        response.status(200).json(res);
    } catch (e) {
        handleApiError(e, response);
    }
}

async function createMemberInvitation(req: Request, response: Response) {
    const client = provideClient(req);
    try {
        const { displayName, email, phone, captcha, errorRedirect, onboardRedirect, redirectUrl } = req.body;
        const tenant = Number(req.params['id']);
        await client.tenants.InviteNewMember(tenant, {
            captcha, displayName, email, phone, errorRedirect, onboardRedirect, redirectUrl
        });
        return await findTenantMemberships(req, response);
    } catch (e) {
        handleApiError(e, response);
    }
}

async function findTenantMemberships(req: Request, response: Response) {
    const client = provideClient(req);
    try {
        const tenantId = req.params['id']
        const res = await client.tenants.LookupTenantMembers(Number(tenantId));
        response.json(res.members)
    } catch (e) {
        handleApiError(e, response);
    }
}

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
router.get('/:id/memberships', auth, findTenantMemberships);
router.post('/:id/invite', auth, createMemberInvitation);
router.get('/:id/settings', auth, getSettings);

export const handler = prepareHandler('tenants', router);
