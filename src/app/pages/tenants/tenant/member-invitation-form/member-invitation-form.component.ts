import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { Button } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';

@Component({
    selector: 'sc-member-invitation-form',
    imports: [ReactiveFormsModule, Message, Fluid, InputText, Button, RecaptchaV3Module],
    templateUrl: './member-invitation-form.component.html',
    styleUrl: './member-invitation-form.component.scss'
})
export class MemberInvitationFormComponent {
  private readonly recaptchaService = inject(ReCaptchaV3Service);
  private readonly dialogRef = inject(DynamicDialogRef);

  readonly errorMessage = signal('');
  readonly form = new FormGroup({
    displayName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email])
  });

  onFormSubmit(event: SubmitEvent) {
    event.preventDefault();
  }

  onSubmitButtonClicked() {
    this.errorMessage.set('');
    const { displayName, email } = this.form.value;
    this.recaptchaService.execute('tenant_member_invite').subscribe({
      error: ({ message }: Error) => {
        this.errorMessage.set(message);
      },
      next: captchaToken => {
        this.dialogRef.close({
          captchaToken, displayName, email
        });
      }
    })
  }
}
