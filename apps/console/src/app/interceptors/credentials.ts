import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, EMPTY, switchMap, throwError } from 'rxjs';
import { SignedOut } from '@state/auth/actions';

export const credentialInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(Store);
  if (request.url.startsWith(environment.apiOrigin)) {
    return next(request.clone({ withCredentials: true })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return store.dispatch(SignedOut).pipe(
            switchMap(() => EMPTY)
          );
        }
        return throwError(() => error);
      })
    );
  }
  return next(request);
}
