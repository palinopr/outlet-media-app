# /client/[slug]/campaign/[campaignId]

Generated from the current working tree on 2026-04-28 02:32:49.

- Route file: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/app/client/[slug]/lib.ts
- Feature modules touched: client-portal, invitations
- Shared libs/runtime touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Database objects touched: if, meta_campaigns, calls, campaign_client_overrides, clients, client_members, client_member_campaigns, client_access_invites, leads
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 10; package imports: 3

## Stack by group
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/components/campaign-status-badge.tsx
- src/components / client: src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+1 more)
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/features/client-portal/scope.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
