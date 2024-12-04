import { ClerkUserButtonDirective } from '@/app/directives/clerk';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { Component, HostBinding, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule, } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { TooltipModule } from 'primeng/tooltip'; import { Menu } from 'primeng/menu';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { PreferencesFormComponent } from '../preferences-form/preferences-form.component';

@Component({
  selector: 'sc-app-wide-alert',
  standalone: true,
  imports: [],
  template: `
    <ng-content/>
  `,
})
export class AppWideAlertComponent {
  @HostBinding('className')
  readonly cssClass = 'flex items-center justify-center py-1 text-sm font-medium bg-primary text-white row-start-1';
}

@Component({
  selector: 'sc-shell-left-nav',
  standalone: true,
  imports: [],
  template: `
      <ng-content/> 
  `,
  host: {
    '[class.border]': '!isSmallDisplay()',
    '[class.border-l-0]': '!isSmallDisplay()',
    '[class.border-y-0]': '!isSmallDisplay()',
    '[class.border-[var(--primary-text-color)]]': '!isSmallDisplay()',
    '[class.w-40]': '!isSmallDisplay()'
  }
})
export class ShellLeftNavComponent {
  @HostBinding('class')
  readonly cssClass = 'block col-start-1';
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly isSmallDisplay = toSignal(this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
    map(state => Object.values(state.breakpoints).reduce((a, b) => a || b))
  ));
}

@Component({
  selector: 'sc-shell-right-nav',
  standalone: true,
  imports: [],
  template: `
    <ng-content/>
  `
})
export class ShellRightNavComponent {
  @HostBinding('className')
  readonly cssClass = 'block border border-r-0 border-y-0 border-[var(--primary-text-color)] col-start-3';
}

@Component({
  selector: 'sc-shell-footer',
  standalone: true,
  imports: [],
  template: `
  <div class="container mx-auto">
    <ng-content/>
</div>
  `
})
export class ShellFooterComponent {
  @HostBinding('className')
  readonly cssClass = 'py-3 block border border-b-0 border-x-0 border-[var(--primary-text-color)] row-start-4';
}

@Component({
  selector: 'sc-shell',
  standalone: true,
  imports: [NgTemplateOutlet, Menu, PreferencesFormComponent, ButtonModule, ClerkUserButtonDirective, DialogModule, DrawerModule, RouterLink, TooltipModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly brandText = environment.appName
  readonly breadcrumbItems: MenuItem[] = [
    { id: 'tenant-selector' },
    { id: 'institution-selector' },
  ]
  readonly isSmallDisplay = toSignal(this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
    map(state => Object.values(state.breakpoints).reduce((a, b) => a || b))
  ));
  readonly showLeftDrawer = model(false);
  readonly showPrefsDialog = model(false);
  readonly newMenuItems: MenuItem[] = [
    { routerLink: '/institutions/new', icon: 'pi pi-building', label: 'Institution' },
    { routerLink: '/tenants/new', icon: 'pi pi-sitemap', label: 'Organization' }
  ]
}