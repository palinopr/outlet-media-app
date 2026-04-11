# Impact: src/features/client-portal/insights.ts

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Feature files
- Impact score: 70
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/lib.ts, src/features/reports/server.ts
- Tests related: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+15 more)
- DB objects: leads
- Env vars: none
- Mutation symbols: change
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: Tests / Features, src/app / client, src/features / reports
- Summary: exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4
