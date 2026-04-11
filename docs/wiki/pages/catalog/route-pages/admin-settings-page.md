# /admin/settings

Generated from the current working tree on 2026-04-10 21:59:58.

- Route file: `src/app/admin/settings/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/client-onboard-form.tsx, src/components/admin/agents/constants.ts, src/components/admin/users/revoke-invitation-button.tsx, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/components/admin/stat-card.tsx, src/lib/formatters.tsx, src/features/settings/summary.ts, … (+4 more)
- Feature modules touched: settings, clients, invitations, shared, access
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/utils.ts, src/lib/to-slug.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/client-slug.ts
- Database objects touched: client_accounts, clients, tm_events, meta_campaigns, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, client_members, client_member_campaigns, client_member_events, ad_assets, system_events, … (+14 more)
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/settings`; exports: SettingsPage, default; internal imports: 14; package imports: 2

## Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/admin/clients/types.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/client-onboard-form.tsx, src/components/admin/agents/constants.ts, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/summary.ts, src/features/settings/connected-accounts.ts
- src/features / shared: src/features/shared/admin-summary-types.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/utils.ts, src/lib/to-slug.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/client-slug.ts
