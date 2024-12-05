import { CreateTenant, TENANTS } from '@/app/state';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, dispatch, ofActionCompleted, ofActionDispatched, Store } from '@ngxs/store';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { catchError, concatMap, identity, map, merge, mergeMap, Observable, of, switchMap, timer } from 'rxjs';

function isNameAvailable(evaluator: (value: string) => Observable<{ available: boolean }>): AsyncValidatorFn {
  const failedValue = { nameUnavailable: true };
  return control => {
    if (!control.value) return of(failedValue);
    return timer(500).pipe(
      switchMap(() => evaluator(control.value)),
      map(({ available }) => available ? null : failedValue),
      catchError(() => of(failedValue))
    );
  }
}

@Component({
  selector: 'sc-new-tenant',
  standalone: true,
  imports: [Button, InputText, Message, Fluid, Tag, Divider, ReactiveFormsModule, RecaptchaV3Module],
  templateUrl: './new-tenant.component.html',
  styleUrl: './new-tenant.component.scss'
})
export class NewTenantComponent {
  private readonly http = inject(HttpClient);
  private readonly actions$ = inject(Actions);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly navigate = dispatch(Navigate);
  private readonly location = inject(Location);
  private readonly createTenant = dispatch(CreateTenant);
  private readonly recaptchaService = inject(ReCaptchaV3Service);
  readonly form = new FormGroup({
    name: new FormControl<string>('', [Validators.required,], [isNameAvailable(v => this.http.get<{ available: boolean }>('/api/tenants/name-available', { params: { name: v.trim() } }))])
  });
  readonly submitting = toSignal(merge([
    this.actions$.pipe(ofActionDispatched(CreateTenant), map(() => true)),
    this.actions$.pipe(ofActionCompleted(CreateTenant), map(() => false))
  ]).pipe(mergeMap(identity)));
  readonly errorMessage = signal('');

  onBackButtonClicked() {
    this.location.back();
  }

  onFinishButtonClicked() {
    this.errorMessage.set('');
    this.recaptchaService.execute('new_tenant').pipe(
      concatMap(token => this.createTenant(token, String(this.form.value.name)))
    ).subscribe({
      error: ({ message }: Error) => this.errorMessage.set(message),
      complete: () => {
        const focused = this.store.selectSnapshot(TENANTS).focus;
        this.navigate(['..', focused], undefined, { relativeTo: this.route });
      }
    })
  }
}
