import { PermissionDescription } from "@/models/permission-description";
import { Routes } from "@angular/router";

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
                permissions: ['can_view_members'],
                targetDomain: 'tenant',
                extractIdentifier: (route) => {
                    return route.parent?.paramMap.get('id') ?? null;
                },
            } as PermissionDescription
        },
        loadComponent: () => import('./members/members.component').then(m => m.MembersComponent)
    },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
]
