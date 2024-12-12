import { PermissionDomains } from '@/lib/index';
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { catchError, concatMap, of } from 'rxjs';
import { FocusTenant, RefreshDomainPermissions, selectDomainPermissionsFor } from '../state';

export const tenantPermissionResolver: (redirect: string, domain: PermissionDomains, identifierParamKey: string) => ResolveFn<string[]> = (redirect: string, domain: PermissionDomains, identifierParamKey: string) => (route) => {
  const store = inject(Store);
  const router = inject(Router);
  const identifier = route.paramMap.get(identifierParamKey) as string;
  return store.dispatch([new FocusTenant(identifier), new RefreshDomainPermissions(domain, identifier)]).pipe(
    concatMap(() => store.selectOnce(selectDomainPermissionsFor(domain, identifier))),
    catchError(() => of(new RedirectCommand(router.parseUrl(redirect))))
  )
};
