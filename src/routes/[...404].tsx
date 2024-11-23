import { ParentProps } from "solid-js";

export default function NotFound(props: ParentProps) {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Page Not Found
      </h1>
    </main>
  );
}
