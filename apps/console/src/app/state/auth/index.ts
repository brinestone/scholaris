import { inject, Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { AuthStateModel } from '../../../types';
import { AuthService } from '@services/auth.service';
import { CredentialSignIn, SignedOut } from './actions';
import { Navigate } from '@ngxs/router-plugin';
import { tap } from 'rxjs';
import { patch } from '@ngxs/store/operators';
import { AuthStateModelSchema } from '../../../schemas';

export const AUTH_STATE = new StateToken<AuthStateModel>('auth')
type Context = StateContext<AuthStateModel>;

@State({
  name: AUTH_STATE,
  defaults: { isSignedIn: false }
})
@Injectable()
export class AuthState {
  private authService = inject(AuthService);

  @Action(CredentialSignIn, { cancelUncompleted: true })
  onCredentialSignIn(ctx: Context, { email, password }: CredentialSignIn) {
    return this.authService.credentialSignIn(email, password).pipe(
      tap(data => ctx.setState(patch(AuthStateModelSchema.parse({
        ...data,
        isSignedIn: true
      }))))
    )
  }

  @Action(SignedOut)
  onSignedOut(ctx: Context) {
    ctx.setState({ isSignedIn: false });
    ctx.dispatch(new Navigate(['/']));
  }
}
