# Admin Must-Have Upgrades Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 7 must-have features to the admin panel: Cmd+K command palette, CSV export, collapsible sidebar, URL-persisted filters, breadcrumbs, loading skeletons, and bulk actions on all tables.

**Architecture:** Each feature is a standalone component/hook that plugs into the existing admin layout and DataTable system. No rewrites -- additive changes only. Two new npm deps: `cmdk` (via shadcn Command) and `nuqs`.

**Tech Stack:** Next.js 15 App Router, shadcn/ui, TanStack Table, TypeScript, Tailwind v4, nuqs, cmdk

---

### Task 1: Install Dependencies and Add Missing shadcn Components

**Files:**
- Modify: `package.json`
- Create (via shadcn CLI): `src/components/ui/command.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/breadcrumb.tsx`

**Step 1: Install nuqs**

Run: `npm install nuqs`

**Step 2: Add shadcn Command component (includes cmdk + dialog)**

Run: `npx shadcn@latest add command`

This installs `cmdk` and creates both `command.tsx` and `dialog.tsx`.

**Step 3: Add shadcn Breadcrumb component**

Run: `npx shadcn@latest add breadcrumb`

**Step 4: Verify all components exist**

Run: `ls src/components/ui/command.tsx src/components/ui/dialog.tsx src/components/ui/breadcrumb.tsx`
Expected: All three files listed.

**Step 5: Verify the app builds**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 6: Commit**

```bash
git add package.json package-lock.json src/components/ui/command.tsx src/components/ui/dialog.tsx src/components/ui/breadcrumb.tsx
git commit -m "chore: add nuqs, shadcn command, dialog, breadcrumb components"
```

---

### Task 2: Cmd+K Command Palette

**Files:**
- Create: `src/components/admin/command-palette.tsx`
- Create: `src/app/admin/actions/search.ts` (server action to fetch searchable records)
- Modify: `src/app/admin/layout.tsx` (render CommandPalette)

**Step 1: Create the search server action**

Create `src/app/admin/actions/search.ts`:

```typescript
"use server";

import { createClient } from "@/lib/supabase";

export type SearchableRecord = {
  id: string;
  type: "campaign" | "event" | "client";
  name: string;
  subtitle: string;
  href: string;
};

export async function fetchSearchableRecords(): Promise<SearchableRecord[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const [campaigns, events, clients] = await Promise.all([
    supabase
      .from("meta_campaigns")
      .select("campaign_id, name, status, client_slug")
      .order("name"),
    supabase
      .from("tm_events")
      .select("id, name, venue_name, city, client_slug")
      .order("name"),
    supabase
      .from("clients")
      .select("id, name, slug, status")
      .order("name"),
  ]);

  const results: SearchableRecord[] = [];

  (campaigns.data ?? []).forEach((c) =>
    results.push({
      id: c.campaign_id,
      type: "campaign",
      name: c.name,
      subtitle: `${c.status} · ${c.client_slug ?? "unassigned"}`,
      href: "/admin/campaigns",
    })
  );

  (events.data ?? []).forEach((e) =>
    results.push({
      id: e.id,
      type: "event",
      name: e.name,
      subtitle: `${e.venue_name ?? ""} · ${e.city ?? ""}`,
      href: "/admin/events",
    })
  );

  (clients.data ?? []).forEach((c) =>
    results.push({
      id: c.id,
      type: "client",
      name: c.name,
      subtitle: c.slug,
      href: `/admin/clients/${c.id}`,
    })
  );

  return results;
}
```

**Step 2: Create the CommandPalette component**

Create `src/components/admin/command-palette.tsx`:

```tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, Megaphone, CalendarDays, Bot,
  Users, UserCog, Activity, Settings, Search,
} from "lucide-react";
import {
  fetchSearchableRecords,
  type SearchableRecord,
} from "@/app/admin/actions/search";

const pages = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { name: "Events", href: "/admin/events", icon: CalendarDays },
  { name: "Agents", href: "/admin/agents", icon: Bot },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Users", href: "/admin/users", icon: UserCog },
  { name: "Activity", href: "/admin/activity", icon: Activity },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const typeIcons = {
  campaign: Megaphone,
  event: CalendarDays,
  client: Users,
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState<SearchableRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open && !loaded) {
      fetchSearchableRecords().then((r) => {
        setRecords(r);
        setLoaded(true);
      });
    }
  }, [open, loaded]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, campaigns, events, clients..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((p) => (
            <CommandItem key={p.href} onSelect={() => navigate(p.href)}>
              <p.icon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        {loaded && records.length > 0 && (
          <>
            <CommandSeparator />
            {(["campaign", "event", "client"] as const).map((type) => {
              const group = records.filter((r) => r.type === type);
              if (group.length === 0) return null;
              const Icon = typeIcons[type];
              const heading =
                type === "campaign"
                  ? "Campaigns"
                  : type === "event"
                  ? "Events"
                  : "Clients";
              return (
                <CommandGroup key={type} heading={heading}>
                  {group.map((r) => (
                    <CommandItem
                      key={r.id}
                      onSelect={() => navigate(r.href)}
                    >
                      <Icon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                      <span>{r.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {r.subtitle}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
```

**Step 3: Add CommandPalette to admin layout**

Modify `src/app/admin/layout.tsx`: Import and render `<CommandPalette />` inside the layout, after the main content wrapper.

Add import:
```typescript
import { CommandPalette } from "@/components/admin/command-palette";
```

Add `<CommandPalette />` as a sibling of the main content div, inside the outer flex container.

**Step 4: Verify it works**

Run: `npm run dev`
Open browser, navigate to `/admin/dashboard`, press `Cmd+K`. Verify:
- Dialog opens with search input
- Pages group shows all 8 routes
- Typing filters results
- Selecting a page navigates to it
- Records load after first open

**Step 5: Commit**

```bash
git add src/components/admin/command-palette.tsx src/app/admin/actions/search.ts src/app/admin/layout.tsx
git commit -m "feat: add Cmd+K command palette with page and record search"
```

---

### Task 3: CSV Export

**Files:**
- Create: `src/lib/export-csv.ts`
- Modify: `src/components/admin/data-table/data-table-toolbar.tsx` (add export button)
- Modify: `src/components/admin/data-table/data-table.tsx` (pass export handler through)
- Modify: Campaign, Events, Clients, Users, Activity table wrapper components (pass onExport)

**Step 1: Create the CSV export utility**

Create `src/lib/export-csv.ts`:

```typescript
type CsvColumn = {
  header: string;
  accessor: (row: Record<string, unknown>) => string;
};

export function exportToCsv(
  rows: Record<string, unknown>[],
  columns: CsvColumn[],
  filename: string
) {
  if (rows.length === 0) return;

  const headers = columns.map((c) => c.header);
  const csvRows = rows.map((row) =>
    columns.map((col) => {
      const val = col.accessor(row);
      // Escape quotes and wrap in quotes if contains comma/newline/quote
      if (/[",\n]/.test(val)) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    })
  );

  const csv = [headers.join(","), ...csvRows.map((r) => r.join(","))].join(
    "\n"
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function centsToUsdString(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2);
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function todayFilename(section: string): string {
  const d = new Date().toISOString().split("T")[0];
  return `outlet-${section}-${d}.csv`;
}
```

**Step 2: Add export button to DataTableToolbar**

Modify `src/components/admin/data-table/data-table-toolbar.tsx`:

Add an optional `onExport` prop to the toolbar. When provided, render a Download icon button next to the columns dropdown.

```tsx
// Add to props
onExport?: () => void;

// Add button before ColumnsDropdown
{onExport && (
  <Button variant="outline" size="sm" onClick={onExport} className="h-8 gap-1">
    <Download className="h-3.5 w-3.5" />
    <span className="hidden sm:inline">Export</span>
  </Button>
)}
```

**Step 3: Thread onExport through DataTable**

Modify `src/components/admin/data-table/data-table.tsx`:

Add optional `onExport` prop to DataTable interface. Pass it to DataTableToolbar.

**Step 4: Add export configs to each table**

For each table wrapper component (campaign-table, event-table, client-table, user-table, activity-table), define a `CsvColumn[]` array mapping the table's data to export columns, and pass an `onExport` callback to the DataTable.

Example for campaigns:
```typescript
import { exportToCsv, centsToUsdString, todayFilename } from "@/lib/export-csv";

const campaignCsvColumns = [
  { header: "Name", accessor: (r: any) => r.name ?? "" },
  { header: "Status", accessor: (r: any) => r.status ?? "" },
  { header: "Client", accessor: (r: any) => r.client_slug ?? "" },
  { header: "Spend", accessor: (r: any) => centsToUsdString(r.spend) },
  { header: "ROAS", accessor: (r: any) => String(r.roas ?? "") },
  { header: "Impressions", accessor: (r: any) => String(r.impressions ?? "") },
  { header: "CTR", accessor: (r: any) => String(r.ctr ?? "") },
];

// In component:
onExport={() => exportToCsv(data, campaignCsvColumns, todayFilename("campaigns"))}
```

Repeat similar patterns for events (name, venue, city, date, tickets_sold, gross, status), clients (name, slug, status, spend, roas), users (name, email, role, client), activity (timestamp, user, type, page, detail).

**Step 5: Verify exports work**

Run: `npm run dev`
Navigate to each table page. Click Export button. Verify:
- CSV downloads with correct filename
- Headers match expected columns
- Data is properly formatted (dollars not cents, dates readable)
- Empty values handled (no "null" or "undefined" strings)

**Step 6: Commit**

```bash
git add src/lib/export-csv.ts src/components/admin/data-table/data-table-toolbar.tsx src/components/admin/data-table/data-table.tsx
git add src/components/admin/campaigns/campaign-table.tsx src/components/admin/events/event-table.tsx
git add src/components/admin/clients/client-table.tsx src/components/admin/users/user-table.tsx
git add src/components/admin/activity/activity-table.tsx
git commit -m "feat: add CSV export to all admin data tables"
```

---

### Task 4: Collapsible Sidebar with Icon Rail

**Files:**
- Create: `src/hooks/use-sidebar-state.ts`
- Modify: `src/components/admin/sidebar-content.tsx`
- Modify: `src/components/admin/nav-links.tsx`
- Modify: `src/app/admin/layout.tsx`

**Step 1: Create sidebar state hook**

Create `src/hooks/use-sidebar-state.ts`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "admin-sidebar-collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { collapsed, toggle, hydrated };
}
```

**Step 2: Update SidebarContent to accept collapsed prop**

Modify `src/components/admin/sidebar-content.tsx`:

Add `collapsed` prop. When collapsed:
- Logo section shows only the icon/first letter, no text
- NavLinks receives `collapsed` prop
- User info section hidden
- Width controlled by parent

**Step 3: Update NavLinks for collapsed mode**

Modify `src/components/admin/nav-links.tsx`:

Add `collapsed` prop. When collapsed:
- Show only the icon (no label text)
- Center icon in the link
- Wrap each link in `<Tooltip>` (from shadcn) showing the page name on hover
- Maintain active state styling

```tsx
// When collapsed:
<TooltipProvider delayDuration={0}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Link href={item.href} className="flex items-center justify-center h-10 w-10 rounded-md ...">
        <item.icon className="h-5 w-5" />
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">{item.name}</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Step 4: Update admin layout for collapsible sidebar**

Modify `src/app/admin/layout.tsx`:

- Make the desktop sidebar a client component wrapper that uses `useSidebarState`
- Sidebar width: `collapsed ? "w-16" : "w-60"` with `transition-all duration-200`
- Main content margin adjusts: `collapsed ? "lg:ml-16" : "lg:ml-60"`
- Add toggle button (ChevronsLeft / ChevronsRight icon) at bottom of sidebar
- Mobile sidebar unchanged

**Step 5: Verify sidebar behavior**

Run: `npm run dev`
Verify:
- Desktop: Click toggle collapses to icon rail (64px)
- Hover on icons shows tooltip with page name
- Active state preserved
- Click toggle again expands
- State persists across page refreshes (localStorage)
- Mobile: Sheet drawer unchanged, still full sidebar

**Step 6: Commit**

```bash
git add src/hooks/use-sidebar-state.ts src/components/admin/sidebar-content.tsx src/components/admin/nav-links.tsx src/app/admin/layout.tsx
git commit -m "feat: collapsible sidebar with icon rail and tooltip labels"
```

---

### Task 5: URL-Persisted Filters (Nuqs)

**Files:**
- Modify: `src/app/admin/campaigns/page.tsx`
- Modify: `src/app/admin/events/page.tsx`
- Modify: `src/app/admin/activity/page.tsx`
- Modify: `src/app/admin/layout.tsx` (wrap with NuqsAdapter if needed)
- Modify: Filter components (DateRangeFilter, ClientFilter, ActivityFilters)

**Step 1: Add NuqsAdapter to admin layout**

Nuqs requires a `<NuqsAdapter>` in App Router. Add it to `src/app/admin/layout.tsx` wrapping the children.

```tsx
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Wrap content with:
<NuqsAdapter>{children}</NuqsAdapter>
```

**Step 2: Convert campaign filters to nuqs**

Modify `src/app/admin/campaigns/page.tsx` and its filter components:

Replace `useState` for client and dateRange with `useQueryState`:

```tsx
import { useQueryState, parseAsString } from "nuqs";

const [client, setClient] = useQueryState("client", parseAsString.withDefault("all"));
const [dateRange, setDateRange] = useQueryState("range", parseAsString.withDefault("lifetime"));
```

Filter components receive value/onChange as before, but now backed by URL state.

**Step 3: Convert event filters to nuqs**

Same pattern for `src/app/admin/events/page.tsx` -- the ClientFilter.

**Step 4: Convert activity filters to nuqs**

`src/app/admin/activity/page.tsx` has user, event type, and date range filters. Convert all three:

```tsx
const [user, setUser] = useQueryState("user", parseAsString.withDefault("all"));
const [eventType, setEventType] = useQueryState("type", parseAsString.withDefault("all"));
const [days, setDays] = useQueryState("days", parseAsString.withDefault("7"));
```

**Step 5: Verify URL state works**

Run: `npm run dev`
Navigate to `/admin/campaigns`. Set client filter to "zamora". Verify:
- URL changes to `/admin/campaigns?client=zamora`
- Copy URL, open in new tab -- same filter applied
- Browser back restores previous filter
- Clearing filter removes param from URL

Repeat for events and activity pages.

**Step 6: Commit**

```bash
git add src/app/admin/layout.tsx src/app/admin/campaigns/ src/app/admin/events/ src/app/admin/activity/
git commit -m "feat: URL-persisted filters using nuqs on campaigns, events, activity"
```

---

### Task 6: Breadcrumb Navigation

**Files:**
- Create: `src/components/admin/breadcrumbs.tsx`
- Modify: `src/app/admin/layout.tsx` (render breadcrumbs)

**Step 1: Create the Breadcrumbs component**

Create `src/components/admin/breadcrumbs.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

const labelMap: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  campaigns: "Campaigns",
  events: "Events",
  agents: "Agents",
  clients: "Clients",
  users: "Users",
  activity: "Activity",
  settings: "Settings",
};

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs on root admin page
  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => ({
    label: labelMap[seg] ?? decodeURIComponent(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
```

**Step 2: Add breadcrumbs to admin layout**

Modify `src/app/admin/layout.tsx`: Render `<AdminBreadcrumbs />` at the top of the main content area, before `{children}`.

**Step 3: Verify breadcrumbs render correctly**

Run: `npm run dev`
Navigate through admin pages. Verify:
- `/admin/dashboard` shows: `Admin > Dashboard`
- `/admin/campaigns` shows: `Admin > Campaigns`
- `/admin/clients/123` shows: `Admin > Clients > 123` (or client name if resolved)
- "Admin" links back to `/admin`
- Last segment is plain text, not a link
- Not shown on `/admin` root

**Step 4: Commit**

```bash
git add src/components/admin/breadcrumbs.tsx src/app/admin/layout.tsx
git commit -m "feat: add breadcrumb navigation to admin pages"
```

---

### Task 7: Enhance Loading Skeletons

**Files:**
- Modify: `src/app/admin/dashboard/loading.tsx`
- Modify: `src/app/admin/campaigns/loading.tsx`
- Modify: `src/app/admin/events/loading.tsx`
- Modify: `src/app/admin/agents/loading.tsx`
- Modify: `src/app/admin/clients/loading.tsx`
- Modify: `src/app/admin/users/loading.tsx`
- Create: `src/app/admin/activity/loading.tsx`

Existing loading files: dashboard (55 lines), campaigns (54), events (54), agents (69), clients (19), users (19). Clients and users are minimal and need enhancement. Activity has none.

**Step 1: Enhance clients loading skeleton**

Modify `src/app/admin/clients/loading.tsx` to match the clients page layout:
- Header skeleton (title + badge)
- 4 stat card skeletons in a row
- Table toolbar skeleton (search input + columns button + export button)
- Table header row
- 8 shimmer table body rows

**Step 2: Enhance users loading skeleton**

Modify `src/app/admin/users/loading.tsx` with same pattern as clients.

**Step 3: Create activity loading skeleton**

Create `src/app/admin/activity/loading.tsx`:
- Header skeleton
- 4 stat card skeletons
- Filter bar skeleton (3 dropdowns)
- Table with 8 rows

**Step 4: Review and enhance existing skeletons**

Check dashboard, campaigns, events, agents loading files. If they don't match their page layout closely enough, update them to include:
- Correct number of stat cards
- Chart placeholder area (dashboard)
- Filter bar (campaigns, events)
- Correct table column widths

**Step 5: Verify skeletons display**

Run: `npm run dev`
Add `await new Promise(r => setTimeout(r, 2000))` temporarily at top of each page's data fetch to simulate slow loading. Navigate to each page and verify the skeleton matches the real layout. Remove the delay.

**Step 6: Commit**

```bash
git add src/app/admin/clients/loading.tsx src/app/admin/users/loading.tsx src/app/admin/activity/loading.tsx
git add src/app/admin/dashboard/loading.tsx src/app/admin/campaigns/loading.tsx src/app/admin/events/loading.tsx src/app/admin/agents/loading.tsx
git commit -m "feat: page-specific loading skeletons for all admin pages"
```

---

### Task 8: Bulk Actions on Events, Clients, and Users Tables

**Files:**
- Modify: `src/components/admin/events/event-table.tsx` (add selection + toolbar)
- Modify: `src/components/admin/events/columns.tsx` (add checkbox column)
- Modify: `src/components/admin/clients/client-table.tsx` (add selection + toolbar)
- Modify: `src/components/admin/clients/columns.tsx` (add checkbox column)
- Modify: `src/components/admin/users/user-table.tsx` (add selection + toolbar)
- Modify: `src/components/admin/users/columns.tsx` (add checkbox column)
- Modify: `src/app/admin/actions/events.ts` (add bulk actions)
- Modify: `src/app/admin/actions/clients.ts` (add bulk actions)
- Modify: `src/app/admin/actions/users.ts` (add bulk actions)

**Step 1: Add bulk server actions for events**

Modify `src/app/admin/actions/events.ts`:

```typescript
export async function bulkAssignClient(eventIds: string[], clientSlug: string) {
  const supabase = createClient();
  if (!supabase) return { error: "No database connection" };
  const { error } = await supabase
    .from("tm_events")
    .update({ client_slug: clientSlug })
    .in("id", eventIds);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  return { success: true };
}

export async function bulkUpdateEventStatus(eventIds: string[], status: string) {
  const supabase = createClient();
  if (!supabase) return { error: "No database connection" };
  const { error } = await supabase
    .from("tm_events")
    .update({ status })
    .in("id", eventIds);
  if (error) return { error: error.message };
  revalidatePath("/admin/events");
  return { success: true };
}
```

**Step 2: Add checkbox column and selection toolbar to events table**

Modify `src/components/admin/events/columns.tsx`: Add checkbox column as first column (same pattern as campaigns).

Modify `src/components/admin/events/event-table.tsx`:
- Enable row selection: `enableRowSelection={true}` and `getRowId={(row) => row.id}`
- Add `selectionToolbar` render function showing:
  - "X selected"
  - Client assign dropdown (reuse ClientFilter pattern)
  - Status change dropdown
  - Actions call `bulkAssignClient` or `bulkUpdateEventStatus`
  - Toast on success, clear selection

**Step 3: Add bulk server actions for clients**

Modify `src/app/admin/actions/clients.ts`:

```typescript
export async function bulkDeactivateClients(clientIds: string[]) {
  const supabase = createClient();
  if (!supabase) return { error: "No database connection" };
  const { error } = await supabase
    .from("clients")
    .update({ status: "inactive" })
    .in("id", clientIds);
  if (error) return { error: error.message };
  revalidatePath("/admin/clients");
  return { success: true };
}
```

**Step 4: Add checkbox column and selection toolbar to clients table**

Modify `src/components/admin/clients/columns.tsx`: Add checkbox column.

Modify `src/components/admin/clients/client-table.tsx`:
- Enable row selection
- Selection toolbar with "Deactivate" button + confirmation
- Toast on success

**Step 5: Add bulk server actions for users**

Modify `src/app/admin/actions/users.ts`:

```typescript
export async function bulkUpdateRole(userIds: string[], role: string) {
  // Update role for multiple users via Clerk API
}

export async function bulkAssignUserClient(userIds: string[], clientSlug: string) {
  // Update client assignment for multiple users
}
```

**Step 6: Add checkbox column and selection toolbar to users table**

Modify `src/components/admin/users/columns.tsx`: Add checkbox column.

Modify `src/components/admin/users/user-table.tsx`:
- Enable row selection
- Selection toolbar: Role change dropdown + Client assign dropdown
- Toast on success

**Step 7: Verify all bulk actions work**

Run: `npm run dev`
For each table (events, clients, users):
- Select multiple rows via checkboxes
- Verify selection toolbar appears with correct count
- Execute a bulk action
- Verify toast appears and data updates
- Verify selection clears after action

**Step 8: Commit**

```bash
git add src/components/admin/events/ src/components/admin/clients/ src/components/admin/users/
git add src/app/admin/actions/events.ts src/app/admin/actions/clients.ts src/app/admin/actions/users.ts
git commit -m "feat: bulk actions on events, clients, and users tables"
```

---

## Task Order and Dependencies

```
Task 1 (deps + shadcn components) -- blocks Tasks 2, 5, 6
Task 2 (Cmd+K) -- independent after Task 1
Task 3 (CSV export) -- independent
Task 4 (sidebar) -- independent
Task 5 (nuqs filters) -- independent after Task 1
Task 6 (breadcrumbs) -- independent after Task 1
Task 7 (skeletons) -- independent
Task 8 (bulk actions) -- independent
```

Tasks 2-8 can be parallelized after Task 1 completes.

## Verification Checklist

After all tasks complete:
- [ ] `npm run build` succeeds with no errors
- [ ] Cmd+K opens, searches pages and records, navigates correctly
- [ ] Export CSV works on all 5 tables with correct formatting
- [ ] Sidebar collapses/expands, persists state, tooltips work
- [ ] URL params persist filters on campaigns, events, activity
- [ ] Breadcrumbs show on all admin pages with correct hierarchy
- [ ] Loading skeletons match page layouts on all 7 admin pages
- [ ] Bulk select + actions work on events, clients, users tables
- [ ] Mobile views unaffected -- all features degrade gracefully
