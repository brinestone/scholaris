import { Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { SignedIn, SignedOut, SignIn } from "clerk-solidjs";

export default function SignInPage() {

  return (
    <>
      <Title>Connect to your Account</Title>
      <SignedOut>
          <div class="container flex h-full justify-stretch md:justify-center items-center">
            <SignIn />
          </div>
      </SignedOut>
      <SignedIn>
        <Navigate href="/" />
      </SignedIn>
    </>
  );
}
