import { Component } from '@angular/core';
import { HlmCardDirective, HlmCardImports } from '@spartan-ng/helm/card';
import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapGoogle } from '@ng-icons/bootstrap-icons';
import { HlmErrorDirective, HlmFormFieldComponent } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';

@Component({
  selector: 'app-sign-in',
  viewProviders: [
    provideIcons({ bootstrapGoogle }),
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
  ],
  imports: [
    HlmCardImports,
    NgIcon,
    BrnSeparatorComponent,
    HlmButtonDirective,
    HlmFormFieldComponent,
    HlmInputDirective,
    FormsModule,
    ReactiveFormsModule,
    HlmErrorDirective
  ],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
  hostDirectives: [HlmCardDirective]
})
export class SignInPage {
  readonly altMethods = [
    { label: 'Google', icon: 'bootstrapGoogle', handler: this.onGoogleSignInClicked.bind(this) }
  ];

  readonly form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onGoogleSignInClicked() {
    alert('Feature coming soon');
  }
}
