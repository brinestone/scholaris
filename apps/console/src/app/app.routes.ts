import { Routes } from '@angular/router';
import { signedInGuard } from './guards/signed-in-guard';

const isSignedIn = signedInGuard('/auth/sign-in');

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth.layout').then(m => m.AuthLayout),
    loadChildren: () => import('./auth.routes').then(m => m.authRoutes)
  },
  {
    canActivate: [isSignedIn],
    path: 'overview',
    title: 'Overview',
    loadComponent: () => import('./pages/overview/overview.page').then(m => m.OverviewPage),
  },
  {
    path: '', pathMatch: 'full', redirectTo: 'overview'
  },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage) },
];
