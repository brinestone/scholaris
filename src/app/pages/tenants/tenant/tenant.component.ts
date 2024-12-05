import { ShellComponent } from '@/app/components/shell';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

import { Selectors } from '@/app/state';
import { FormsModule } from '@angular/forms';
import { select } from '@ngxs/store';
import { TabsModule } from 'primeng/tabs';
import { ShellTopNav } from "../../../components/shell/shell.component";
import { InplaceModule } from 'primeng/inplace';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';

@Component({
  selector: 'sc-tenant',
  standalone: true,
  imports: [ShellComponent, InplaceModule, TabsModule, FormsModule, RouterLink, RouterOutlet, ShellTopNav, Select, Button],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.scss'
})
export class TenantComponent {
  readonly route = inject(ActivatedRoute);
  readonly defaultTabs = (this.route.routeConfig?.children ?? []).filter(r => r.data?.['isPrivileged'] !== true && !r.redirectTo)
  readonly privilegedTabs = (this.route.routeConfig?.children ?? []).filter(r => r.data?.['isPrivileged'] === true);
  readonly tenants = select(Selectors.subscribedTenants)
  readonly focusedTenant = select(Selectors.focusedTenant)
}
