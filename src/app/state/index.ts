import { createPropertySelectors, Selector } from '@ngxs/store';
import { TENANTS } from './tenants/state';
import { dto } from '@/lib/api';
import { INSTITUTIONS } from './institutions/state';

export * from './tenants/actions';
export * from './tenants/state';
export * from './institutions/actions';

export class Selectors {
    private static tenants = createPropertySelectors(TENANTS);
    private static institutions = createPropertySelectors(INSTITUTIONS);

    @Selector([Selectors.tenants.subscribed])
    static subscribedTenants(s: dto.TenantLookup[]) {
        return s;
    }

    @Selector([Selectors.institutions.subscribed])
    static subscribedInstitutions(s: dto.InstitutionLookup[]) {
        return s
    }
}
