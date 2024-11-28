import PerformanceTrends from "@/components/PerformanceTrends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserFeed from "@/components/UserFeed";
import { Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { SignedIn, SignedOut, useUser } from "clerk-solidjs";
import moment from "moment";
import { BsDot } from "solid-icons/bs";
import { Show } from "solid-js";

function UserInfoLoading() {
  return (
    <div class="flex items-center space-x-4">
      <Skeleton class="h-12 w-12 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[250px]" />
        <Skeleton class="h-4 w-[200px]" />
        <Skeleton class="h-4 w-[150px]" />
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { user, isLoaded } = useUser();
  const signedUpAt = () => {
    return moment(user()?.createdAt);
  };
  return (
    <>
      <Title>Overview</Title>
      <SignedIn>
        <div class="container space-y-4 pt-4">
          <section class="flex justify-between p-4 space-y-3 border border-muted rounded">
            <div class="flex items-center gap-3">
              <Show when={isLoaded()} fallback={UserInfoLoading()}>
                <img
                  class="rounded-full"
                  width={100}
                  src={user()?.imageUrl}
                  alt={user()?.fullName ?? undefined}
                />
                <div class="space-y-2">
                  <h1 class="text-3xl font-bold m-0">{user()?.fullName}</h1>
                  <div class="flex">
                    <Show when={user()?.primaryEmailAddress}>
                      <small>{user()?.primaryEmailAddress?.emailAddress}</small>
                    </Show>
                    <Show
                      when={
                        user()?.primaryEmailAddress &&
                        user()?.primaryPhoneNumber
                      }
                    >
                      <BsDot />
                    </Show>
                    <Show when={user()?.primaryPhoneNumber}>
                      <small>{user()?.primaryPhoneNumber?.phoneNumber}</small>
                    </Show>
                  </div>
                  <p class="text-sm">
                    Joined Since: {signedUpAt().format("d MMMM YYYY")}
                  </p>
                </div>
              </Show>
            </div>
          </section>
          <section class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            <Card>
              <CardHeader>
                <CardTitle>My Performance</CardTitle>
                <CardDescription>Session</CardDescription>
                <CardContent>
                  <PerformanceTrends />
                </CardContent>
              </CardHeader>
            </Card>
          </section>
          <section class="grid md:grid-cols-[1fr_auto] gap-3">
            <UserFeed />
            <span>recent</span>
          </section>
        </div>
      </SignedIn>
      <SignedOut>
        <Navigate href="/auth/sign-in" />
      </SignedOut>
    </>
  );
}
