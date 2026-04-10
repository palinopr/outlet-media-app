# /admin/clients

Generated from the current working tree on 2026-04-10 18:02:26.

- Route file: `src/app/admin/clients/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/app/admin/clients/data.ts, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/features/clients/summary.ts, src/components/admin/page-header.tsx
- Feature modules touched: clients, invitations, settings, access
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/to-slug.ts, src/lib/export-csv.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Database objects touched: clients, tm_events, meta_campaigns, client_accounts, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, client_members, client_member_campaigns, client_member_events, ad_assets, campaign_client_overrides, … (+14 more)
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/clients`; exports: ClientsPage, default; internal imports: 8; package imports: 2

## Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/inline-edit.tsx, src/components/admin/copy-button.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/column-header.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/to-slug.ts, src/lib/export-csv.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
