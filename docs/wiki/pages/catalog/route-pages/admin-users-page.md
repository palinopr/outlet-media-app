# /admin/users

Generated from the current working tree on 2026-04-10 15:42:38.

- Route file: `src/app/admin/users/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: sets dynamic rendering mode
- Direct internal imports: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/lib/formatters.tsx, src/features/users/summary.ts, src/components/admin/page-header.tsx
- Feature modules touched: users, invitations, clients, settings, shared, access
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts
- Database objects touched: clients, client_members, tm_events, meta_campaigns, client_accounts, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, client_member_campaigns, client_member_events, ad_assets, client_access_invites, … (+2 more)
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/users`; exports: UsersPage, dynamic, default; internal imports: 10; package imports: 2

## Stack by group
- src/app / admin: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/users.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/features / shared: src/features/shared/admin-summary-types.ts
- src/features / users: src/features/users/summary.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts
