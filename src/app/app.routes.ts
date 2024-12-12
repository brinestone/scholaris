import { Routes } from '@angular/router';
import { LOCAL_STORAGE_ENGINE, withStorageFeature } from '@ngxs/storage-plugin';
import { signedInGuard } from './guards/signed-in.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { INSTITUTIONS, PERMISSIONS, provideInstitutionState, providePermissionState, provideTenantState, TENANTS } from './state';

const tenantState = provideTenantState(withStorageFeature([{
    engine: LOCAL_STORAGE_ENGINE,
    key: TENANTS
}]));
const institutionState = provideInstitutionState(withStorageFeature([{
    engine: LOCAL_STORAGE_ENGINE,
    key: INSTITUTIONS
}]));
const permissionState = providePermissionState(withStorageFeature([
    { engine: LOCAL_STORAGE_ENGINE, key: PERMISSIONS }
]))

export const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth.routes') },
    {
        providers: [tenantState, institutionState], path: 'overview', title: 'Overview', canActivate: [signedInGuard], loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
    },
    {
        providers: [tenantState, institutionState, permissionState],
        path: 'tenants',
        loadChildren: () => import('./tenant.routes'),
        canActivateChild: [signedInGuard]
    },
    { path: 'forbidden', loadComponent: () => import('./pages/forbidden/forbidden.component').then(m => m.ForbiddenComponent) },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    { path: '**', loadComponent: () => NotFoundComponent }
];
