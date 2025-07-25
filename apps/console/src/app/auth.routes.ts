import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    title: 'Connect to your Account',
    path: 'sign-in',
    loadComponent: () => import('./pages/auth/sign-in/sign-in.page').then(m => m.SignInPage)
  },
  {
    title: 'Join us today',
    path: 'sign-up',
    loadComponent: () => import('./pages/auth/sign-up/sign-up.page').then(m => m.SignUpPage)
  },
  { path: '', pathMatch: 'full', redirectTo: 'sign-in' }
];
