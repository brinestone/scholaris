import { Routes } from "@angular/router";
import { urlIdCheckMatchGuard } from "./guards/url-match.guard";
import { tenantPageRoutes } from "./pages/tenants/tenant/tenant-page.routes";
import { PermissionDescription } from "../models";
import { PermissionDomains, TenantPermissions } from "@/lib/permissions";
import { tenantChildPermissionGuard, tenantRootPermissionGuard } from "./guards/permission.guard";

const tenantRoutes: Routes = [
    {
        title: 'Your new Organization',
        path: 'new',
        loadComponent: () => import('@/app/pages/tenants').then(m => m.NewTenantComponent)
    },
    {
        path: ':id',
        canActivate: [tenantRootPermissionGuard('/forbidden')],
        data: {
            permissions: {
                extractIdentifier: (route) => route.paramMap.get('id') as string,
                permissions: [TenantPermissions.CanView],
                targetDomain: PermissionDomains.Tenant
            } as PermissionDescription
        },
        canActivateChild: [tenantChildPermissionGuard('/forbidden')],
        canMatch: [urlIdCheckMatchGuard(/^\d+$/)],
        children: tenantPageRoutes,
        loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantComponent)
    },
    { path: '', pathMatch: 'full', loadComponent: () => import('@/app/pages/tenants').then(m => m.TenantsComponent) }
];
export default tenantRoutes;
