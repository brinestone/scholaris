import { TenantService } from "@/app/services";
import { dto } from "@/lib/api";
import { PermissionDomains } from "@/lib/permissions";
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders } from "@angular/core";
import { Action, provideStates, State, StateContext, StateToken } from "@ngxs/store";
import { append, patch } from "@ngxs/store/operators";
import { EMPTY, tap } from "rxjs";
import { RefreshDomainPermissions } from "../permissions/actions";
import { CreateTenant, FocusTenant, InviteNewMember, LoadMembers, LoadTenants, TenantChanged } from "./actions";
import { SignedOut } from "../user/actions";

export type TenantStateModel = {
    subscribed: dto.TenantLookup[];
    members: dto.TenantMembershipLookup[];
    focus?: number | string;
}

export const TENANTS = new StateToken<TenantStateModel>('tenants');

type Context = StateContext<TenantStateModel>;

const defaultState = {
    subscribed: [],
    members: []
};
@Injectable()
@State({
    name: TENANTS,
    defaults: defaultState
})
class TenantState {
    private tenantService = inject(TenantService);

    @Action(SignedOut)
    onUserSignedOut(ctx: Context) {
        ctx.setState(defaultState);
    }

    @Action(InviteNewMember)
    onInviteNewMember(ctx: Context, { captcha, displayName, email, errorRedirect, onboardingRedirect, successRedirect, phone }: InviteNewMember) {
        const { focus } = ctx.getState();
        if (!focus) {
            ctx.setState(patch({ members: [] }))
            return EMPTY;
        }

        return this.tenantService.createMemberInvitation(Number(focus), captcha, errorRedirect, onboardingRedirect, successRedirect, displayName, email, phone).pipe(
            tap(members => ctx.setState(patch({ members })))
        )
    }

    @Action(LoadMembers)
    onLoadMembers(ctx: Context) {
        const { focus } = ctx.getState();
        if (!focus) {
            ctx.setState(patch({ members: [] }))
            return EMPTY;
        };

        return this.tenantService.loadMemberships(Number(focus)).pipe(
            tap(members => ctx.setState(patch({ members })))
        )
    }

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
        if (id !== undefined)
            ctx.dispatch(new RefreshDomainPermissions(PermissionDomains.Tenant, id));
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
