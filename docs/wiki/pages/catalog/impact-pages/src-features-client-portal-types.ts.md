# Impact: src/features/client-portal/types.ts

Generated from the current working tree on 2026-04-10 22:25:15.

- Category: Feature files
- Impact score: 70
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/dashboard/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts, src/features/reports/server.ts
- Tests related: src/app/client/[slug]/lib.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+15 more)
- DB objects: tm_events, tm_event_demographics
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / client, src/features / client-portal, src/features / reports
- Summary: exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile; internal imports: 1
