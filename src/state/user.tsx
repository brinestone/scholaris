import { provideClient } from "@/helpers/client-provider";
import { APIError, auth, dto } from "@/lib/api-sdk";
import { Principal } from "@/models";
import { jwtDecode } from "jwt-decode";
import { createContext, JSX, ParentProps, useContext } from "solid-js";
import { assign, createActor, fromPromise, setup } from "xstate";

export enum UserStates {
  SignedOut = "signed-out",
  SignedIn = "signed-in",
  SigningIn = "signing-in",
  SigningOut = "signing-out",
  SignInFailed = "sign-in-failed",
}

export interface UserStateModel {
  accessToken?: string;
  principal?: Principal;
  apiError?: APIError;
}

const defaultUserState: UserStateModel = {};

export const doSignIn = async (
  email: string,
  password: string,
  captchaToken: string
) => {
  "use server";
  const client = provideClient();
  return await client.auth.SignIn({ captchaToken, email, password });
};

const userStore = setup({
  actors: {
    doSignIn: fromPromise<auth.LoginResponse, dto.LoginRequest>(
      async ({ input }) => {
        return doSignIn(
          String(input?.email),
          String(input.password),
          String(input.captchaToken)
        );
      }
    ),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4DpYEsoDtIBaHfAYlwKIHtkAXAbQAYBdRUAB2tzp2v3YgAHoiIBGJgBZMkgOwA2WQFYAHEwDMTAJyyN8gDQgAnogBMKzEq0q1Kseslb5p00qUBfd4dQZseQhA09BT+JPjMbEggXDx8AlEiCETmWpaa6g6m6qZiYnKGJggu6ph2spJiWbKm8lZK6p7eaFiU+KRQYWQQ-GCYpABu1ADWvTB0AIIAxpNwsAAqw2DhrIIxOLz8gol5spYqsrKZdirykqcFZtqYptqKYvvqWkwKko0gPi3+7Z0Y6NRYHAANgBDOgAM3+AFtMGMpjNYPNFstIpxuOs4ltEGJZGJrnUtDlnqcVOoLgh1Cc3h8-FRSEQwcCcIDIGR0GA6OgjBFVmiNvFQIlkvsyepZCpPF4QPhqBA4IIPjzYpsEqIHCUmEx5DYSScKYcyURVJgnrktPdahoDpIPJLqa1iKRFejlQKsTZMOVHnY8mJ5BTFGSJKZLFpNCctJJTGd1PIxFTmjSAkE6E6+ZikqYtEpMBqtTZ-XrScZEDprpJHgSFM48jamr5Wt9HVE1mmVUlfbiJKdJNpy9pzKYyZnpFYw-II1G-X74-XQnSGUzIKmMW3xH7MDslBIVGd7tolGS5PIc6GJPVNZmGhKgA */
  id: "user",
  initial: UserStates.SignedOut,
  context: defaultUserState,
  states: {
    [UserStates.SignedIn]: {
      on: {
        "sign-out": UserStates.SignedOut,
      },
    },
    // [UserStates.SigningOut]: { TODO: handle persistence
    //   entry:
    // },
    [UserStates.SignedOut]: {
      on: {
        "sign-in": UserStates.SigningIn,
      },
    },
    [UserStates.SigningIn]: {
      invoke: {
        id: "getAccessToken",
        src: "doSignIn",
        input: ({ event }) => ({
          captchaToken: event["captchaToken"],
          email: event["email"],
          password: event["password"],
        }),
        onDone: {
          target: UserStates.SignedIn,
          actions: assign({
            accessToken: ({ event }) => event.output.accessToken,
            principal: ({ event }) => {
              const { email, fullName, avatar } = jwtDecode<{
                avatar?: string;
                email: string;
                fullName: string;
              }>(event.output.accessToken, { header: true });

              return { avatar, displayName: fullName, email } as Principal;
            },
          }),
        },
        onError: {
          target: UserStates.SignInFailed,
          actions: assign({
            apiError: ({ event }) => event.error,
          }),
        },
      },
    },
    [UserStates.SignInFailed]: {
      on: {
        retry: UserStates.SigningIn,
      },
    },
  },
});

export type UserStoreType = typeof userStore;
export const UserStateStoreContext = createContext();

export function useUserStore() {
  return useContext(UserStateStoreContext);
}

export default function UserProvider({ children }: ParentProps): JSX.Element {
  const actor = createActor(userStore);
  return (
    <UserStateStoreContext.Provider value={actor}>
      {children}
    </UserStateStoreContext.Provider>
  );
}
