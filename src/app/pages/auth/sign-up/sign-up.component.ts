import { ClerkSignUpDirective } from '@/app/directives/clerk/sign-up-form/clerk-sign-up.directive';
import { Component } from '@angular/core';

@Component({
    selector: 'app-sign-up',
    imports: [ClerkSignUpDirective],
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

}
