const prefix = '[tenants]'
export class LoadTenants {
    static type = `${prefix} load subscribed`;
}

export class CreateTenant {
    static type = `${prefix} create new`
    constructor(readonly captcha: string, readonly name: string) { }
}

export class FocusTenant {
    static type = `${prefix} focus`
    constructor(readonly id?: number | string) { }
}

export class TenantChanged {
    static type = `${prefix} focus changed`;
}
