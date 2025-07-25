import { createPropertySelectors } from '@ngxs/store';
import { AUTH_STATE } from '@state/auth';

const authSlices = createPropertySelectors(AUTH_STATE);

export const isSignedIn = authSlices.isSignedIn;
