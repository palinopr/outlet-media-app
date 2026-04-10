# src/features / reports

Generated from the current working tree on 2026-04-10 16:45:57.

- Files: 3
- File kinds: TypeScript module (2), React/TSX module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/reports/components/reports-surface.tsx`
- Status: tracked-clean
- System: web
- Group: src/features / reports
- Ownership: feature module: reports
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 207
- Bytes: 8666
- Imports (internal): src/lib/formatters.tsx, src/features/reports/server.ts
- Imports (packages): lucide-react
- Imported by: src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx
- Depends on groups: src/lib, src/features / reports
- Used by groups: src/app / admin, src/app / client
- Feature module: reports
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx
- Routes related (direct): src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx
- Tests related: src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx
- Exports: ReportsSurface
- Symbol details: function ReportsSurface (exported), function formatRoas, interface ReportsSurfaceProps
- Defines: formatRoas, ReportsSurface, summaryCards, Icon, ReportsSurfaceProps
- Contents summary: exports: ReportsSurface; internal imports: 2; package imports: 1

## `src/features/reports/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / reports
- Ownership: feature module: reports
- Type: TypeScript module
- Construction: code module
- Lines: 211
- Bytes: 6816
- Imports (internal): src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/lib/constants.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/dashboard/server.ts, … (+4 more)
- Imported by: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+8 more)
- Depends on groups: src/features / client-portal, src/lib, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / reports
- Used by groups: Tests / Features, src/app / admin, src/app / client, src/features / client-agent, src/features / reports
- Feature module: reports
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx
- Tests related: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+10 more)
- Tests related (direct): __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+2 more)
- Exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData
- Symbol details: function getReportsData (exported), function getReportsWorkflowData (exported), function detectPlatform, function toReportsCampaign, function toReportsEvent, interface ReportsData (exported), interface ReportsWorkflowData (exported), interface GetReportsDataOptions, interface GetReportsWorkflowDataOptions
- Defines: detectPlatform, toReportsCampaign, toReportsEvent, getReportsData, getReportsWorkflowData, sold, available, capacity, sellThrough, reportsDb, result, allowed, … (+15 more)
- Contents summary: exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData; internal imports: 14

## `src/features/reports/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / reports
- Ownership: feature module: reports
- Type: TypeScript module
- Construction: code module
- Lines: 101
- Bytes: 2453
- Imported by: __tests__/features/reports/summary.test.ts, src/features/reports/server.ts
- Used by groups: Tests / Features, src/features / reports
- Feature module: reports
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/reports/summary.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+11 more)
- Tests related (direct): __tests__/features/reports/summary.test.ts
- Exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
- Symbol details: function buildReportsSummary (exported), interface ReportsCampaignCard (exported), interface ReportsEventCard (exported), interface ReportsSummary (exported)
- Defines: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
- Contents summary: exports: buildReportsSummary, ReportsCampaignCard, ReportsEventCard, ReportsSummary
