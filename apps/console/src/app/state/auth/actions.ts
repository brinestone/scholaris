const prefix = '[auth]';

export class SignedOut {
  static type = `${prefix} signed-out`;
}

export class CredentialSignIn {
  static type = `${prefix} credential`;

  constructor(readonly email: string, readonly password: string) {
  }
}
