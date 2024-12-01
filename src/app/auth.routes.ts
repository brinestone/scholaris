import { Routes } from "@angular/router";

const authRoutes: Routes = [
    { title: 'Create your Account', path: 'sign-up', loadComponent: () => import('./pages/auth/sign-up/sign-up.component').then(m => m.SignUpComponent) },
    { title: 'Sign into Scholaris', path: 'sign-in', loadComponent: () => import('./pages/auth/sign-in/sign-in.component').then(m => m.SignInComponent) },
    { path: '', pathMatch: 'full', redirectTo: 'sign-up' }
];
export default authRoutes;
