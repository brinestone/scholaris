import { Routes } from "@angular/router";

const tenantRoutes: Routes = [
    { title: 'Your new Organization', path: 'new', loadComponent: () => import('@/app/pages/tenants').then(m => m.NewTenantComponent) },
    { path: '', pathMatch: 'full', loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantsComponent) }
];
export default tenantRoutes;
