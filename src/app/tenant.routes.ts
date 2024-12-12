import { Routes } from "@angular/router";
import { permissionGuard } from "./guards/permission.guard";
import { urlIdCheckMatchGuard } from "./guards/url-match.guard";
import { tenantPageRoutes } from "./pages/tenants/tenant/tenant-page.routes";
import { tenantPermissionResolver } from "./resolvers/tenant-permission.resolver";
import { PermissionDomains } from "@/lib/index";

const tenantRoutes: Routes = [
    {
        title: 'Your new Organization',
        path: 'new',
        loadComponent: () => import('@/app/pages/tenants').then(m => m.NewTenantComponent)
    },
    {
        path: ':id',
        canActivateChild: [permissionGuard('/forbidden')],
        canMatch: [urlIdCheckMatchGuard(/^\d+$/)],
        resolve: {
            permissions: tenantPermissionResolver('/forbidden', PermissionDomains.Tenant, 'id')
        },
        children: tenantPageRoutes,
        loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantComponent)
    },
    { path: '', pathMatch: 'full', loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantsComponent) }
];
export default tenantRoutes;
