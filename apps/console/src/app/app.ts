import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterComponent } from '@spartan-ng/helm/sonner';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterComponent],
  template: `
    <hlm-toaster [position]="isPortrait() ? 'top-center' : 'bottom-right'"/>
    <router-outlet/>
  `,
  styleUrl: './app.scss'
})
export class App {
  readonly observer = inject(BreakpointObserver);
  readonly isPortrait = toSignal(this.observer.observe([
    Breakpoints.HandsetPortrait
  ]).pipe(
    map(s => s.matches)
  ), { initialValue: false })
}
