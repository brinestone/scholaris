import { Routes } from "@angular/router";

const authRoutes: Routes = [
    { path: 'sign-up', loadComponent: () => import('./pages/auth/sign-up/sign-up.component').then(m => m.SignUpComponent) },
    { path: '', pathMatch: 'full', redirectTo: 'sign-up' }
];
export default authRoutes;
