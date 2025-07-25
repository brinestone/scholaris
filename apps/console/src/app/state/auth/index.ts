import { Injectable } from '@angular/core';
import { State, StateToken } from '@ngxs/store';
import { AuthStateModel } from '../../../types';
import { AuthStateModelSchema } from '../../../schemas';

export const AUTH_STATE = new StateToken<AuthStateModel>('auth')

@State({
  name: AUTH_STATE,
  defaults: { isSignedIn: false }
})
@Injectable()
export class AuthState {

}
