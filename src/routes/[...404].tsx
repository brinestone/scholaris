import { Button } from "@/components/ui/button";
import { useNavigate } from "@solidjs/router";
import { AiOutlineArrowLeft, AiOutlineHome } from "solid-icons/ai";

export default function NotFound() {
  const navigate = useNavigate();
  const onHomeButtonClicked = () => navigate("/");
  const onBackButtonClicked = () => history.back();
  return (
    <main class="text-center mx-auto text-gray-700 p-4 space-y-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase mt-16">
        Page Not Found
      </h1>
      <p>Unfortunately, the page you requested could not be found</p>
      <div class="flex justify-center items-center gap-3">
        <Button
          onClick={onBackButtonClicked}
          variant="ghost"
          class="inline-flex gap-3"
        >
          <AiOutlineArrowLeft /> Go back
        </Button>
        <Button
          onClick={onHomeButtonClicked}
          variant="ghost"
          class="inline-flex gap-3"
        >
          <AiOutlineHome /> Go to Home
        </Button>
      </div>
    </main>
  );
}
