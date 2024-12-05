import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Clerk } from '@clerk/clerk-js';

export const signedInGuard: CanActivateFn = (route, state) => {
  const { isPublic } = route.data;
  if (isPublic === true) return true;

  const clerk = inject(Clerk);
  const router = inject(Router);
  if (!clerk.user) {
    const signInRedirect = new URL(clerk.buildSignInUrl({ redirectUrl: state.url }));
    const redirect = signInRedirect.pathname;
    const urlTree = router.createUrlTree(
      [redirect],
      {
        queryParams: {
          return_url: encodeURIComponent(state.url)
        },
        queryParamsHandling: 'merge'
      });
    return urlTree;
  }
  return true;
}
