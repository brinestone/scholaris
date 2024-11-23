import Client, { Environment } from "@/lib/api-sdk";

export function provideClient(accessToken?: string) {
  return new Client(Environment("staging"), { auth: accessToken });
}
