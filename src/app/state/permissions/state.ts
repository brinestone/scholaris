import { del } from 'object-path-immutable';
import { PermissionService } from "@/app/services";
import { PermissionDomains } from "@/lib/index";
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders } from "@angular/core";
import { Action, provideStates, State, StateContext, StateToken } from "@ngxs/store";
import { patch } from "@ngxs/store/operators";
import moment from 'moment';
import { EMPTY, retry, tap } from "rxjs";
import { ClearPermissions, RefreshDomainPermissions } from "./actions";

export function serializeDomainParams(domain: PermissionDomains | string, identifier: number | string) {
    return [domain, identifier].join(':');
}

export type CachedPermissions = {
    permissions: string[];
    ttl: Date;
}

export type PermissionStateModel = Record<string, CachedPermissions>

export const PERMISSIONS = new StateToken<PermissionStateModel>('permissions');
type Context = StateContext<PermissionStateModel>;

@Injectable()
@State({
    name: PERMISSIONS,
    defaults: {}
})
class PermissionState {
    private readonly permissionService = inject(PermissionService);

    @Action(ClearPermissions)
    onClearPermissions(ctx: Context, { domain, identifier }: ClearPermissions) {
        const key = serializeDomainParams(domain, identifier);
        ctx.setState(del(ctx.getState(), key));
    }

    @Action(RefreshDomainPermissions, { cancelUncompleted: true })
    onRefreshDomainPermissions(ctx: Context, { domain, identifier }: RefreshDomainPermissions) {
        const key = serializeDomainParams(domain, identifier);
        const state = ctx.getState();
        const currentPermissions = state[key];
        if (currentPermissions && moment(currentPermissions.ttl).isSameOrAfter(moment())) {
            return EMPTY;
        }
        return this.permissionService.listPermissions(domain, String(identifier)).pipe(
            retry({ delay: 5000 }),
            tap(permissions => ctx.setState(patch({
                [key]: {
                    permissions,
                    ttl: moment().add(5, 'minutes').toDate()
                }
            })))
        )
    }
}

export function providePermissionState(...features: EnvironmentProviders[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStates([PermissionState], ...features)
    ]);
}
