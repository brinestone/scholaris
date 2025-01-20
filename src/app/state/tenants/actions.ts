const prefix = '[tenants]';

export class LoadSettings {
    static type = `${prefix} load settings`;
}

export class InviteNewMember {
    static type = `${prefix} invite member`;
    constructor(readonly captcha: string, readonly email: string, readonly displayName: string, readonly onboardingRedirect: string, readonly errorRedirect: string, readonly successRedirect: string, readonly phone?: string) { }
}

export class LoadMembers {
    static type = `${prefix} load memberships`;
}
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
