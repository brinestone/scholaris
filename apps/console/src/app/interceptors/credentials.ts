import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SignedOut } from '@state/auth/actions';
import { accessToken } from '@state/selectors';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';

export const credentialInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(Store);
  const token = store.selectSnapshot(accessToken);
  if (request.url.startsWith(environment.apiOrigin)) {
    return next(request.clone({ setHeaders: { authorization: `Bearer ${token}` } })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return store.dispatch(SignedOut).pipe(
            switchMap(() => EMPTY)
          );
        }
        return throwError(() => error.error ?? error);
      })
    );
  }
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => throwError(() => error.error ?? error))
  );
}
