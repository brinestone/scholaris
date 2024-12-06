import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  private route = inject(ActivatedRoute);
  constructor() {
    console.log(this.route.snapshot);
  }
  onGoBackButtonClicked() {
    this.location.back();
  }
}
