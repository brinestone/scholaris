import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    @for (link of links; track $index) {
      <a class="text-sm underline" [routerLink]="link.path">{{ link.label }}</a>
    }
  `,
  styleUrl: './footer.scss'
})
export class Footer {
  readonly links = [
    { path: '/about', label: 'About us' },
    { path: '/contact', label: 'Contact us' },
    { path: '/tos', label: 'Legal' },
    { path: '/faq', label: 'FAQ' },
  ];
}
