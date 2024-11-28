import Client, { AuthDataGenerator, Environment, Local } from "@/lib/api-sdk";
import { auth } from "clerk-solidjs/start/server";

export function provideApiClientOnServer() {
  const authGenerator: AuthDataGenerator = async () => {
    const userAuth = auth();
    const token = await userAuth.getToken();
    return token ?? undefined;
  };
  return new Client(Environment(process.env.SCHOLARIS_API_ENV ?? "prod"), {
    auth: authGenerator,
  });
}
