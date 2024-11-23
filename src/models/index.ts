export type AppRoute = {
  path: string;
  title?: string;
  isNavRoute: boolean;
  icon?: string;
  redirectTo?: string;
  showPredicate?: () => boolean;
};

export type AppRoutes = AppRoute[];

export type Principal = {
  displayName: string;
  email: string;
  avatar: string;
};
