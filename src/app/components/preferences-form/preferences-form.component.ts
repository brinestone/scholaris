import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Select } from 'primeng/select';
import { map } from 'rxjs';

@Component({
  selector: 'sc-preferences-form',
  standalone: true,
  imports: [Select],
  templateUrl: './preferences-form.component.html',
  styleUrl: './preferences-form.component.scss'
})
export class PreferencesFormComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly isSmallDisplay = toSignal(this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
    map(state => Object.values(state.breakpoints).reduce((a, b) => a || b))
  ));
}
