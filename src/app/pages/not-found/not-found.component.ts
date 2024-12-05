import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'sc-not-found',
  standalone: true,
  imports: [Button, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private location = inject(Location);
  onGoBackButtonClicked() {
    this.location.back();
  }
}
