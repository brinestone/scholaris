import { appRoutes } from "@/app.routes";
import { A, useLocation } from "@solidjs/router";
import { For, Show } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <For each={appRoutes.filter((r) => r.isNavRoute)}>
          {(route) => {
            return (
              <li class={`border-b-2 ${active(route.path)} mx-1.5 sm:mx-6`}>
                <A href={route.path} >
                  <Show when={route.icon}>
                    <i class={route.icon}></i>
                  </Show>{" "}
                  {route.title}
                </A>
              </li>
            );
          }}
        </For>
      </ul>
    </nav>
  );
}
