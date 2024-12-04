import { provideStore } from '@ngxs/store';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { environment } from 'src/environments/environment.development';
import { routes } from './app.routes';
import { provideClerk, provideDefaultTitleStrategy } from './providers';
import { themePreset } from './theming';
import { provideCountryData } from './services';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCountryData(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: themePreset,
        options: {
          darkModeSelector: 'system',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    provideClerk(environment.clerkPublishableKey),
    provideDefaultTitleStrategy(),
    provideStore([],
      withNgxsStoragePlugin({ keys: [] }),
      withNgxsLoggerPlugin({ disabled: !isDevMode() }),
      withNgxsRouterPlugin(),
      withNgxsReduxDevtoolsPlugin({ disabled: !isDevMode() })
    )
  ]
};
