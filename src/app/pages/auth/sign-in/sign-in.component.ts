import { ClerkSignInFormDirective } from '@/app/directives/clerk';
import { Component } from '@angular/core';

@Component({
    selector: 'app-sign-in',
    imports: [ClerkSignInFormDirective],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

}
