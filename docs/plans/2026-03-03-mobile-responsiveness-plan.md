# Mobile Responsiveness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every admin and client page fully mobile-friendly with card-stack tables, responsive grids, and proper touch UX.

**Architecture:** Add a `mobileCard` render prop to the shared DataTable component so all 5 admin tables automatically get mobile card views while keeping search/sort/pagination working. Fix stat grids, forms, and chart heights with targeted Tailwind class changes. Convert the agent chat panel to a full-screen Sheet on mobile.

**Tech Stack:** Tailwind CSS responsive utilities, shadcn/ui Sheet component, existing DataTable + React Table infrastructure.

---

## Task 1: Add mobile card rendering to DataTable

The shared DataTable component (`src/components/admin/data-table/data-table.tsx`) currently only renders an HTML table. Add a `mobileCard` render prop that, when provided, renders card stacks on mobile (`md:hidden`) instead of the table (`hidden md:block`).

**Files:**
- Modify: `src/components/admin/data-table/data-table.tsx`

**Step 1: Add mobileCard prop to DataTable interface**

In `src/components/admin/data-table/data-table.tsx`, add the prop to the interface (around line 29):

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
  selectionToolbar?: (selectedRows: TData[]) => React.ReactNode;
  enableRowSelection?: boolean;
  getRowId?: (row: TData) => string;
  pageSize?: number;
  mobileCard?: (row: TData) => React.ReactNode;  // <-- ADD THIS
}
```

**Step 2: Destructure the new prop**

Add `mobileCard` to the destructured props (around line 42):

```tsx
export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder,
  emptyMessage = "No results.",
  toolbar,
  selectionToolbar,
  enableRowSelection = false,
  getRowId,
  pageSize = 20,
  mobileCard,           // <-- ADD THIS
}: DataTableProps<TData, TValue>) {
```

**Step 3: Wrap the Table in responsive containers**

Replace the `<Table>...</Table>` block (lines 87-118) with responsive wrappers. The existing table gets `hidden md:block`. A new mobile card list gets `md:hidden`:

```tsx
      {/* Desktop: table */}
      <div className={mobileCard ? "hidden md:block" : undefined}>
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
                <TableRow key={row.id} className="border-border/60" data-state={row.getIsSelected() ? "selected" : undefined}>
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
      </div>

      {/* Mobile: card stack */}
      {mobileCard && (
        <div className="md:hidden">
          {table.getRowModel().rows.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id} className="px-4 py-3">
                  {mobileCard(row.original)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
```

**Step 4: Build and verify no type errors**

Run: `npx next build 2>&1 | head -50`
Expected: Build succeeds (no breaking changes since mobileCard is optional).

**Step 5: Commit**

```
feat: add mobileCard render prop to DataTable for responsive card views
```

---

## Task 2: Campaign table mobile cards

**Files:**
- Modify: `src/components/admin/campaigns/campaign-table.tsx`

**Step 1: Create mobile card renderer and pass to DataTable**

Add a `mobileCard` function and pass it to DataTable. The card shows: campaign name, status dot, then a 2-col grid with Spend, ROAS, Impressions, CTR, client slug. Add `fmtUsd`, `fmtNum`, `roasColor` imports from `@/lib/formatters` and `centsToUsd` too. Also import `getCampaignStatusCfg` from the client lib or replicate the status logic.

In `campaign-table.tsx`, update the `CampaignTable` component:

```tsx
import { fmtUsd, fmtNum, roasColor } from "@/lib/formatters";

// ... existing code ...

export function CampaignTable({ campaigns, dailyInsightsByCampaign, clients, metaAdAccountId, hasData }: CampaignTableProps) {
  const columns = getCampaignColumns({ dailyInsightsByCampaign, clients, metaAdAccountId });

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      searchColumn="name"
      searchPlaceholder="Search campaigns..."
      emptyMessage={hasData ? "No campaigns match this filter" : "No campaign data -- run the Meta sync agent to pull live data"}
      enableRowSelection
      getRowId={(row) => row.campaignId}
      selectionToolbar={(selectedRows) => (
        <AssignToolbar
          selectedRows={selectedRows as MetaCampaignCard[]}
          clients={clients}
        />
      )}
      mobileCard={(row) => {
        const c = row as MetaCampaignCard;
        const isActive = c.status === "ACTIVE";
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-400" : "bg-zinc-500"}`} />
              <p className="text-sm font-medium truncate">{c.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spend</span>
                <span className="font-medium tabular-nums">{fmtUsd(c.spend)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROAS</span>
                <span className={`font-semibold tabular-nums ${roasColor(c.roas)}`}>
                  {c.roas != null ? c.roas.toFixed(1) + "x" : "---"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impressions</span>
                <span className="tabular-nums">{fmtNum(c.impressions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">CTR</span>
                <span className="tabular-nums">{c.ctr != null ? c.ctr.toFixed(2) + "%" : "---"}</span>
              </div>
              {c.clientSlug && (
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Client</span>
                  <span>{c.clientSlug}</span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
```

Note: Check the actual field names on `MetaCampaignCard` type -- they may be `spend` (in cents via centsToUsd) or already dollars. Verify in `src/lib/meta-campaigns.ts`. The campaigns page `data.ts` likely converts to dollars before passing to the component. Adjust accordingly.

**Step 2: Build and verify**

Run: `npx next build 2>&1 | head -50`

**Step 3: Commit**

```
feat: add mobile card view for campaigns table
```

---

## Task 3: Events table mobile cards

**Files:**
- Modify: `src/components/admin/events/event-table.tsx`

**Step 1: Add mobileCard to EventTable**

```tsx
import { fmtUsd, fmtDate, fmtNum, statusBadge } from "@/lib/formatters";

export function EventTable({ events, clients, demoMap, campaigns, fromDb }: EventTableProps) {
  const columns = getEventColumns({ clients, demoMap, campaigns });

  return (
    <DataTable
      columns={columns}
      data={events}
      searchColumn="artist"
      searchPlaceholder="Search events..."
      emptyMessage={
        fromDb
          ? "No events match this filter"
          : "No event data -- start the agent to pull events from the Ticketmaster promoter portal"
      }
      mobileCard={(row) => {
        const e = row as TmEventRow;
        const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
        const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{e.artist}</p>
                <p className="text-xs text-muted-foreground truncate">{e.venue} -- {e.city}</p>
              </div>
              {statusBadge(e.status)}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{fmtDate(e.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sold</span>
                <span className="font-medium tabular-nums">{fmtNum(e.tickets_sold ?? 0)} ({pct}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross</span>
                <span className="font-medium tabular-nums">{fmtUsd(e.gross)}</span>
              </div>
              {e.client_slug && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span>{e.client_slug}</span>
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
```

Note: Check `TmEventRow` type for exact field names (should have `artist`, `venue`, `city`, `date`, `tickets_sold`, `tickets_available`, `gross`, `status`, `client_slug`).

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for events table
```

---

## Task 4: Clients table mobile cards

**Files:**
- Modify: `src/components/admin/clients/client-table.tsx`

**Step 1: Add mobileCard to ClientTable**

```tsx
import { fmtUsd } from "@/lib/formatters";
import type { ClientSummary } from "@/app/admin/clients/data";
import Link from "next/link";

// ... in ClientTable component, add mobileCard prop to DataTable:

      mobileCard={(row) => {
        const c = row as ClientSummary;
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Link href={`/admin/clients/${c.id}`} className="text-sm font-medium hover:underline truncate">
                {c.name}
              </Link>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${
                c.status === "active"
                  ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
                  : "text-zinc-400 border-zinc-500/20 bg-zinc-500/10"
              }`}>
                {c.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaigns</span>
                <span className="tabular-nums">{c.activeCampaigns} active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spend</span>
                <span className="font-medium tabular-nums">{fmtUsd(c.totalSpend)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="tabular-nums">{fmtUsd(c.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROAS</span>
                <span className="font-semibold tabular-nums">
                  {c.totalSpend > 0 ? (c.totalRevenue / c.totalSpend).toFixed(1) + "x" : "--"}
                </span>
              </div>
            </div>
          </div>
        );
      }}
```

Note: Check `ClientSummary` for exact fields. It should have `id`, `name`, `status`, `slug`, `activeCampaigns`, `totalCampaigns`, `totalSpend`, `totalRevenue`, `memberCount`.

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for clients table
```

---

## Task 5: Users table mobile cards

**Files:**
- Modify: `src/components/admin/users/user-table.tsx`

**Step 1: Add mobileCard to UserTable**

```tsx
      mobileCard={(row) => {
        const u = row as UserRow;
        const isInvited = u.status === "invited";
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{u.name || u.email}</p>
                {u.name && <p className="text-xs text-muted-foreground truncate">{u.email}</p>}
              </div>
              {isInvited && (
                <span className="text-[10px] px-2 py-0.5 rounded border text-amber-400 border-amber-500/20 bg-amber-500/10">
                  Invited
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role</span>
                <span>{u.role === "admin" ? "Admin" : "Client"}</span>
              </div>
              {u.client_slug && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client</span>
                  <span>{u.client_slug}</span>
                </div>
              )}
            </div>
          </div>
        );
      }}
```

Note: Check `UserRow` type for exact fields. Should have `name`, `email`, `role`, `status`, `client_slug`, `created_at`.

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for users table
```

---

## Task 6: Activity table mobile cards

The activity table is a standalone component, not using DataTable. Add a mobile card view directly.

**Files:**
- Modify: `src/components/admin/activity/activity-table.tsx`

**Step 1: Add mobile cards alongside the table**

Wrap the existing `<Table>` in `hidden md:block`. Add `md:hidden` card stack:

```tsx
export function ActivityTable({ rows }: { rows: ActivityRow[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No activity found for the selected filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop: table */}
      <div className="hidden md:block">
        <Table>
          {/* ... existing table code unchanged ... */}
        </Table>
      </div>

      {/* Mobile: card stack */}
      <div className="md:hidden divide-y divide-border/40">
        {rows.map((row) => {
          const style = TYPE_STYLES[row.event_type] ?? TYPE_STYLES.page_view;
          return (
            <div key={row.id} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${style.classes}`}>
                  {style.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formatTime(row.created_at)}
                </span>
              </div>
              <p className="text-xs truncate">{row.user_email}</p>
              {row.page && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">{row.page}</p>
              )}
              {row.detail && (
                <p className="text-xs text-muted-foreground mt-0.5">{row.detail}</p>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
```

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for activity table
```

---

## Task 7: Fix admin stat grids

Quick CSS-only fixes across 3 files.

**Files:**
- Modify: `src/app/admin/users/page.tsx` (line 36)
- Modify: `src/app/admin/dashboard/page.tsx` (secondary stats ~line 108)

**Step 1: Fix users page stat grid**

In `src/app/admin/users/page.tsx`, change line 36:
```
FROM: <div className="grid grid-cols-4 gap-4">
TO:   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
```

**Step 2: Fix dashboard secondary stats**

In `src/app/admin/dashboard/page.tsx`, find the secondary stats grid (around line 108):
```
FROM: <div className="grid grid-cols-3 gap-4">
TO:   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```

**Step 3: Fix dashboard campaign metrics row**

In `src/app/admin/dashboard/page.tsx`, find the campaign metrics flex container inside the active campaigns cards (around line 262). The 5 inline metric divs (`Spend`, `ROAS`, `Marginal`, `Impressions`, `CTR`) are in a `flex gap-6 shrink-0` div. Change to:
```
FROM: <div className="flex gap-6 shrink-0 text-right">
TO:   <div className="flex flex-wrap gap-x-6 gap-y-2 shrink-0 text-right">
```

**Step 4: Build and verify**

**Step 5: Commit**

```
fix: make admin stat grids responsive on mobile
```

---

## Task 8: Dashboard shows table mobile cards

The dashboard has an inline `<Table>` for shows (not using DataTable). Add mobile card view.

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`

**Step 1: Add mobile cards for the shows table**

Find the shows table section (starts around line 150). Wrap the existing `<Card><Table>...` block in `hidden md:block`. Add a `md:hidden` sibling with card stack:

```tsx
{/* Desktop: table */}
<div className="hidden md:block">
  <Card className="border-border/60">
    <Table>
      {/* ... existing table code ... */}
    </Table>
  </Card>
</div>

{/* Mobile: card stack */}
<div className="md:hidden">
  <Card className="border-border/60 divide-y divide-border/40">
    {events.length === 0 ? (
      <div className="py-12 text-center">
        <CalendarDays className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No events yet</p>
      </div>
    ) : events.slice(0, 10).map((e) => {
      const cap = (e.tickets_sold ?? 0) + (e.tickets_available ?? 0);
      const pct = cap > 0 ? Math.round(((e.tickets_sold ?? 0) / cap) * 100) : 0;
      return (
        <div key={e.id} className="px-4 py-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{e.artist}</p>
              <p className="text-xs text-muted-foreground">{e.venue} -- {e.city}</p>
            </div>
            {statusBadge(e.status)}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span>{fmtDate(e.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sold</span>
              <span className="font-medium tabular-nums">{fmtNum(e.tickets_sold ?? 0)} ({pct}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross</span>
              <span className="font-medium tabular-nums">{fmtUsd(e.gross)}</span>
            </div>
          </div>
        </div>
      );
    })}
  </Card>
</div>
```

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for dashboard shows table
```

---

## Task 9: Agents page -- full-screen chat sheet on mobile

**Files:**
- Modify: `src/app/admin/agents/page.tsx`

**Step 1: Restructure agents page layout**

The current layout is a 2-column grid with chat panel (640px) and sidebar. On mobile:
- Show sidebar (agent status + quick run) normally
- Add a "Open Chat" button that opens a full-screen Sheet
- The Sheet contains the ChatPanel

Replace the agents page body:

```tsx
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

// ... in the return:

      {/* Desktop: side-by-side */}
      <div className="hidden lg:grid grid-cols-[1fr_272px] gap-6 items-start">
        <div className="rounded-xl border border-border/60 bg-card h-[640px] flex flex-col overflow-hidden">
          <ChatPanel initialJobs={chatJobs} />
        </div>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>

      {/* Mobile: stacked with chat as sheet */}
      <div className="lg:hidden space-y-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              Open Agent Chat
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[100dvh] p-0">
            <div className="h-full flex flex-col overflow-hidden">
              <ChatPanel initialJobs={chatJobs} />
            </div>
          </SheetContent>
        </Sheet>
        <AgentSidebar isOnline={isOnline} lastSeen={lastSeen} />
      </div>
```

Note: Verify `SheetContent` supports `side="bottom"` in shadcn/ui. Check `src/components/ui/sheet.tsx`. If not, may need to add bottom variant or use `side="right"` with full width.

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: show agent chat as full-screen sheet on mobile
```

---

## Task 10: Client campaigns table mobile cards

**Files:**
- Modify: `src/app/client/[slug]/campaigns/page.tsx`

**Step 1: Add mobile card view for client campaigns table**

The table (lines 198-239) has 7 columns. Wrap in `hidden md:block`, add `md:hidden` card stack:

```tsx
{/* Desktop: table */}
<div className="hidden md:block rounded-xl border border-border/60 bg-card overflow-hidden">
  <Table>
    {/* ... existing table ... */}
  </Table>
</div>

{/* Mobile: card stack */}
<div className="md:hidden rounded-xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden">
  {campaigns.map((c) => (
    <div key={c.campaignId} className="px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${getCampaignStatusCfg(c.status).dot}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{c.name}</p>
          <p className="text-[10px] text-white/40">{getCampaignStatusCfg(c.status).label}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-white/40">Spend</span>
          <span className="font-medium tabular-nums">{fmtUsd(c.spend)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Revenue</span>
          <span className="font-medium tabular-nums">{fmtUsd(c.revenue)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">ROAS</span>
          <span className={`font-semibold tabular-nums ${roasColor(c.roas)}`}>
            {c.roas != null ? c.roas.toFixed(1) + "x" : "--"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">CTR</span>
          <span className="tabular-nums">{c.ctr != null ? c.ctr.toFixed(2) + "%" : "--"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Impressions</span>
          <span className="tabular-nums">{fmtNum(c.impressions)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">CPC</span>
          <span className="tabular-nums">{c.cpc != null ? "$" + c.cpc.toFixed(2) : "--"}</span>
        </div>
      </div>
    </div>
  ))}
</div>
```

**Step 2: Build and verify**

**Step 3: Commit**

```
feat: add mobile card view for client campaigns table
```

---

## Task 11: Chart heights and heatmap scroll

**Files:**
- Modify: `src/components/client/charts/age-distribution-chart.tsx` (line 21)
- Modify: `src/components/client/charts/time-charts.tsx` (lines 70, 129)
- Modify: `src/components/client/charts/age-gender-heatmap.tsx` (line 26)

**Step 1: Reduce chart heights on mobile**

In `age-distribution-chart.tsx` line 21:
```
FROM: <div className="h-52">
TO:   <div className="h-40 sm:h-52">
```

In `time-charts.tsx` DailyTrendChart (line 70):
```
FROM: <div className="h-52">
TO:   <div className="h-40 sm:h-52">
```

In `time-charts.tsx` DayOfWeekChart (line 129):
```
FROM: <div className="h-44">
TO:   <div className="h-36 sm:h-44">
```

**Step 2: Add sticky gender column to heatmap**

In `age-gender-heatmap.tsx`, the gender label `<td>` (line 36) needs sticky positioning:
```
FROM: <td className="py-1 text-[10px] text-white/40 font-medium">{gender}</td>
TO:   <td className="py-1 text-[10px] text-white/40 font-medium sticky left-0 bg-card z-10">{gender}</td>
```

Also make the empty corner header sticky:
```
FROM: <th className="pb-2 text-left text-[10px] text-white/25 font-medium w-16" />
TO:   <th className="pb-2 text-left text-[10px] text-white/25 font-medium w-16 sticky left-0 bg-card z-10" />
```

Note: The `bg-card` needs to match the parent card background. Check if parent uses `glass-card` class and adjust if needed (may need `bg-black/30` or similar).

**Step 3: Build and verify**

**Step 4: Commit**

```
fix: reduce chart heights on mobile and add sticky heatmap labels
```

---

## Task 12: Forms, filters, and header responsiveness

Quick CSS fixes across multiple files.

**Files:**
- Modify: `src/app/admin/campaigns/page.tsx` (filter row)
- Modify: `src/app/admin/events/page.tsx` (filter row)
- Modify: `src/app/admin/activity/page.tsx` (filter row)
- Modify: `src/app/client/[slug]/campaigns/page.tsx` (header)

**Step 1: Add flex-wrap to admin filter rows**

In `src/app/admin/campaigns/page.tsx` line 89:
```
FROM: <div className="flex items-center justify-between px-4 pt-4 pb-2">
TO:   <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
```

In `src/app/admin/events/page.tsx` line 78:
```
FROM: <div className="flex items-center justify-between px-4 pt-4 pb-2">
TO:   <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
```

In `src/app/admin/activity/page.tsx` line 77:
```
FROM: <div className="flex items-center justify-between px-4 pt-4 pb-2">
TO:   <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
```

**Step 2: Fix client campaigns page header**

In `src/app/client/[slug]/campaigns/page.tsx` line 110:
```
FROM: <div className="flex items-center justify-between mb-8">
TO:   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
```

And line 114, the right side controls:
```
FROM: <div className="flex items-center gap-4">
TO:   <div className="flex flex-wrap items-center gap-4">
```

**Step 3: Build and verify**

**Step 4: Commit**

```
fix: add flex-wrap to filter rows and headers for mobile
```

---

## Task 13: Final build verification and test

**Step 1: Full build**

Run: `npx next build`
Expected: Build succeeds with no errors.

**Step 2: Visual check on mobile viewport**

Start dev server: `npx next dev`
Test in browser at 375px width:
- `/admin/dashboard` -- stat grids stack, shows table is cards, campaign metrics wrap
- `/admin/campaigns` -- table becomes cards
- `/admin/events` -- table becomes cards
- `/admin/clients` -- table becomes cards
- `/admin/users` -- stat grid 2-col, table becomes cards
- `/admin/activity` -- table becomes cards
- `/admin/agents` -- chat is sheet button, sidebar stacks
- `/client/zamora` -- already decent
- `/client/zamora/campaigns` -- table becomes cards, header stacks

**Step 3: Commit any remaining fixes**

```
fix: address mobile responsiveness issues found in testing
```
