import { provideClient } from "@/helpers/client-provider";
import { APIError, auth, dto } from "@/lib/api-sdk";
import { Principal } from "@/models";
import { useActor } from "@xstate/solid";
import { jwtDecode } from "jwt-decode";
import { assign, fromPromise, setup } from "xstate";

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
  apiError?: {
    code: string;
    status: string;
    message: string;
  };
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
  /** @xstate-layout N4IgpgJg5mDOIC5QFdZgE4DpYEsoDtIBaHfAYlwKIHtkAXAbQAYBdRUAB2tzp2v3YgAHogBsADgAsmAKyTRATgCMMmQCZJCzaIA0IAJ6IAzEoDsmBU1FrRTJeLVTJ4gL4u9qDNjyEINehQ+JPjMbEggXDx8AuEiCPZMFjImjqZqRiZKCuJ6hvEyiWmiMqJGTAoKpuJmpm4eaFiU+KRQwWQQ-GCYpABu1ADWXTB0AIIAxmNwsAAqA2AhrIKROLz8gnEy2ZhVSjYyppJm6roGiGoaSSkKakpGksmOdSCejT4tbRjo1FgcADYAhnQAGbfAC2mGG40msBmcwWYU43BW0XWiE24m21T2ByONlyiFuSgsFQqDkkkis9iMTxe3iopCIQP+OF+kDI6DAdHQ+lCSyRqxioDipiURKU5UOpWu4jkMnxCGqmE0JMU4lEoqYNjc7hA+GoEDgghefKia1iiCIJzylswTDt9od9qUkhpDTpvmCJuRZqFiHE5UwKmsCiMplMCk2agU8pMiSM52uoilMqjrq8TWItDoXoFqIQkjUMd2mAcUZsyfUCjTrwI71IOZR5oQUekohF4mq1huzqM8t25iKJXSJi0uxdOtpTWCjOZrIgDZ9wj9AaDUdD4cj0dO8Wcgck8ajqjb4myom1LiAA */
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
            apiError: ({ event }) => {
              const { code, message, status } = event.error as APIError;
              return { status, message, code };
            },
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

// export type UserStoreType = typeof userStore;
// export const UserStateStoreContext = createContext();

export const useUserStore = () => useActor(userStore);

// export default function UserProvider({ children }: ParentProps): JSX.Element {
//   const [actor, send] = useActor(userStore);

//   return (
//     <UserStateStoreContext.Provider value={actor}>
//       {children}
//     </UserStateStoreContext.Provider>
//   );
// }
