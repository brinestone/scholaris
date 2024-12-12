import { PermissionDomains } from '@/lib/index';
import { createSelector } from '@ngxs/store';
import moment from 'moment';
import { INSTITUTIONS } from './institutions/state';
import { PERMISSIONS, serializeDomainParams } from './permissions/state';
import { TENANTS } from './tenants/state';

export * from './institutions/actions';
export * from './institutions/state';
export * from './permissions/actions';
export * from './permissions/state';
export * from './tenants/actions';
export * from './tenants/state';

export function selectDomainPermissionsFor(domain: PermissionDomains, id: string | number) {
    const key = serializeDomainParams(domain, id);
    return createSelector([PERMISSIONS], (state) => {
        const permissions = state.cachedPermissions[key];
        if (!permissions || moment(permissions.ttl).isBefore(moment())) {
            return [];
        }
        return permissions.permissions;
    })
}

export const focusedTenant = createSelector([TENANTS], ({ focus, subscribed }) => {
    return subscribed.find(t => t.id == focus);
});

export const subscribedTenants = createSelector([TENANTS], ({ subscribed }) => subscribed);

export const subscribedInstitutions = createSelector([INSTITUTIONS], ({ subscribed }) => subscribed);
