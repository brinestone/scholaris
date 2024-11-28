import NewTenantForm from "@/components/tenants/new-tenant-form";
import TenantList from "@/components/tenants/tenants-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/ui/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { dto } from "@/lib/api-sdk";
import { tenantMachine } from "@/machines/tenants";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { toast } from "solid-sonner";
import { createActor } from "xstate";

export default function Organizations() {
  const actor = createActor(tenantMachine).start();
  const [tenants, setTenants] = createSignal<dto.TenantLookup[]>([]);
  const [tenantsLoading, setTenantsLoading] = createSignal(false);
  const [rightSheetState, setRightSheetState] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);

  createEffect(() => {
    const subscription = actor.subscribe({
      next: (s) => {
        setTenants(s.context.subscribed);
        setTenantsLoading(s.value == "loading-subscribed");
        setSubmitting(s.value == "creating-new");
        setErrorMessage(s.context.currentError?.message ?? "");
        if (s.value == "new-created") {
          setRightSheetState(false);
          toast("Organization created successfully ", { icon: "🎊" });
        }
      },
    });
    onCleanup(() => subscription.unsubscribe());
  });

  onCleanup(() => actor.stop());
  onMount(async () => {
    actor.send({ type: "subscribed.load" });
  });

  const onCreateNewButtonClicked = () => {
    setRightSheetState(true);
  };

  return (
    <div class="container pt-4 space-y-3">
      <section class="space-y-3 sticky top-0">
        <div class="flex justify-between items-center flex-wrap gap-y-3">
          <h1 class="text-3xl font-bold">Organizations</h1>
          <Show when={tenants().length > 0}>
            <Button
              onClick={onCreateNewButtonClicked}
              disabled={tenantsLoading()}
              class="inline-flex items-center gap-2"
            >
              <PlusIcon /> <span>Create Organization</span>
            </Button>
          </Show>
        </div>
      </section>
      <section>
        <TenantList
          createNewTenantFn={onCreateNewButtonClicked}
          tenants={tenants}
          loading={tenantsLoading}
        />
        <Sheet
          defaultOpen={true}
          onOpenChange={(state) => setRightSheetState(state)}
          modal={true}
          preventScroll={true}
          open={rightSheetState()}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>New Organization</SheetTitle>
            </SheetHeader>
            <NewTenantForm
              submitting={submitting}
              errorMessage={errorMessage}
              submitFn={(submission) =>
                actor.send({
                  type: "tenants.create",
                  captcha: submission.captchaToken,
                  name: submission.name,
                })
              }
            />
          </SheetContent>
        </Sheet>
      </section>
    </div>
  );
}
