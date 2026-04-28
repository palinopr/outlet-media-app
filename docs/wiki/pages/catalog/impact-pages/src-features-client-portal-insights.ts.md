# Impact: src/features/client-portal/insights.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Feature files
- Impact score: 21
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/client/[slug]/lib.ts
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- DB objects: leads, if
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client
- Summary: exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative; internal imports: 4
