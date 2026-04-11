# Impact: src/features/client-portal/scope.ts

Generated from the current working tree on 2026-04-10 22:25:15.

- Category: Feature files
- Impact score: 63
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/campaigns/client-operating.ts, src/features/events/client-operating.ts
- Tests related: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+9 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / api, src/app / client, src/features / campaigns, src/features / events
- Summary: exports: allowsCampaignInScope, allowsEventInScope; internal imports: 1
