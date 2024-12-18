import { PermissionDomains } from "@/lib/permissions";
import { ActivatedRouteSnapshot } from "@angular/router";

export type PermissionDescription = {
    permissions: string[];
    targetDomain: PermissionDomains;
    extractIdentifier: (route: ActivatedRouteSnapshot) => string;
}
