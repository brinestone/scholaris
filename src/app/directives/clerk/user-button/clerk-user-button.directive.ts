import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Clerk } from '@clerk/clerk-js';

@Directive({
  selector: '[clUserButton]',
  standalone: true
})
export class ClerkUserButtonDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLDivElement>);
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    this.clerk.mountUserButton(this.el.nativeElement);
  }
  ngOnDestroy(): void {
    this.clerk.unmountUserButton(this.el.nativeElement);
  }
}

@Directive({
  selector: '[clAvatar]',
  standalone: true
})
export class ClerkUserAvatarDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLImageElement>);
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    const url = this.clerk.user?.imageUrl;
    this.el.nativeElement.src = url;
    this.el.nativeElement.alt = this.clerk.user?.fullName;
  }
}

@Directive({
  selector: '[clUserDisplayName]',
  standalone: true
})
export class ClerkUserDisplayNameDirective implements OnInit {
  private readonly el = inject(ElementRef)
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    const name = this.clerk.user?.fullName;
    this.el.nativeElement.textContent = name;
  }
}

@Directive({
  selector: '[clUserEmail]',
  standalone: true
})
export class ClerkUserEmailAddressDirective implements OnInit {
  private readonly el = inject(ElementRef)
  private readonly clerk = inject(Clerk);
  ngOnInit(): void {
    const name = this.clerk.user?.primaryEmailAddress?.emailAddress;
    this.el.nativeElement.textContent = name;
  }
}
