import { dto } from "@/lib/api";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, switchMap } from "rxjs";
import { handleErrorResponse } from "src/utils/handle-http-error";

@Injectable({ providedIn: 'root' })
export class TenantService {
    private http = inject(HttpClient);

    loadSettings(id: number) {
        return this.http.get<dto.GetSettingsResponse>(`/api/tenants/${id}/settings`);
    }

    createMemberInvitation(id: number, captcha: string, errorRedirect: string, onboardRedirect: string, redirectUrl: string, displayName: string, email: string, phone?: string) {
        return this.http.post<dto.TenantMembershipLookup[]>(`/api/tenants/${id}/invite`, {
            displayName,
            email,
            phone,
            captcha,
            errorRedirect,
            onboardRedirect,
            redirectUrl
        }).pipe(
            catchError(handleErrorResponse)
        )
    }

    loadMemberships(id: number) {
        return this.http.get<dto.TenantMembershipLookup[]>(`/api/tenants/${id}/memberships`).pipe(
            catchError(handleErrorResponse)
        )
    }

    lookupTenant(id: number) {
        return this.http.get<dto.TenantLookup>(`/api/tenants/${id}`).pipe(
            catchError(handleErrorResponse)
        );
    }

    createTenant(name: string, captcha: string) {
        return this.http.post('/api/tenants', { name, captcha }).pipe(
            switchMap(() => this.loadSubscribedTenants()),
            catchError(handleErrorResponse)
        );
    }

    loadSubscribedTenants() {
        return this.http.get<dto.TenantLookup[]>('/api/tenants').pipe(
            catchError(handleErrorResponse)
        );
    }
}
