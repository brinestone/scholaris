import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { signedInGuard } from './guards/signed-in.guard';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth.routes') },
    { path: 'overview', title: 'Overview', canActivate: [signedInGuard], component: OverviewComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
];
