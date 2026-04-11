# Impact: src/lib/meta-api.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Shared web libraries
- Impact score: 70
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/reports/server.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+15 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / App, src/app / client, src/features / reports, src/lib
- Summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1
