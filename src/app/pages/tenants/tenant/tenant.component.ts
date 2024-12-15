import { ShellComponent } from '@/app/components/shell';
import { Component, computed, effect, inject, OnDestroy, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';
import { ProgressSpinner } from 'primeng/progressspinner';

import { ClearPermissions, focusedTenantPermissions, FocusTenant, subscribedTenants } from '@/app/state';
import { PermissionDescription } from '@/models/permission-description';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, dispatch, ofActionCompleted, ofActionDispatched, select } from '@ngxs/store';
import { Button } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { map, merge } from 'rxjs';
import { ShellTopNav } from "../../../components/shell/shell.component";
import { PermissionDomains } from '@/lib/permissions';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'sc-tenant',
  standalone: true,
  imports: [ShellComponent, ProgressSpinner,Tag, TabsModule, FormsModule, RouterLink, RouterOutlet, ShellTopNav, Select, Button],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.scss'
})
export class TenantComponent implements OnDestroy {
  readonly route = inject(ActivatedRoute);
  private readonly actions$ = inject(Actions);

  private readonly navigate = dispatch(Navigate);
  private readonly focus = dispatch(FocusTenant);
  private readonly clearPermissions = dispatch(ClearPermissions);
  readonly focusChanging = toSignal(merge(
    this.actions$.pipe(ofActionDispatched(FocusTenant), map(() => true)),
    this.actions$.pipe(ofActionCompleted(FocusTenant), map(() => false))
  ))

  readonly tenants = select(subscribedTenants);
  readonly permissions = select(focusedTenantPermissions);

  private readonly tenantId = injectParams('id') as Signal<string>;
  readonly tenant = computed(() => Number(this.tenantId()));

  readonly childRoutes = (this.route.routeConfig?.children ?? []).filter(r => !r.redirectTo)
  private readonly generalRoutes = this.childRoutes.filter(r => !r.data?.['permissions']);
  readonly permittedRoutes = computed(() => {
    const domainPermissions = this.permissions();
    const routes = this.childRoutes.filter(r => r.data?.['permissions'] && (r.data['permissions'] as PermissionDescription).permissions.every(p => domainPermissions.includes(p)));
    return routes;
  });
  readonly tabbedRoutes = computed(() => [...this.generalRoutes, ...this.permittedRoutes()]);

  ngOnDestroy(): void {
    this.focus();
    this.clearPermissions(PermissionDomains.Tenant, this.tenantId());
  }

  onFocusChanged(event: SelectChangeEvent) {
    this.navigate(['..', event.value], undefined, { relativeTo: this.route })
  }

  constructor() {
    effect(() => this.focus(this.tenantId()), { allowSignalWrites: true });
  }
}
