# /admin/clients/[id]

Generated from the current working tree on 2026-04-10 16:45:57.

- Route file: `src/app/admin/clients/[id]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: calls notFound(), sets dynamic rendering mode
- Direct internal imports: src/app/admin/clients/data.ts, src/components/admin/clients/client-detail.tsx
- Feature modules touched: clients, invitations, settings, access
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Database objects touched: clients, tm_events, meta_campaigns, client_accounts, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, client_members, client_member_campaigns, client_member_events, ad_assets, campaign_client_overrides, … (+14 more)
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js page for `/admin/clients/[id]`; exports: ClientDetailPage, dynamic, default; internal imports: 2; package imports: 1

## Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/users.ts
- src/components / admin: src/components/admin/clients/client-detail.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/events-section.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/invite-member-form.tsx, … (+1 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/button.tsx, src/components/ui/switch.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/lib: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
