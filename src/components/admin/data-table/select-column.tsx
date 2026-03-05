"use client";

import type { ColumnDef } from "@tanstack/react-table";

/** Reusable checkbox select column for data tables. */
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => {
      const checked = table.getIsAllPageRowsSelected();
      const indeterminate = table.getIsSomePageRowsSelected();
      return (
        <input
          type="checkbox"
          aria-label="Select all"
          className="h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
          checked={checked}
          ref={(el) => {
            if (el) el.indeterminate = indeterminate && !checked;
          }}
          onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        />
      );
    },
    cell: ({ row }) => (
      <input
        type="checkbox"
        aria-label="Select row"
        className="h-3.5 w-3.5 rounded border-border accent-primary cursor-pointer"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
