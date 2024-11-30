import { ClerkSignInFormDirective } from '@/app/directives/clerk/sign-in-form/clerk-sign-in-form.directive';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ClerkSignInFormDirective],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

}
