import { AppRoutes } from "./models";

export const appRoutes: AppRoutes = [
  { path: "/sign-in", title: "Sign into your Account", isNavRoute: false },
  { path: "/sign-up", title: "Create your own Account", isNavRoute: false },
  { path: "/", redirectTo: "/overview", isNavRoute: false },
  { path: "/overview", title: "Overview", isNavRoute: true },
  { path: "/about", title: "About", isNavRoute: true },
];
