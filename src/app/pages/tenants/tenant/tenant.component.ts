import { ShellComponent } from '@/app/components/shell';
import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet, Routes } from '@angular/router';
import { injectParams } from 'ngxtension/inject-params';

import { FocusTenant, selectDomainPermissionsFor, subscribedTenants } from '@/app/state';
import { PermissionDomains } from '@/lib/index';
import { FormsModule } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { dispatch, select } from '@ngxs/store';
import { Button } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { concatMap } from 'rxjs';
import { ShellTopNav } from "../../../components/shell/shell.component";

@Component({
  selector: 'sc-tenant',
  standalone: true,
  imports: [ShellComponent, InplaceModule, TabsModule, FormsModule, RouterLink, RouterOutlet, ShellTopNav, Select, Button],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.scss'
})
export class TenantComponent {
  readonly route = inject(ActivatedRoute);
  private readonly navigate = dispatch(Navigate);
  private focus = dispatch(FocusTenant);
  readonly tenants = select(subscribedTenants)
  private readonly tenantId = injectParams('id') as Signal<string>;
  readonly tenantAsNumber = computed(() => Number(this.tenantId()));
  private permissions = select(selectDomainPermissionsFor(PermissionDomains.Tenant, this.tenantId()));
  readonly permittedTabs = computed(() => {
    const permissions = this.permissions();
    const children = (this.route.routeConfig?.children as Routes).filter(r => !r.redirectTo);
    const generalRoutes = children.filter(r => !r.data?.['permissions']);
    const privilegedRoutes = children.filter(r => r.data?.['permissions'] && (r.data['permissions'].permissions as string[]).every(p => permissions.includes(p)));

    return [...generalRoutes, ...privilegedRoutes];
  });
  constructor() {
    this.route.data.subscribe(console.log);
  }

  onFocusChanged(event: SelectChangeEvent) {
    this.focus(event.value).pipe(
      concatMap(() => this.navigate(['..', event.value], undefined, { relativeTo: this.route }))
    );
  }
}
