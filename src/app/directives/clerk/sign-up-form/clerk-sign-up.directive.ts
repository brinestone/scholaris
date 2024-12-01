import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

@Directive({
  selector: '[clClerkSignUp]',
  standalone: true
})
export class ClerkSignUpDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    this.clerk.mountSignUp(this.el.nativeElement);
  }
}
