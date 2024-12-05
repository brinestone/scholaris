import { Routes } from "@angular/router";

export const tenantPageRoutes: Routes = [
    { path: 'overview', title: 'Overview', data: { icon: 'pi pi-map' }, loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent) },
    // { path: 'members-and-roles', title: 'Members & Roles', data: { icon: 'pi pi-users' }, loadComponent: () => import('./members/members.component').then(m => m.MembersComponent) },
    { path: '', redirectTo: 'overview', pathMatch: 'full' }
]
