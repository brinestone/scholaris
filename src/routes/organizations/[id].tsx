import { useParams } from "@solidjs/router";

export default function TenantPage() {
  const params = useParams();

  return <p>{params["id"]}</p>;
}
