import { RecentsFeedComponent } from '@/app/components/recents-feed';
import { ShellComponent, ShellLeftNavComponent } from '@/app/components/shell';
import { UserSessionScoreComponent } from '@/app/components/user-session-score';
import { ClerkUserAvatarDirective, ClerkUserDisplayNameDirective, ClerkUserEmailAddressDirective } from '@/app/directives/clerk';
import { LoadInstitutions, LoadTenants, Selectors } from '@/app/state';
import { NgClass, SlicePipe } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Actions, ofActionCompleted, ofActionDispatched, select, Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { Skeleton } from 'primeng/skeleton';
import { identity, map, merge, mergeAll, mergeMap } from 'rxjs';


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [Fluid, NgClass, SlicePipe, Skeleton, UserSessionScoreComponent, RouterLink, ButtonModule, RecentsFeedComponent, ShellComponent, ClerkUserEmailAddressDirective, ClerkUserDisplayNameDirective, ClerkUserAvatarDirective, ShellLeftNavComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements AfterViewInit {
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  showingAllTenants = false;
  showingAllInstitutions = false;
  readonly hasRecentPerformances = signal(false);
  readonly tenants = select(Selectors.subscribedTenants);
  readonly institutions = select(Selectors.subscribedInstitutions);
  readonly loadingTenants = toSignal(merge([
    this.actions$.pipe(ofActionDispatched(LoadTenants), map(() => true)),
    this.actions$.pipe(ofActionCompleted(LoadTenants), map(() => false))
  ]).pipe(mergeMap(identity)));

  readonly loadingInstitutions = toSignal(merge([
    this.actions$.pipe(ofActionDispatched(LoadInstitutions), map(() => true)),
    this.actions$.pipe(ofActionCompleted(LoadInstitutions), map(() => false))
  ]).pipe(mergeMap(identity)))

  ngAfterViewInit(): void {
    this.store.dispatch([LoadInstitutions, LoadTenants]);
  }
}
