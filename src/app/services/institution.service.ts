import { dto } from "@/lib/api";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: null })
export class InstitutionService {
    private readonly http = inject(HttpClient);

    loadSubscribed() {
        return this.http.get<dto.InstitutionLookup[]>('/api/institutions', { params: { subscribedOnly: true } })
    }
}
