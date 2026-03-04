# Admin Data Table Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all 5 admin tables with TanStack Table-powered DataTable components that support sorting, filtering, column visibility, and pagination.

**Architecture:** One generic `DataTable<T>` component handles common table infrastructure (sorting, filtering, column toggle, pagination). Each admin table defines its own `columns.tsx` with custom cell renderers. All existing interactive features (inline edits, status dropdowns, budget bars, sparklines) are preserved as custom cell renderers.

**Tech Stack:** @tanstack/react-table, shadcn/ui (table, dropdown-menu, button, input), existing custom components (InlineEdit, StatusSelect, ConfirmDialog, CopyButton)

---

### Task 1: Install dependencies and add shadcn dropdown-menu

**Files:**
- Modify: `package.json`
- Create: `src/components/ui/dropdown-menu.tsx`

**Step 1: Install @tanstack/react-table**

Run: `npm install @tanstack/react-table`

**Step 2: Add shadcn dropdown-menu component**

Run: `npx shadcn@latest add dropdown-menu`

If the CLI prompts for overwrite, accept. This creates `src/components/ui/dropdown-menu.tsx`.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json src/components/ui/dropdown-menu.tsx
git commit -m "chore: add @tanstack/react-table and shadcn dropdown-menu"
```

---

### Task 2: Build reusable DataTable components

**Files:**
- Create: `src/components/admin/data-table/column-header.tsx`
- Create: `src/components/admin/data-table/data-table-toolbar.tsx`
- Create: `src/components/admin/data-table/data-table-pagination.tsx`
- Create: `src/components/admin/data-table/data-table.tsx`

**Step 1: Create column-header.tsx**

Sortable column header button. Clicking toggles sort asc/desc/none.

```tsx
"use client";

import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function ColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className={cn("text-xs font-medium text-muted-foreground", className)}>{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 -ml-3 text-xs font-medium text-muted-foreground hover:text-foreground", className)}
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "asc" ? (
        <ArrowUp className="ml-1 h-3 w-3" />
      ) : sorted === "desc" ? (
        <ArrowDown className="ml-1 h-3 w-3" />
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );
}
```

**Step 2: Create data-table-toolbar.tsx**

Search input + column visibility dropdown.

```tsx
"use client";

import { Table } from "@tanstack/react-table";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  searchPlaceholder = "Search...",
  children,
}: ToolbarProps<TData>) {
  const column = searchColumn ? table.getColumn(searchColumn) : null;

  return (
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="flex items-center gap-2 flex-1">
        {column && (
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-8 pl-8 text-xs w-64"
            />
          </div>
        )}
        {children}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs">Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((col) => col.getCanHide())
            .map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
                className="text-xs capitalize"
              >
                {col.id.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

**Step 3: Create data-table-pagination.tsx**

Page navigation + page size selector + row count.

```tsx
"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: PaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-xs text-muted-foreground">
        {table.getFilteredRowModel().rows.length} row(s)
      </p>
      <div className="flex items-center gap-2">
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="h-7 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground tabular-nums">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
```

**Step 4: Create data-table.tsx**

Main generic DataTable component that wires everything together.

```tsx
"use client";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  emptyMessage = "No results.",
  toolbar,
  pageSize = 20,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div>
      <DataTableToolbar
        table={table}
        searchColumn={searchColumn}
        searchPlaceholder={searchPlaceholder}
      >
        {toolbar}
      </DataTableToolbar>
      <Card className="border-border/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/60 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-12 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border/60">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <DataTablePagination table={table} />
    </div>
  );
}
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds. The DataTable components are not used yet but should compile cleanly.

**Step 6: Commit**

```bash
git add src/components/admin/data-table/
git commit -m "feat: add reusable DataTable components with sorting, filtering, column visibility, pagination"
```

---

### Task 3: Upgrade clients table

**Files:**
- Create: `src/components/admin/clients/columns.tsx`
- Modify: `src/components/admin/clients/client-table.tsx`

**Step 1: Create clients columns.tsx**

Column definitions for the client table. All existing cell renderers (InlineEdit for slug, portal link, deactivate action) move here.

```tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineEdit } from "@/components/admin/inline-edit";
import { CopyButton } from "@/components/admin/copy-button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import { fmtUsd, roasColor, statusBadge } from "@/lib/formatters";
import { renameClient, deactivateClient } from "@/app/admin/actions/clients";
import { toast } from "sonner";
import type { ClientSummary } from "@/app/admin/clients/data";

export const clientColumns: ColumnDef<ClientSummary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Client" />,
    cell: ({ row }) => {
      const c = row.original;
      const joined = new Date(c.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      return (
        <div>
          <a
            href={`/admin/clients/${c.id}`}
            className="text-sm font-medium hover:underline"
          >
            {c.name}
          </a>
          <p className="text-xs text-muted-foreground">joined {joined}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <ColumnHeader column={column} title="Slug" />,
    cell: ({ row }) => {
      const c = row.original;
      return (
        <InlineEdit
          value={c.slug}
          className="text-xs text-muted-foreground"
          onSave={async (newSlug) => {
            try {
              await renameClient({ oldSlug: c.slug, newSlug });
              toast.success(`Renamed ${c.slug} to ${newSlug}`);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to rename");
              throw err;
            }
          }}
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <ColumnHeader column={column} title="Status" />,
    cell: ({ row }) => statusBadge(row.original.status),
  },
  {
    accessorKey: "memberCount",
    header: ({ column }) => <ColumnHeader column={column} title="Members" className="justify-end" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-right block">{row.original.memberCount}</span>
    ),
  },
  {
    accessorKey: "activeShows",
    header: ({ column }) => <ColumnHeader column={column} title="Shows" className="justify-end" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-right block">{row.original.activeShows}</span>
    ),
  },
  {
    accessorKey: "activeCampaigns",
    header: ({ column }) => <ColumnHeader column={column} title="Campaigns" className="justify-end" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-right block">{row.original.activeCampaigns}</span>
    ),
  },
  {
    accessorKey: "totalSpend",
    header: ({ column }) => <ColumnHeader column={column} title="Total Spend" className="justify-end" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium tabular-nums text-right block">
        {fmtUsd(row.original.totalSpend)}
      </span>
    ),
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => <ColumnHeader column={column} title="Revenue" className="justify-end" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium tabular-nums text-right block">
        {fmtUsd(row.original.totalRevenue)}
      </span>
    ),
  },
  {
    accessorKey: "roas",
    header: ({ column }) => <ColumnHeader column={column} title="ROAS" className="justify-end" />,
    cell: ({ row }) => {
      const r = row.original.roas;
      return (
        <span className={`text-sm font-semibold tabular-nums text-right block ${roasColor(r)}`}>
          {r > 0 ? r.toFixed(1) + "x" : "\u2014"}
        </span>
      );
    },
  },
  {
    id: "portal",
    header: () => <span className="text-xs font-medium text-muted-foreground">Portal</span>,
    enableHiding: false,
    cell: ({ row }) => {
      const slug = row.original.slug;
      return (
        <div className="flex items-center gap-1.5">
          <a
            href={`/client/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Eye className="h-3 w-3" />
            View Portal
          </a>
          <CopyButton text={`/client/${slug}`} />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const c = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs">{c.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={`/admin/clients/${c.id}`}>Client details</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/client/${c.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-2" />
                View portal
              </a>
            </DropdownMenuItem>
            {c.activeCampaigns > 0 && (
              <>
                <DropdownMenuSeparator />
                <DeactivateItem client={c} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DeactivateItem({ client }: { client: ClientSummary }) {
  return (
    <ConfirmDialog
      trigger={
        <button className="relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-xs text-red-400 hover:bg-accent hover:text-red-300 outline-none">
          Deactivate campaigns
        </button>
      }
      title="Deactivate Client"
      description={`This will pause all active campaigns for ${client.name}. Continue?`}
      confirmLabel="Deactivate"
      variant="destructive"
      onConfirm={async () => {
        try {
          await deactivateClient({ slug: client.slug });
          toast.success(`All campaigns paused for ${client.name}`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to deactivate");
        }
      }}
    />
  );
}
```

**Step 2: Rewrite client-table.tsx to use DataTable**

Replace the 245-line static table with a thin wrapper that passes data + columns to DataTable.

```tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/app/admin/actions/clients";
import { toSlug } from "@/lib/to-slug";
import { DataTable } from "@/components/admin/data-table/data-table";
import { clientColumns } from "./columns";
import type { ClientSummary } from "@/app/admin/clients/data";

interface Props {
  clients: ClientSummary[];
}

function CreateClientForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function handleNameChange(val: string) {
    setName(val);
    setSlug(toSlug(val));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient({ name: name.trim(), slug });
      setCreated(true);
      toast.success(`Client "${name.trim()}" created`);
      setTimeout(() => { onDone(); }, 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create client");
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 py-2">
        <Check className="h-4 w-4" /> Client created
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 pt-1">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Name</label>
        <Input
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Acme Events"
          className="h-8 w-48 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Slug</label>
        <Input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="acme_events"
          className="h-8 w-40 text-sm"
        />
      </div>
      <Button type="submit" size="sm" disabled={loading} className="h-8">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create"}
      </Button>
      <Button type="button" size="sm" variant="ghost" className="h-8" onClick={onDone}>
        Cancel
      </Button>
    </form>
  );
}

export function ClientTable({ clients }: Props) {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">All Clients</h2>
      </div>
      <DataTable
        columns={clientColumns}
        data={clients}
        searchColumn="name"
        searchPlaceholder="Search clients..."
        emptyMessage="No clients yet. Create one to get started."
        toolbar={
          showCreate ? (
            <CreateClientForm onDone={() => setShowCreate(false)} />
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-2 h-8 text-xs"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              Create Client
            </Button>
          )
        }
      />
    </div>
  );
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds. Clients page renders with sortable headers, search, column toggle, pagination, and row actions.

**Step 4: Commit**

```bash
git add src/components/admin/clients/columns.tsx src/components/admin/clients/client-table.tsx
git commit -m "feat: upgrade clients table to TanStack DataTable with sorting, filtering, column visibility"
```

---

### Task 4: Upgrade campaigns table

**Files:**
- Create: `src/components/admin/campaigns/columns.tsx`
- Modify: `src/components/admin/campaigns/campaign-table.tsx`

**Step 1: Create campaigns columns.tsx**

Move all existing cell renderers (BudgetBar, RoasBadge, RoasSparkline, SyncButton, ClientSelect) into column definitions. The helper components (BudgetBar, RoasSparkline, etc.) stay in campaign-table.tsx and are imported by columns.tsx.

```tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusSelect } from "@/components/admin/status-select";
import { ColumnHeader } from "@/components/admin/data-table/column-header";
import {
  fmtUsd,
  fmtNum,
  centsToUsd,
  fmtObjective,
  computeMarginalRoas,
  roasColor,
  type SnapshotPoint,
} from "@/lib/formatters";
import {
  updateCampaignStatus,
  assignCampaignClient,
} from "@/app/admin/actions/campaigns";
import type { MetaCampaign } from "@/app/admin/campaigns/data";
import { toast } from "sonner";
import {
  BudgetBar,
  RoasBadge,
  RoasSparkline,
  SyncButton,
  ClientSelect,
} from "./campaign-cells";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
];

interface CampaignColumnsOptions {
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  clients: string[];
  metaAdAccountId: string | null;
}

export function getCampaignColumns(opts: CampaignColumnsOptions): ColumnDef<MetaCampaign>[] {
  const { snapshotsByCampaign, clients, metaAdAccountId } = opts;

  return [
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Campaign" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div>
            <p className="text-sm font-medium">{c.name}</p>
            <span className="text-xs text-muted-foreground">{fmtObjective(c.objective)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <ColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <StatusSelect
            value={c.status}
            options={STATUS_OPTIONS}
            onSave={async (newStatus) => {
              try {
                await updateCampaignStatus({ campaignId: c.campaign_id, status: newStatus });
                toast.success(`Status updated to ${newStatus}`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to update status");
              }
            }}
          />
        );
      },
    },
    {
      id: "client",
      accessorKey: "client_slug",
      header: ({ column }) => <ColumnHeader column={column} title="Client" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <ClientSelect
            value={c.client_slug ?? ""}
            clients={clients}
            onSave={async (slug) => {
              try {
                await assignCampaignClient({ campaignId: c.campaign_id, clientSlug: slug });
                toast.success(slug ? `Assigned to ${slug}` : "Client unassigned");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to assign client");
              }
            }}
          />
        );
      },
    },
    {
      id: "budget",
      accessorFn: (row) => row.spend,
      header: ({ column }) => <ColumnHeader column={column} title="Budget spent" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <BudgetBar
            spend={centsToUsd(c.spend)}
            dailyBudget={centsToUsd(c.daily_budget)}
            lifetimeBudget={centsToUsd(c.lifetime_budget)}
          />
        );
      },
    },
    {
      accessorKey: "roas",
      header: ({ column }) => <ColumnHeader column={column} title="ROAS" className="justify-end" />,
      cell: ({ row }) => (
        <div className="text-right"><RoasBadge roas={row.original.roas} /></div>
      ),
    },
    {
      id: "trend",
      enableSorting: false,
      header: () => <span className="text-xs font-medium text-muted-foreground">Trend</span>,
      cell: ({ row }) => (
        <RoasSparkline points={snapshotsByCampaign[row.original.campaign_id] ?? []} />
      ),
    },
    {
      id: "marginal",
      accessorFn: (row) => computeMarginalRoas(snapshotsByCampaign[row.campaign_id] ?? []),
      header: ({ column }) => <ColumnHeader column={column} title="Marginal" className="justify-end" />,
      cell: ({ row }) => {
        const m = computeMarginalRoas(snapshotsByCampaign[row.original.campaign_id] ?? []);
        if (m == null) return <span className="text-muted-foreground text-sm text-right block">--</span>;
        return <span className={`text-sm font-semibold tabular-nums text-right block ${roasColor(m)}`}>{m.toFixed(1)}x</span>;
      },
    },
    {
      accessorKey: "impressions",
      header: ({ column }) => <ColumnHeader column={column} title="Impressions" className="justify-end" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums text-right block">
          {fmtNum(row.original.impressions)}
        </span>
      ),
    },
    {
      accessorKey: "ctr",
      header: ({ column }) => <ColumnHeader column={column} title="CTR" className="justify-end" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums text-right block">
          {row.original.ctr != null ? row.original.ctr.toFixed(2) + "%" : "--"}
        </span>
      ),
    },
    {
      accessorKey: "cpc",
      header: ({ column }) => <ColumnHeader column={column} title="CPC" className="justify-end" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground tabular-nums text-right block">
          {row.original.cpc != null ? "$" + row.original.cpc.toFixed(2) : "--"}
        </span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-1">
            <SyncButton campaignId={c.campaign_id} status={c.status} dailyBudget={c.daily_budget} />
            {metaAdAccountId && (
              <a
                href={`https://www.facebook.com/adsmanager/manage/campaigns?act=${metaAdAccountId}&selected_campaign_ids=${c.campaign_id}`}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        );
      },
    },
  ];
}
```

**Step 2: Extract cell components from campaign-table.tsx into campaign-cells.tsx**

Create `src/components/admin/campaigns/campaign-cells.tsx` with BudgetBar, RoasBadge, RoasSparkline, SyncButton, ClientSelect (all the helper components currently in campaign-table.tsx, unchanged).

Copy the existing BudgetBar (lines 36-66), RoasBadge (lines 68-71), RoasSparkline (lines 73-111), SyncButton (lines 115-151), and ClientSelect (lines 310-339) from the current campaign-table.tsx into this new file. Export all of them.

**Step 3: Rewrite campaign-table.tsx to use DataTable**

Replace the entire file with a thin wrapper:

```tsx
"use client";

import { DataTable } from "@/components/admin/data-table/data-table";
import { getCampaignColumns } from "./columns";
import type { MetaCampaign } from "@/app/admin/campaigns/data";
import type { SnapshotPoint } from "@/lib/formatters";

interface CampaignTableProps {
  campaigns: MetaCampaign[];
  snapshotsByCampaign: Record<string, SnapshotPoint[]>;
  clients: string[];
  metaAdAccountId: string | null;
  fromDb: boolean;
}

export function CampaignTable({ campaigns, snapshotsByCampaign, clients, metaAdAccountId, fromDb }: CampaignTableProps) {
  const columns = getCampaignColumns({ snapshotsByCampaign, clients, metaAdAccountId });

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      searchColumn="name"
      searchPlaceholder="Search campaigns..."
      emptyMessage={fromDb ? "No campaigns match this filter" : "No campaign data -- run the Meta sync agent to pull live data"}
    />
  );
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds. Campaigns page renders with all existing features + sorting, filtering, column toggle, pagination.

**Step 5: Commit**

```bash
git add src/components/admin/campaigns/
git commit -m "feat: upgrade campaigns table to TanStack DataTable"
```

---

### Task 5: Upgrade events table

**Files:**
- Create: `src/components/admin/events/columns.tsx`
- Create: `src/components/admin/events/event-cells.tsx`
- Modify: `src/components/admin/events/event-table.tsx`

**Step 1: Extract cell components into event-cells.tsx**

Move SellBarVisual (lines 28-45) and ClientSelect (lines 49-78) from current event-table.tsx into `event-cells.tsx`. Export both.

**Step 2: Create events columns.tsx**

Column definitions using ColumnHeader for sorting. All existing cell renderers (SellBarVisual, ClientSelect, InlineEdit for tickets, StatusSelect, matchedCampaigns ad summary) are referenced. Pattern is same as campaigns columns -- use `getCampaignColumns`-style function that accepts demoMap and campaigns as closure args:

```tsx
export function getEventColumns(opts: { clients: string[]; demoMap: Record<string, DemoRow>; campaigns: CampaignRow[] }): ColumnDef<TmEventRow>[]
```

Each column follows the same ColumnHeader + custom cell pattern. The "artist" column uses `row.original.artist` as primary and `row.original.name` as secondary. Sell-through column has InlineEdit + SellBarVisual. Ads column has matchedCampaigns logic.

**Step 3: Rewrite event-table.tsx as thin DataTable wrapper**

Same pattern as campaigns. Pass columns + data + searchColumn="artist" + searchPlaceholder="Search events...".

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add src/components/admin/events/
git commit -m "feat: upgrade events table to TanStack DataTable"
```

---

### Task 6: Upgrade users table

**Files:**
- Create: `src/components/admin/users/columns.tsx`
- Modify: `src/components/admin/users/user-table.tsx`

**Step 1: Create users columns.tsx**

Column definitions. The AssignCell and role StatusSelect move into cell renderers. Delete action uses ConfirmDialog inside a DropdownMenu actions column.

```tsx
export function getUserColumns(opts: { clients: ClientOption[] }): ColumnDef<UserRow>[]
```

Columns: name (with Pending badge logic), email, role (StatusSelect), client access (AssignCell), joined (fmtDate), actions (delete with ConfirmDialog).

**Step 2: Rewrite user-table.tsx**

Keep InviteForm exactly as-is (it's above-table UI). Keep AssignCell exactly as-is. Replace the static Table with DataTable. Pass searchColumn="name", searchPlaceholder="Search users...". The invite button goes in the toolbar slot.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/admin/users/
git commit -m "feat: upgrade users table to TanStack DataTable"
```

---

### Task 7: Upgrade agents job history table

**Files:**
- Create: `src/components/admin/agents/columns.tsx`
- Modify: `src/components/admin/agents/job-history.tsx`

**Step 1: Create agents columns.tsx**

Column definitions for job history. The expandable row pattern needs special handling: use a custom row component in DataTable or handle expand state in the cell. Since the agent table has expandable rows that span all columns, use a custom cell in the "output" column that toggles a detail panel below.

Approach: Instead of custom DataTable row rendering, keep the expand state in a wrapper component. The DataTable handles sorting/filtering/pagination, and the job-history wrapper adds expand logic by using a custom `renderRow` prop or by handling it at the cell level.

Simpler approach: Keep job-history as a standalone component that uses `useReactTable` directly (not the generic DataTable wrapper) since the expandable row pattern doesn't fit the generic wrapper cleanly. Add sorting + pagination to it.

**Step 2: Rewrite job-history.tsx with TanStack Table directly**

Use `useReactTable` with sorting and pagination. Keep the ExpandableRow pattern. Add column header sorting for Started, Agent, Status, Duration columns.

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add src/components/admin/agents/
git commit -m "feat: upgrade job history table with TanStack sorting and pagination"
```

---

### Task 8: Final verification and cleanup

**Step 1: Full build check**

Run: `npm run build`
Expected: Clean build, no errors, no warnings.

**Step 2: Type check**

Run: `npm run type-check`
Expected: No TypeScript errors.

**Step 3: Lint**

Run: `npm run lint`
Expected: No lint errors.

**Step 4: Visual verification**

Run: `npm run dev`
Open each admin page in browser and verify:
- `/admin/clients` -- sortable headers, search, column toggle, pagination, "View Portal" link, row actions menu
- `/admin/campaigns` -- sortable headers, search, column toggle, budget bars, sparklines, sync button
- `/admin/events` -- sortable headers, search, inline ticket edit, sell-through bars, ad summary
- `/admin/users` -- sortable headers, search, invite form, role/client dropdowns, delete action
- `/admin/agents` -- sortable job history, expandable rows, pagination

**Step 5: Final commit**

If any fixes were needed during verification, commit them:

```bash
git add -A
git commit -m "fix: polish data table upgrade across all admin pages"
```
