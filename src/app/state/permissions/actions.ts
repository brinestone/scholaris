import { PermissionDomains } from "@/lib/index";

const prefix = '[permissions]';
export class RefreshDomainPermissions {
    static type = `${prefix} refresh`
    constructor(readonly domain: PermissionDomains, readonly identifier: number | string) { }
}
