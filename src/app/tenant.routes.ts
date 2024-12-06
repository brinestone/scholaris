import { Routes } from "@angular/router";
import { tenantPageRoutes } from "./pages/tenants/tenant/tenant-page.routes";
import { urlIdCheckMatchGuard } from "./guards/url-match.guard";

const tenantRoutes: Routes = [
    { title: 'Your new Organization', path: 'new', loadComponent: () => import('@/app/pages/tenants').then(m => m.NewTenantComponent) },
    { path: ':id', canMatch: [urlIdCheckMatchGuard(/^\d+$/)], children: tenantPageRoutes, loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantComponent) },
    { path: '', pathMatch: 'full', loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantsComponent) }
];
export default tenantRoutes;
