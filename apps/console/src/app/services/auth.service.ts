import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeApiUrl } from '@state/utils';
import { Principal } from '../../types';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  credentialSignIn(email: string, password: string) {
    return this.http.post<Principal>(makeApiUrl('/auth/login'), { email, password }, { observe: 'response' }).pipe(
      map(response => {
        const sessionId = response.headers.get('x-session-id') as string;
        const expiresAt = response.headers.get('x-session-expires-at') as string;
        return { ...response.body, sessionId, sessionExpiresAt: expiresAt }
      })
    );
  }
}
