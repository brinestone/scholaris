import {
  createContext,
  createSignal,
  onMount,
  ParentProps,
  useContext,
} from "solid-js";
import { GreCaptchaObject } from "@/models";
import { createScriptLoader } from "@solid-primitives/script-loader";

const RecaptchaContext = createContext<GreCaptchaObject>();

export function useRecaptcha() {
  const grecaptcha = useContext(RecaptchaContext);
  const func = (action: string) => {
    if (!grecaptcha)
      return Promise.reject(new Error("reCaptcha not configured"));
    return new Promise<string>((resolve, reject) => {
      grecaptcha.ready(async () => {
        try {
          const token = await grecaptcha.execute(
            import.meta.env.VITE_SITE_KEY,
            {
              action,
            }
          );
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  return func;
}

export default function RecaptchaProvider({ children }: ParentProps) {
  const [grecaptcha, setGrecaptcha] = createSignal<GreCaptchaObject>();
  onMount(() => {
    createScriptLoader({
      src: `https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_SITE_KEY
      }`,
      onLoad: async () => {
        const grecaptcha = (window as any)["grecaptcha"] as GreCaptchaObject;
        setGrecaptcha(grecaptcha);
      },
    });
  });

  return (
    <RecaptchaContext.Provider value={grecaptcha()}>
      {children}
    </RecaptchaContext.Provider>
  );
}
