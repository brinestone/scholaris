import { dto } from "@/lib/api";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TenantService {
    private http = inject(HttpClient);

    loadSubscribedTenants() {
        return this.http.get<dto.TenantLookup[]>('/api/tenants');
    }
}
