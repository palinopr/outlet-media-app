# /client/[slug]/event/[eventId]

Generated from the current working tree on 2026-04-10 15:42:38.

- Route file: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/formatters.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, src/features/client-portal/access.ts
- Feature modules touched: client-portal, invitations
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts, src/lib/constants.ts
- Database objects touched: tm_events, meta_campaigns, event_snapshots, tm_event_demographics, campaign_client_overrides, clients, client_members, client_member_campaigns, client_member_events, leads, client_access_invites
- Direct tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; internal imports: 10; package imports: 2

## Stack by group
- src/app / client: src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/components / client: src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, src/components/client/charts/ticket-sales-chart.tsx, … (+2 more)
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/scope.ts, src/features/client-portal/types.ts, src/features/client-portal/insights.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts, src/lib/constants.ts
