# /admin/events

Generated from the current working tree on 2026-04-10 18:46:37.

- Route file: `src/app/admin/events/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/admin/stat-card.tsx, src/app/admin/events/data.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/events/event-table.tsx, src/lib/formatters.tsx, src/components/admin/page-header.tsx
- Feature modules touched: invitations, workflow, system-events
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/constants.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/campaign-event-match.ts, src/lib/api-helpers.ts
- Database objects touched: clients, tm_events, meta_campaigns, tm_event_demographics, campaign_client_overrides, event_comments, event_follow_up_items, admin_activity, system_events
- Direct tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/events`; exports: EventsPage, default; internal imports: 8; package imports: 2

## Stack by group
- src/app / admin: src/app/admin/events/data.ts, src/app/admin/actions/events.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/events/event-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/events/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, src/components/admin/inline-edit.tsx, … (+1 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/dropdown-menu.tsx
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/constants.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/campaign-event-match.ts, src/lib/api-helpers.ts
