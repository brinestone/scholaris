import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'sc-forbidden',
  standalone: true,
  imports: [Button, RouterLink],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {
  readonly location = inject(Location);
  onBackButtonClicked() {
    this.location.back();
  }
}
