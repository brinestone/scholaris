import { PermissionDomains, TenantPermissions } from "@/lib/permissions";
import { PermissionDescription } from "@/models/permission-description";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";

function extractIdentifier(route: ActivatedRouteSnapshot) {
    return route.parent?.paramMap.get('id');
}

const targetDomain = PermissionDomains.Tenant;

export const tenantPageRoutes: Routes = [
    {
        path: 'overview',
        title: 'Overview',
        data: { icon: 'pi pi-map' },
        loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent)
    },
    {
        path: 'members-and-roles',
        title: 'Members & Roles',
        data: {
            icon: 'pi pi-users',
            permissions: {
                permissions: [TenantPermissions.CanViewMembers],
                targetDomain,
                extractIdentifier,
            } as PermissionDescription
        },
        loadComponent: () => import('./members/members.component').then(m => m.MembersComponent)
    },
    {
        path: 'institutions',
        title: 'Institutions',
        data: {
            icon: 'pi pi-building',
            permissions: {
                permissions: [TenantPermissions.CanViewInstitutions],
                targetDomain,
                extractIdentifier
            } as PermissionDescription
        },
        loadComponent: () => import('./institutions/institutions.component').then(m => m.InstitutionsComponent)
    },
    {
        path: 'settings',
        title: 'Settings',
        data: {
            icon: 'pi pi-cog',
            permissions: {
                permissions: [TenantPermissions.CanViewSettings],
                targetDomain,
                extractIdentifier
            } as PermissionDescription
        },
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent)
    },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
]
