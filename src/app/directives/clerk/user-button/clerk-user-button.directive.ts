import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

@Directive({
  selector: '[clUserButton]',
  standalone: true
})
export class ClerkUserButtonDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    this.clerk.mountUserButton(this.el.nativeElement);
  }
}
