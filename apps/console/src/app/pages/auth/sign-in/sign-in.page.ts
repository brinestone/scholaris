import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { bootstrapGoogle } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Navigate } from '@ngxs/router-plugin';
import { dispatch } from '@ngxs/store';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmErrorDirective, HlmFormFieldComponent } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmSeparatorDirective } from '@spartan-ng/helm/separator';
import { CredentialSignIn } from '@state/auth/actions';
import { isActionLoading } from '@state/utils';
import { toast } from 'ngx-sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.email(),
  password: z.string().nonempty()
});

@Component({
  selector: 'app-sign-in',
  viewProviders: [
    provideIcons({ bootstrapGoogle }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  imports: [
    HlmCardImports,
    NgIcon,
    HlmButtonDirective,
    HlmFormFieldComponent,
    HlmInputDirective,
    FormsModule,
    ReactiveFormsModule,
    HlmErrorDirective,
    BrnSeparatorComponent,
    HlmSeparatorDirective,
    RouterLink
  ],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss'
})
export class SignInPage {
  readonly altMethods = [
    { label: 'Google', icon: 'bootstrapGoogle', handler: this.onGoogleSignInClicked.bind(this) }
  ];

  readonly form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  readonly signingIn = isActionLoading(CredentialSignIn);
  readonly route = inject(ActivatedRoute);
  private credentialSignIn = dispatch(CredentialSignIn)
  private navigate = dispatch(Navigate);

  onGoogleSignInClicked() {
    alert('Feature coming soon');
  }

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
    const { email, password } = formSchema.parse(this.form.value);
    this.credentialSignIn(email, password).subscribe({
      error: (error: Error) => {
        toast.error('Could not sign in', { description: error.message });
      },
      complete: () => {
        const redirect = decodeURIComponent(this.route.snapshot.queryParamMap.get('continue') ?? '/');
        this.navigate([redirect]);
      }
    });
  }
}
