# /admin/campaigns

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/admin/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/components/ui/card.tsx, src/components/admin/stat-card.tsx, src/app/admin/campaigns/data.ts, src/lib/constants.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/components/admin/page-header.tsx
- Feature modules touched: invitations, workflow, system-events, campaigns
- Shared libs/runtime touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts
- Database objects touched: clients, meta_campaigns, system_events, approval_requests, campaign_action_items, campaign_comments, notifications, campaign_client_overrides, admin_activity
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/campaigns`; exports: CampaignsPage, default; internal imports: 10; package imports: 2

## Stack by group
- src/app / admin: src/app/admin/campaigns/data.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, … (+2 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts
