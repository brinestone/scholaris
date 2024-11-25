import { appRoutes } from "@/app.routes";
import { UserButton } from "clerk-solidjs";
import { For, Match, Switch } from "solid-js";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuDescription,
  NavigationMenuItem,
  NavigationMenuItemLabel,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    location.pathname.startsWith(path) ? "bg-muted" : "";

  return (
    <nav class="flex justify-between p-3">
      <div class="overflow-auto">
        <NavigationMenu>
          <For each={appRoutes}>
            {(route) => (
              <Switch>
                <Match when={!route.children}>
                  <NavigationMenuTrigger
                    class={active(String(route.path))}
                    as="a"
                    href={route.path}
                  >
                    {route.label}
                  </NavigationMenuTrigger>
                </Match>
                <Match when={route.children && route.children.length > 0}>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>{route.label}</NavigationMenuTrigger>
                    <NavigationMenuContent class="grid grid-cols-2 w-[400px]">
                      <For each={route.children}>
                        {(subRoute) => {
                          return (
                            <NavigationMenuLink
                              href={subRoute.path}
                              class="flex h-fit w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/50 to-muted p-2 no-underline outline-none transition-shadow duration-200 hover:shadow-md focus-visible:shadow-md focus-visible:ring-[1.5px] focus-visible:ring-ring"
                            >
                              <Switch>
                                <Match
                                  when={
                                    subRoute.description?.length &&
                                    subRoute.description.length > 0
                                  }
                                >
                                  <>
                                    <NavigationMenuItemLabel class="mb-2 mt-4 text-lg font-medium">
                                      {subRoute.label}
                                    </NavigationMenuItemLabel>
                                    <NavigationMenuDescription class="text-sm leading-tight text-muted-foreground">
                                      {subRoute.description}
                                    </NavigationMenuDescription>
                                  </>
                                </Match>
                              </Switch>
                            </NavigationMenuLink>
                          );
                        }}
                      </For>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </Match>
              </Switch>
            )}
          </For>
        </NavigationMenu>
      </div>
      <div>
        <UserButton />
      </div>
    </nav>
  );
}
