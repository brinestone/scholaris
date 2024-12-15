import { PermissionDomains } from "@/lib/permissions";

const prefix = '[permissions]';
export class RefreshDomainPermissions {
    static type = `${prefix} refresh`
    constructor(readonly domain: PermissionDomains, readonly identifier: number | string) { }
}

export class ClearPermissions {
    static type = `${prefix} clear`
    constructor(readonly domain: PermissionDomains, readonly identifier: number | string) { }
}
