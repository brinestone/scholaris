export type AppRoute = {
  label: string;
  children?: AppRoute[];
  path?: string;
  description?: string;
  icon?: string;
};

export type AppRoutes = AppRoute[];

export type Principal = {
  displayName: string;
  email: string;
  avatar: string;
};

export type GreCaptchaObject = {
  ready: (fn: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};
