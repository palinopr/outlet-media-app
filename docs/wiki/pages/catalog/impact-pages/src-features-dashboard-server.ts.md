# Impact: src/features/dashboard/server.ts

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Feature files
- Impact score: 62
- Ownership: feature module: dashboard
- Feature module: dashboard
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/reports/server.ts
- Tests related: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+10 more)
- DB objects: tm_events, meta_campaigns, system_events, campaign_action_items, campaign_comments
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / approvals, src/features / conversations, src/features / dashboard
- Used by groups: Tests / Features, src/features / reports
- Summary: exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter; internal imports: 6
