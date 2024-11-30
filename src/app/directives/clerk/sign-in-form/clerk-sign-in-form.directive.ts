import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

@Directive({
  selector: '[clClerkSignIn]',
  standalone: true
})
export class ClerkSignInFormDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    this.clerk.mountSignIn(this.el.nativeElement);
  }
}
