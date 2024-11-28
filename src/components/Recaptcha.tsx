import { GreCaptchaObject } from "@/models";
import { createScriptLoader } from "@solid-primitives/script-loader";

function arm() {
  return (action: string) => {
    const grecaptcha = (window as any)["grecaptcha"] as GreCaptchaObject;
    return new Promise<string>((resolve, reject) => {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(
            import.meta.env.VITE_SITE_KEY,
            { action }
          );
          resolve(token);
        } catch (err) {
          reject(err as Error);
        }
      });
    });
  };
}


export function useRecaptcha() {
  createScriptLoader({
    src: `https://www.google.com/recaptcha/api.js?render=${
      import.meta.env.VITE_SITE_KEY
    }`
  });
  return arm();
}
