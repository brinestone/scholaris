import { InstitutionService } from "@/app/services";
import { dto } from "@/lib/api";
import { EnvironmentProviders, inject, Injectable, makeEnvironmentProviders } from "@angular/core";
import { Action, provideStates, State, StateContext, StateToken } from "@ngxs/store";
import { LoadInstitutions } from "./actions";
import { tap } from "rxjs";
import { patch } from "@ngxs/store/operators";

export type InstitutionStateModel = {
    subscribed: dto.InstitutionLookup[];
    focus?: number;
}
type Context = StateContext<InstitutionStateModel>;
export const INSTITUTIONS = new StateToken<InstitutionStateModel>('institutions')

@Injectable()
@State({
    name: INSTITUTIONS,
    defaults: {
        subscribed: []
    }
})
class InstitutionState {
    private service = inject(InstitutionService);

    @Action(LoadInstitutions)
    onLoadInstitutions(ctx: Context) {
        return this.service.loadSubscribed().pipe(
            tap(subscribed => ctx.setState(patch({
                subscribed
            })))
        )
    }
}

export function provideInstitutionState(...providers: EnvironmentProviders[]): EnvironmentProviders {
    return makeEnvironmentProviders([
        { provide: InstitutionService, },
        provideStates([InstitutionState], ...providers)
    ]);
}
