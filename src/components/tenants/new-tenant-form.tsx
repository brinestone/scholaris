import { dto } from "@/lib/api-sdk";
import { Accessor, createSignal, Show } from "solid-js";
import { useRecaptcha } from "../Recaptcha";
import { Button } from "../ui/button";
import {
  TextField,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "../ui/textfield";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangleIcon, LoadingIcon } from "../ui/icons";

export type TenantFormProps = {
  submitFn: (arg: dto.NewTenantRequest) => void;
  errorMessage: Accessor<string>;
  submitting: Accessor<boolean>;
};

export default function NewTenantForm(props: TenantFormProps) {
  const [nameTouched, setNameTouched] = createSignal(false);
  const [name, setName] = createSignal<string>();
  const getCaptchaToken = useRecaptcha();

  const onSubmitButtonClicked = async () => {
    const token = await getCaptchaToken("new_tenant");
    props.submitFn({ captchaToken: token, name: name() ?? "" });
  };
  return (
    <form class="space-y-3 pt-4" onSubmit={(e) => e.preventDefault()}>
      <Show when={props.errorMessage()}>
        <div>
          <Alert variant="destructive">
            <AlertTriangleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{props.errorMessage()}</AlertDescription>
          </Alert>
        </div>
      </Show>
      <div>
        <TextFieldRoot
          class="w-full"
          validationState={
            nameTouched() && (name() ?? "").length == 0 ? "invalid" : "valid"
          }
        >
          <TextFieldLabel>
            Name <span class="text-red-500">*</span>
          </TextFieldLabel>
          <TextField
            type="text"
            required
            value={name()}
            onBlur={() => setNameTouched(true)}
            onInput={(e) => {
              setName((e.target as HTMLInputElement).value);
            }}
          />
          <Show when={nameTouched() && (name() ?? "").length == 0}>
            <TextFieldErrorMessage>
              This field is required
            </TextFieldErrorMessage>
          </Show>
        </TextFieldRoot>
      </div>
      <div>
        <Button
          onClick={() => onSubmitButtonClicked()}
          disabled={(name()?.length ?? 0) <= 0 || props.submitting()}
          type="submit"
          class="inline-flex gap-1 items-center"
        >
          <Show when={props.submitting()} fallback={<span>Submit</span>}>
            <LoadingIcon />
            <span>Please wait</span>
          </Show>
        </Button>
      </div>
    </form>
  );
}
