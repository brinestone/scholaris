import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AUTH_STATE, AuthState } from '@state/auth';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { LOCAL_STORAGE_ENGINE, withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialInterceptor } from './interceptors/credentials';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideStore([AuthState],
      withNgxsLoggerPlugin({ disabled: !isDevMode() }),
      withNgxsRouterPlugin(),
      withNgxsReduxDevtoolsPlugin({ disabled: !isDevMode() }),
      withNgxsStoragePlugin({
        keys: [{ key: AUTH_STATE, engine: LOCAL_STORAGE_ENGINE }],
      })
    ),
    provideHttpClient(withInterceptors([credentialInterceptor]))
  ]
};
