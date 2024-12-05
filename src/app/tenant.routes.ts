import { Routes } from "@angular/router";
import { tenantPageRoutes } from "./pages/tenants/tenant/tenant-page.routes";

const tenantRoutes: Routes = [
    { path: ':id', children: tenantPageRoutes, loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantComponent) },
    { title: 'Your new Organization', path: 'new', loadComponent: () => import('@/app/pages/tenants').then(m => m.NewTenantComponent) },
    { path: '', pathMatch: 'full', loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantsComponent) }
];
export default tenantRoutes;
