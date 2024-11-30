import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { themePreset } from './theming';
import { provideClerk } from './providers';
import { environment } from 'src/environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: themePreset,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'primeng, tailwind-base, tailwind-utilities'
          }
        }
      }
    }),
    provideClerk(environment.clerkPublishableKey)
  ]
};
