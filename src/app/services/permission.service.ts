import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PermissionService {
    private http = inject(HttpClient);

    getPermissionsInDomain(domain: string, identifier: string) {
        return this.http.get<string[]>('/api/permissions/get-relations', {
            params: {
                domain,
                id: identifier
            }
        })
    }

    listRelations(targetDomain: string, targetIdentifier: string, relations: string[]) {
        return this.http.get<{ allowed: boolean }>('/api/permissions/check-relations', {
            params: {
                id: targetIdentifier,
                domain: targetDomain,
                relations: relations.join(',')
            }
        })
    }
}
