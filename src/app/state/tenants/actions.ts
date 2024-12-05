const prefix = '[tenants]'
export class LoadTenants {
    static type = `${prefix} load subscribed`;
}

export class CreateTenant {
    static type = `${prefix} create new`
    constructor(readonly captcha: string, readonly name: string) { }
}
