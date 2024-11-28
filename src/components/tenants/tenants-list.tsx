import { dto } from "@/lib/api-sdk";
import DataTable from "../ui/data-table";
import { ColumnDef } from "@tanstack/solid-table";
import { Accessor, Show } from "solid-js";
import { Button } from "../ui/button";
import { A } from "@solidjs/router";

export type TenantListProps = {
  tenants: Accessor<dto.TenantLookup[]>;
  createNewTenantFn: Accessor<void>;
  loading?: Accessor<boolean>;
};

const columns: ColumnDef<dto.TenantLookup>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row, renderValue }) => {
      return (
        <A class="block w-full" href={`/organizations/${row.original.id}`}>
          {renderValue() as string}
        </A>
      );
    },
  },
];

export default function TenantList(props: TenantListProps) {
  return (
    <DataTable
      columns={columns}
      data={props.tenants}
      empty={
        <div class="space-y-3">
          <h2
            class={
              (props.loading && props.loading() ? "font-semibold" : "") +
              " " +
              "text-lg"
            }
          >
            {props.loading && props.loading()
              ? "Loading Organizations..."
              : "No organization found"}
          </h2>
          <div>
            <Show when={props.loading && !props.loading()}>
              <Button onClick={props.createNewTenantFn} color="green">
                Create Organization
              </Button>
            </Show>
          </div>
        </div>
      }
    ></DataTable>
  );
}
