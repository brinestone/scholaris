import { TenantService } from "@/app/services";
import { dto } from "@/lib/api";
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders } from "@angular/core";
import { Action, provideStates, State, StateContext, StateToken } from "@ngxs/store";
import { append, patch } from "@ngxs/store/operators";
import { EMPTY, tap } from "rxjs";
import { CreateTenant, FocusTenant, LoadTenants, TenantChanged } from "./actions";

export type TenantStateModel = {
    subscribed: dto.TenantLookup[];
    focus?: number | string;
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

    @Action(FocusTenant)
    onFocusTenant(ctx: Context, { id }: FocusTenant) {
        const { subscribed } = ctx.getState();
        ctx.setState(patch({
            focus: id
        }));

        if (id !== undefined && !subscribed.some(({ id: _id }) => _id == id)) {
            return this.tenantService.lookupTenant(Number(id)).pipe(
                tap(lookup => ctx.setState(patch({
                    subscribed: append([lookup])
                }))),
                tap(() => ctx.dispatch(TenantChanged))
            );
        }
        ctx.dispatch(TenantChanged);
        return EMPTY;
    }

    @Action(CreateTenant)
    onCreateTenant(ctx: Context, { captcha, name }: CreateTenant) {
        return this.tenantService.createTenant(name, captcha).pipe(
            tap(subscribed => ctx.setState(patch({
                subscribed,
                focus: subscribed.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())[0].id
            })))
        )
    }

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
