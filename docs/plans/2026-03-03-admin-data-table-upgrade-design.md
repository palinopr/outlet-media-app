# Admin Data Table Upgrade Design

**Date:** 2026-03-03
**Status:** Approved

## Problem

All 5 admin tables (clients, campaigns, events, users, agents) are static HTML tables with no sorting, filtering, column visibility, or pagination. The client table lacks a clear "view as client" action.

## Solution

Reusable `DataTable<T>` component powered by TanStack Table + shadcn UI. Each admin table defines its own column definitions with custom cell renderers that preserve all existing interactive features.

## Architecture

```
src/components/admin/data-table/
  data-table.tsx              -- generic DataTable<T>
  data-table-toolbar.tsx      -- search input + column visibility toggle
  data-table-pagination.tsx   -- prev/next + page size selector
  column-header.tsx           -- sortable column header button

src/components/admin/clients/
  columns.tsx                 -- client column defs
  client-table.tsx            -- updated wrapper

src/components/admin/campaigns/
  columns.tsx                 -- campaign column defs
  campaign-table.tsx          -- updated wrapper

src/components/admin/events/
  columns.tsx                 -- event column defs
  event-table.tsx             -- updated wrapper

src/components/admin/users/
  columns.tsx                 -- user column defs
  user-table.tsx              -- updated wrapper

src/components/admin/agents/
  columns.tsx                 -- job history column defs
  job-history.tsx             -- updated wrapper
```

## DataTable features

- **Sorting:** Click column header to sort asc/desc (ArrowUpDown icon)
- **Search:** Text input filters on a configurable column (name, email, etc.)
- **Column visibility:** "Columns" dropdown to hide/show columns
- **Pagination:** Bottom bar with prev/next, page size (10/20/50), row count
- **Row actions:** DropdownMenu per row with context-specific actions

## Custom features preserved per table

### Campaigns
- Status dropdown (ACTIVE/PAUSED) with auto-save
- Client assignment dropdown with spinner
- Budget bar visualization (color-coded by %)
- ROAS sparkline chart + trend delta
- Marginal ROAS computation
- Sync-to-Meta confirm dialog
- External link to Meta Ads Manager

### Events
- Inline sell-through edit (tickets_sold)
- Sell bar visualization (color-coded by %)
- Client assignment dropdown
- Status dropdown (onsale/offsale/cancelled/postponed/rescheduled)
- Ad performance summary badge (active count, ROAS, spend)
- Fan demographics count
- External link to Ticketmaster

### Users
- Invite form (toggle at top)
- Role dropdown (admin/client) with auto-save
- Client assignment dropdown
- "Pending" badge for unassigned client users
- Delete action with confirm dialog

### Clients
- Create client form (toggle at top)
- Inline slug edit with validation
- Portal "View Portal" button (prominent, replaces tiny "Open" link)
- Copy portal URL button
- Deactivate confirm dialog (pauses all campaigns)
- Client name links to detail page

### Agents (Job History)
- Expandable rows for full output
- Agent name mapping (agent_id -> human name)
- Duration formatting
- Output preview (truncated)
- Filters out assistant/heartbeat jobs

## New dependencies

- `@tanstack/react-table` -- headless table engine
- shadcn `dropdown-menu` component -- column visibility + row actions

## Design decisions

- **No server-side pagination:** All tables have <100 rows. Client-side TanStack handles this fine.
- **No faceted filters:** Overkill for these data volumes. Simple text search is sufficient.
- **Keep existing cell components:** InlineEdit, StatusSelect, ConfirmDialog, CopyButton all stay as-is.
- **Generic DataTable<T>:** Type-safe with generics, columns defined per-table with `ColumnDef<T>[]`.
