import { Routes } from '@angular/router';
import { LOCAL_STORAGE_ENGINE, withStorageFeature } from '@ngxs/storage-plugin';
import { signedInGuard } from './guards/signed-in.guard';
import { provideTenantState, TENANTS } from './state';
import { INSTITUTIONS, provideInstitutionState } from './state/institutions/state';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const tenantState = provideTenantState(withStorageFeature([{
    engine: LOCAL_STORAGE_ENGINE,
    key: TENANTS
}]));
const institutionState = provideInstitutionState(withStorageFeature([{
    engine: LOCAL_STORAGE_ENGINE,
    key: INSTITUTIONS
}]))

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth.routes') },
    {
        providers: [tenantState, institutionState], path: 'overview', title: 'Overview', canActivate: [signedInGuard], loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
    },
    {
        providers: [tenantState, institutionState],
        path: 'tenants',
        loadChildren: () => import('./tenant.routes'),
        canActivateChild: [signedInGuard]
    },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: '**', loadComponent: () => NotFoundComponent }
];
