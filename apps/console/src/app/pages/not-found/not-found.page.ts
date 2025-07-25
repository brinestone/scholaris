import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxFuzzyTextComponent } from '@omnedia/ngx-fuzzy-text';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgxFuzzyTextComponent,
    RouterLink,
    HlmButtonDirective
  ],
  template: `
    <div class="space-y-4">
      <div class="text-[12rem] font-extrabold flex justify-center">
        <om-fuzzy-text
          [text]="'404'"
          [baseIntensity]="0.18"
          [hoverIntensity]="0.5"
          [enableHover]="true"
          [fuzzRange]="30"
          styleClass="custom-fuzzy"
        />
      </div>
      <p class="text-muted-foreground text-lg text-center">The page you requested does not exists or has moved.</p>
      <div class="flex justify-center gap-3 items-center">
        <button hlmBtn routerLink="/" size="sm" class="font-semibold">Go to Homepage</button>
        <button hlmBtn variant="outline" size="sm" class="font-semibold" (click)="location.back()">Go back</button>
      </div>
    </div>

  `,
  styleUrl: './not-found.page.scss'
})
export class NotFoundPage {
  readonly location = inject(Location);
}
