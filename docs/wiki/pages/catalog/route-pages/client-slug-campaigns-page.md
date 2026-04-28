# /client/[slug]/campaigns

Generated from the current working tree on 2026-04-28 03:23:46.

- Route file: `src/app/client/[slug]/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: defines generateMetadata
- Direct internal imports: src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts, src/lib/constants.ts, src/app/client/[slug]/campaigns/campaign-range-filter.tsx
- Feature modules touched: client-portal, invitations
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Database objects touched: if, meta_campaigns, clients, client_members, client_member_campaigns, leads, client_access_invites, campaign_client_overrides
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaigns`; exports: ClientCampaigns, generateMetadata, default; internal imports: 10; package imports: 2

## Stack by group
- src/app / client: src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/types.ts
- src/components / charts: src/components/charts/roas-trend-chart.tsx
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/insights.ts, src/features/client-portal/entry.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/client-slug.ts
