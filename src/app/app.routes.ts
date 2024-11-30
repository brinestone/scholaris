import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth.routes') },
    { path: '', component: OverviewComponent }
];
