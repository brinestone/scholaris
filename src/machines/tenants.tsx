import { provideApiClientOnServer } from "@/helpers/client-provider";
import { APIError, dto } from "@/lib/api-sdk";
import { query } from "@solidjs/router";
import { assign, fromPromise, setup } from "xstate";

export type LoadSubscribedTenantsCommand = {
  type: "subscribed.load";
  page: number;
  size: number;
};

export type CreateTenantCommand = {
  type: "tenants.create";
  captcha: string;
  name: string;
};

export interface TenantMachineStateModel {
  currentPage: number;
  fetchSize: number;
  subscribed: dto.TenantLookup[];
  loadSubscribedRetryCount: number;
  subscribedAvailable: boolean;
  focused?: number;
  currentError?: APIError;
}

const fetchSubscribedTenantsServer = query(
  async (page: number, size: number) => {
    "use server";
    const client = provideApiClientOnServer();
    const { tenants } = await client.tenants.Lookup({ page, size });
    return tenants;
  },
  "find-subscribed-tenants"
);

const createNewTenant = query(async (captcha: string, name: string) => {
  "use server";
  const client = provideApiClientOnServer();
  await client.tenants.NewTenant({ captchaToken: captcha, name });
}, "new-tenant");

const maxLoadSubscribedRetries = 10;

export const tenantMachine = setup({
  schemas: {} as LoadSubscribedTenantsCommand | CreateTenantCommand,
  types: {
    context: {} as TenantMachineStateModel,
  },
  actors: {
    loadSubscribedTenants: fromPromise<
      dto.TenantLookup[],
      { page: number; size: number }
    >(async ({ input }) => {
      return fetchSubscribedTenantsServer(input.page, input.size);
    }),
    createNewTenant: fromPromise<void, { captcha: string; name: string }>(
      async ({ input }) => {
        return createNewTenant(input.captcha, input.name);
      }
    ),
  },
  guards: {
    ableToAutoloadSubscribed: ({
      context: { subscribedAvailable, loadSubscribedRetryCount },
    }) => {
      return (
        subscribedAvailable &&
        loadSubscribedRetryCount <= maxLoadSubscribedRetries
      );
    },
    ableToLoadSubscribed: ({ context: { subscribedAvailable } }) =>
      subscribedAvailable,
  },
  actions: {
    clearCurrentError: assign({
      currentError: undefined,
    }),
    incrementLoadSubscribedCount: assign({
      loadSubscribedRetryCount: ({ context: { loadSubscribedRetryCount } }) =>
        Math.min(loadSubscribedRetryCount + 1, maxLoadSubscribedRetries),
    }),
    logApiErrorMessage: ({ event }) => {
      console.error(event.error);
    },
    resetLoadSubscribedCount: assign({
      loadSubscribedRetryCount: 0,
      subscribedAvailable: true,
    }),
    updateSubscribedList: assign({
      subscribed: ({ event }) => {
        return event.output;
      },
    }),
    updateSubscribedAvailable: assign({
      subscribedAvailable: ({ event }) => {
        const err = event.error as APIError;
        return err.status != 404;
      },
    }),
    setCurrentError: assign({
      currentError: ({ event }) => {
        const err = event.error as APIError;
        return err;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcwDsCGbmwHQEsIAbMAYlgFcAjWAYwCd8rJciB7DCAbQAYBdRKAAObWPmT42aQSAAeiAMw8A7LgBsAJgCsPHlv1aAHMa0AaEAE9EhgIy4dunjZ4BOBYbUu1CgL4-zqJjYeIQkpIFYOLgMYBiovAJIICJiElIy8ghKqpoOBkYm5lYIGgAsLrilPLk6yi56NhqGfgHokXgxcfhoUAC0aGAA7qQQUmAEaABubADW4xHB0fSxEj39Qwjd07RdUgkJMiniktJJmfUV1doa1cYKTcpFiGUKuIYaXi4a98qe5TYtEALKKdVZ9AbDMD0ehsei4IREOIAM1hAFtcMCOssumsIZspmwdmk0Pt+IdRMd0mdEKVabgPmpjKUFFVlB9Sk8EDZ7rhHLoNDY1LpSt5SoDMbgIb1QZBSLJYMg4uMMEjUPQABQOACU4TaiylMu4ZKSR2JGUQjTc9LUWhtOlshlKdU5Ght9lt2i0pQ+CjUNvFeqi7E43T6lBoDCYstGAwm0zmGMDeGDEFDvXDdEYzAg+O2uxJ-AOJopZupXKUanpPAUNn0tKcZRcnK9PHduWUIqdLlKzX8QKTrA4qbWGcj2dIUJhcIRyLRiaCQaHadHWcgucJ+dJiWEJZO5q5Puttv0PAdXc5NoqXm0zmZLhshn0AYXyaH6eomajEF6SIw+BIEC6i+SwrGARY7qke5ltk6jaLo+TGI+nIKLauDKDWN56KURhOM+7SDpw74Rqu36-v+sorl+uDLMg9AWOByS7lSoCZDBuTwQYiFmJY1i-LyygPl2Gjst4eGLCmRGftmP5-gBcoKkquAqmqmqODqEoSZR0lkQBDGmlBLGKCosF5JxhQ8QgXyVloAmOoYLj2Y0vh9hKWmQL0KayhKMp6UxpyGVkxnsXoZlIRZHxXlcto2Nhwm9q0wFud+nmAUlBFGtujGQcxchGTkcEhfoXGcqUNgVIYUWeDWyjVCKfh9mgbAQHAMiYuS2X+blCC9GonI9WJUShGA7WUp1mQxa8wVNDFHw2A+nJfG8ygOK6NYuHUagAi5A6gmmEIjaWAV+pcjgxVo3a1t2LpNLyHpegoyg1b63wDXgBrYqgEAHQZXVzdhuAOfWtY2dUKgumopRtp67jKO8AlaK96XLh+Y6QN9OXjTh9iOL6dT8mDFlehUOhuHDjJzR4iOaSjJEyeRX3Fh1+7eshnhobY2gdo93b2WK22JTTX4eUOaOM6N+41W8jQOHUeM2MtyFzfSHO2qV8tsho9U+EAA */
  id: "tenants",
  initial: "idle",
  context: {
    subscribed: [],
    currentPage: 0,
    fetchSize: 10,
    subscribedAvailable: true,
    loadSubscribedRetryCount: 0,
  },
  states: {
    idle: {
      on: {
        "subscribed.load": "loading-subscribed",
        "tenants.create": "creating-new",
      },
    },
    "creating-new": {
      entry: [{ type: "clearCurrentError" }],
      invoke: {
        src: "createNewTenant",
        input: ({ event }) => {
          return { captcha: event["captcha"], name: event["name"] };
        },
        onDone: {
          actions: [{ type: "resetLoadSubscribedCount" }],
          target: "new-created",
        },
        onError: {
          actions: [
            { type: "setCurrentError" },
            { type: "logApiErrorMessage" },
          ],
          target: "idle",
        },
      },
    },
    "new-created": {
      after: {
        500: "loading-subscribed",
      },
    },
    "loading-subscribed": {
      invoke: {
        src: "loadSubscribedTenants",
        input: ({ context: { currentPage: page, fetchSize: size } }) => {
          return { page, size };
        },
        onDone: {
          actions: [
            { type: "updateSubscribedList" },
            { type: "resetLoadSubscribedCount" },
          ],
          target: "subscribed-loaded",
        },
        onError: {
          actions: [
            {
              type: "logApiErrorMessage",
            },
            {
              type: "incrementLoadSubscribedCount",
            },
            { type: "updateSubscribedAvailable" },
          ],
          target: "load-subscribed-failed",
        },
      },
    },
    "load-subscribed-failed": {
      on: {
        "tenants.create": "creating-new",
        "subscribed.retry": {
          target: "loading-subscribed",
          guard: "ableToLoadSubscribed",
        },
      },
      after: {
        5000: {
          target: "loading-subscribed",
          guard: "ableToAutoloadSubscribed",
        },
      },
    },
    "subscribed-loaded": {
      on: {
        "tenants.create": "creating-new",
        "subscribed.load": "loading-subscribed",
      },
    },
  },
});
