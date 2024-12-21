import { PermissionDescription } from '@/models/permission-description';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, map, of } from 'rxjs';
import { PermissionService } from '../services';
import { RefreshDomainPermissions, selectDomainPermissionsFor } from '../state';

export const tenantRootPermissionGuard = (redirectTo: string) => (route: ActivatedRouteSnapshot) => {
    if (!route.data?.['permissions']) return true;

    const router = inject(Router);
    const permissionService = inject(PermissionService);
    const errorRedirect = router.parseUrl(redirectTo);
    const { permissions, extractIdentifier, targetDomain } = route.data['permissions'] as PermissionDescription;
    return permissionService.check(targetDomain, extractIdentifier(route), permissions).pipe(
        map(({ allowed }) => allowed ? true : errorRedirect),
        catchError(() => {
            return of(errorRedirect);
        })
    );
}

export const tenantChildPermissionGuard = (redirectTo: string) => (route: ActivatedRouteSnapshot) => {
    if (!route.data?.['permissions']) return true;
    const validate = (p: string[]) => {
        return permissions.every(x => p.includes(x)) ? true : errorRedirect;
    };
    const router = inject(Router);
    const store = inject(Store);
    const errorRedirect = router.parseUrl(redirectTo);
    const { permissions, extractIdentifier, targetDomain } = route.data['permissions'] as PermissionDescription;
    const id = extractIdentifier(route);
    const currentPermissions = store.selectSnapshot(selectDomainPermissionsFor(targetDomain, id));
    if (currentPermissions.length == 0) {
        return store.dispatch(new RefreshDomainPermissions(targetDomain, id)).pipe(
            map(() => store.selectSnapshot(selectDomainPermissionsFor(targetDomain, id))),
            map(p => validate(p) ? true : errorRedirect),
            catchError(() => of(errorRedirect))
        )
    }

    return validate(currentPermissions);
}
