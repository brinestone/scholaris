import { createSelector } from '@ngxs/store';
import moment from 'moment';
import { INSTITUTIONS } from './institutions/state';
import { CachedPermissions, PERMISSIONS, serializeDomainParams } from './permissions/state';
import { TENANTS } from './tenants/state';
import { PermissionDomains } from '@/lib/index';

export * from './institutions/actions';
export * from './institutions/state';
export * from './permissions/actions';
export * from './permissions/state';
export * from './tenants/actions';
export * from './tenants/state';

export function selectDomainPermissionsFor(domain: PermissionDomains, id: string | number) {
    const key = serializeDomainParams(domain, id);
    return createSelector([PERMISSIONS], (state) => {
        const permissions = state[key];
        if (!permissions || moment(permissions.ttl).isBefore(moment())) {
            return [];
        }
        return permissions.permissions;
    })
}

export const focusedTenantPermissions = createSelector([PERMISSIONS, TENANTS], (permissionState, tenantState) => {
    const focusedTenant = tenantState.focus;
    if (focusedTenant === undefined) return Array<string>();

    const key = serializeDomainParams(PermissionDomains.Tenant, focusedTenant);
    const permissions = permissionState[key] as CachedPermissions | undefined;
    if (!permissions || moment(permissions.ttl).isBefore(moment())) {
        return [];
    }
    return permissions.permissions;
})

export const focusedTenant = createSelector([TENANTS], ({ focus, subscribed }) => {
    return subscribed.find(t => t.id == focus);
});

export const subscribedTenants = createSelector([TENANTS], ({ subscribed }) => subscribed);

export const subscribedInstitutions = createSelector([INSTITUTIONS], ({ subscribed }) => subscribed);
