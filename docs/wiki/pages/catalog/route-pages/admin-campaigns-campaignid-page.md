# /admin/campaigns/[campaignId]

Generated from the current working tree on 2026-04-28 02:57:59.

- Route file: `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: calls notFound()
- Direct internal imports: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Feature modules touched: campaigns, invitations, system-events
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/utils.ts
- Database objects touched: if, meta_campaigns, clients, system_events, campaign_client_overrides, admin_activity
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 5; package imports: 3

## Stack by group
- src/app / admin: src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/button.tsx
- src/features / campaigns: src/features/campaigns/server.ts, src/features/campaigns/revalidation.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/utils.ts
