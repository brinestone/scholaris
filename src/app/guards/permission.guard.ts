import { PermissionDescription } from '@/models/permission-description';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RefreshDomainPermissions, selectDomainPermissionsFor } from '../state';
import { map } from 'rxjs';

export const permissionGuard = (redirectTo: string) => (route: ActivatedRouteSnapshot) => {
    if (!route.data?.['permissions']) return true;

    const router = inject(Router);
    const errorRedirect = router.createUrlTree([redirectTo]);
    const { permissions, extractIdentifier, targetDomain } = route.data['permissions'] as PermissionDescription;
    const store = inject(Store);
    const identifier = extractIdentifier(route);
    const currentPermissions = store.selectSnapshot(selectDomainPermissionsFor(targetDomain, identifier));
    const validate = (p: string[]) => {
        return permissions.every(x => p.includes(x)) ? true : errorRedirect;
    };
    if (currentPermissions.length == 0) {
        return store.dispatch(new RefreshDomainPermissions(targetDomain, identifier)).pipe(
            map(() => store.selectSnapshot(selectDomainPermissionsFor(targetDomain, identifier))),
            map(validate)
        )
    }
    return validate(currentPermissions);
}
