import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ClerkProvider, SignedIn } from "clerk-solidjs";
import { Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <MetaProvider>
      <Title>Scholaris</Title>
      <Router
        root={(props) => (
          <>
            <ClerkProvider
              publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
            >
              <SignedIn>
                <Nav />
              </SignedIn>
              <Suspense>
                {props.children}
                <Toaster />
              </Suspense>
            </ClerkProvider>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </MetaProvider>
  );
}
