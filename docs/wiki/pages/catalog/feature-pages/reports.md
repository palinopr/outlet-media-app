# Feature: reports

Generated from the current working tree on 2026-04-10 21:51:44.

- Files: 3
- Entry files: src/features/reports/server.ts, src/features/reports/summary.ts
- Component files: src/features/reports/components/reports-surface.tsx
- Client files: none
- Server files: src/features/reports/server.ts
- Route users: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: tm_events, clients
- Depends on feature modules: client-portal (2), agent-outcomes (2), dashboard (2), events (2)
- Used by feature modules: client-agent (10)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+1 more)
- All linked tests: src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+9 more)

## Exporting files
- `src/features/reports/components/reports-surface.tsx` — exports: ReportsSurface
- `src/features/reports/server.ts` — exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData
- `src/features/reports/summary.ts` — exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary

## File list
- `src/features/reports/components/reports-surface.tsx` — exports: ReportsSurface; internal imports: 2; package imports: 1
- `src/features/reports/server.ts` — exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData; internal imports: 14
- `src/features/reports/summary.ts` — exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
