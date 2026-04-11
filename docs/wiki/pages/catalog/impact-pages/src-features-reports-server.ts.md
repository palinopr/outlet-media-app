# Impact: src/features/reports/server.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Feature files
- Impact score: 76
- Ownership: feature module: reports
- Feature module: reports
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, … (+6 more)
- Tests related: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/app/shell-import-smoke.test.ts, src/features/client-agent/runtime.test.ts, … (+6 more)
- DB objects: tm_events, clients
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/features / client-portal, src/lib, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / reports
- Used by groups: Tests / Features, src/app / admin, src/app / client, src/features / client-agent, src/features / reports
- Summary: exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData; internal imports: 14
