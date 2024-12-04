import { TenantService } from "@/app/services";
import { dto } from "@/lib/api";
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders } from "@angular/core";
import { Action, provideStates, State, StateContext, StateToken } from "@ngxs/store";
import { patch } from "@ngxs/store/operators";
import { tap } from "rxjs";
import { LoadTenants } from "./actions";

export type TenantStateModel = {
    subscribed: dto.TenantLookup[];
    focus?: number;
}

export const TENANTS = new StateToken<TenantStateModel>('tenants');

type Context = StateContext<TenantStateModel>;

@Injectable()
@State({
    name: TENANTS,
    defaults: {
        subscribed: []
    }
})
class TenantState {
    private tenantService = inject(TenantService);

    @Action(LoadTenants)
    onLoadTenants(ctx: Context) {
        return this.tenantService.loadSubscribedTenants().pipe(
            tap(subscribed => ctx.setState(patch({
                subscribed
            })))
        )
    }
}

export function provideTenantState(...features: EnvironmentProviders[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        provideStates([TenantState], ...features)
    ]);
}
