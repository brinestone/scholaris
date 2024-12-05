import { dto } from "@/lib/api";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, switchMap } from "rxjs";
import { handleErrorResponse } from "src/utils/handle-http-error";

@Injectable({ providedIn: 'root' })
export class TenantService {
    private http = inject(HttpClient);

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
