# Admin Must-Have Upgrades Design

Date: 2026-03-04

## Overview

Seven improvements to the admin panel, moving it from functional to daily-driver quality. All changes are additive -- no rewrites of existing systems.

## Approach

Incremental enhancement. Each feature is a standalone component/hook that plugs into the existing admin layout and data table system. Two new dependencies: `cmdk` (may already be present via shadcn Command) and `nuqs` for URL state.

---

## Feature 1: Cmd+K Command Palette

**New file:** `src/components/admin/command-palette.tsx`

**Behavior:**
- `Cmd+K` / `Ctrl+K` opens a dialog with search input
- Uses shadcn `<Command>` component (built on cmdk)
- Three search groups: Pages (static 8 routes), Campaigns, Events, Clients
- Records fetched from Supabase on first open, cached in component state
- Campaigns show: name + status + client
- Events show: artist/event name + venue + date
- Clients show: name + slug + campaign count
- Arrow keys navigate, Enter selects (router.push), Escape closes
- Fuzzy matching handled by cmdk

**Integration:** Rendered in `admin/layout.tsx`. Keyboard listener registered globally.

---

## Feature 2: CSV Export on All Tables

**New file:** `src/lib/export-csv.ts`

**Utility function:** `exportToCsv(rows, columns, filename)`
- Takes current filtered/sorted TanStack Table data
- Maps column accessors to CSV headers
- Formats special values: cents to dollars, dates to readable strings
- Uses Blob + createObjectURL + temp anchor click (no dependencies)

**Integration:** `DataTableToolbar` gets optional `onExport` prop. Each page passes its export config. Button renders as download icon in toolbar.

**Filename:** `outlet-{section}-YYYY-MM-DD.csv`

---

## Feature 3: Collapsible Sidebar with Icon Rail

**Modified files:** `sidebar-content.tsx`, `admin/layout.tsx`

**Behavior:**
- `collapsed` state persisted in localStorage
- Toggle button (chevron) at sidebar bottom
- Collapsed: 240px -> 64px, icons only, centered
- Tooltip on hover shows page name (shadcn Tooltip)
- Logo collapses to "O" mark or small icon
- User info hidden when collapsed
- Transition: `transition-all duration-200`
- Mobile unchanged (sheet drawer)

---

## Feature 4: URL-Persisted Filters (Nuqs)

**New dependency:** `nuqs`

**Modified files:** Each table page with filters (campaigns, events, activity, clients, users)

**Behavior:**
- Replace useState filter state with useQueryState/useQueryStates from nuqs
- URL params per page:
  - Campaigns: `?client=zamora&status=ACTIVE&dateRange=30d`
  - Events: `?client=zamora&status=onsale`
  - Activity: `?user=jaime&type=page_view&days=7`
- Type-safe parsers (string, enum, number)
- Filters sync bidirectionally with URL
- Copy URL = share exact filtered view
- Browser back/forward preserves filter state

---

## Feature 5: Breadcrumb Navigation

**New file:** `src/components/admin/breadcrumbs.tsx`

**Behavior:**
- Reads usePathname(), splits into segments
- Maps to human-readable labels (e.g. `/admin/campaigns` -> `Admin > Campaigns`)
- Dynamic routes fetch entity name for display
- Uses shadcn Breadcrumb component
- Placed at top of main content area, above page content
- Last segment is plain text (current page, not linked)

---

## Feature 6: Page-Specific Loading Skeletons

**New files:** `loading.tsx` in each admin route directory

**Per-page skeletons:**
- Dashboard: 3 stat card skeletons + chart placeholder + table row shimmers
- Campaigns/Events/Clients/Users/Activity: Toolbar skeleton + table header + 8 shimmer rows
- Agents: Chat panel skeleton + job history rows

**Implementation:**
- Next.js App Router automatic loading UI
- Uses shadcn Skeleton component with animate-pulse
- Independent Suspense boundaries where sections load separately (dashboard stats vs charts vs tables)

---

## Feature 7: Bulk Actions on All Tables

**Modified files:** Events, Clients, Users column definitions + new selection toolbar components

**Extends existing campaign bulk-select pattern to:**
- Events: Bulk assign client, bulk change status
- Clients: Bulk deactivate
- Users: Bulk change role, bulk assign client

**Behavior:**
- Checkbox column added to tables that lack it
- Selection toolbar appears above table when rows selected
- Shows count ("5 selected") + action buttons/dropdowns
- Actions call existing server actions in batch (loop through selected IDs)
- Toast confirmation on completion
- Selection cleared after successful action

---

## Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| `cmdk` | Command palette (may already be shadcn dep) | ~5KB |
| `nuqs` | URL search param state management | ~3KB |

## Non-Goals

- No dark/light mode toggle (stays dark)
- No Kanban views (future)
- No saved filter presets (future)
- No real-time Supabase subscriptions (future)
