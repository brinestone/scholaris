import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const clerk = inject(Clerk);
  if (clerk.session) {
    return from(clerk.session.getToken()).pipe(
      switchMap(token => {
        if (token) {
          const headers = req.headers.append('authorization', `Bearer ${token}`);
          return next(req.clone({ headers }));
        }
        return next(req);
      })
    )
  }
  return next(req);
};
