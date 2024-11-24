import { Navigate } from "@solidjs/router";
import { SignedIn, SignedOut } from "clerk-solidjs";

export default function OverviewPage() {
  return (
    <>
      <SignedIn>
        <div class="container"></div>
      </SignedIn>
      <SignedOut>
        <Navigate href="/auth/sign-in" />
      </SignedOut>
    </>
  );
}
