# src/features / dashboard

Generated from the current working tree on 2026-04-10 21:51:44.

- Files: 2
- File kinds: TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/dashboard/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / dashboard
- Ownership: feature module: dashboard
- Type: TypeScript module
- Construction: code module
- Lines: 454
- Bytes: 14240
- Imports (internal): src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/approvals/server.ts, src/features/conversations/server.ts, src/features/conversations/summary.ts, src/features/dashboard/summary.ts
- Imported by: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/reports/server.ts
- Depends on groups: src/lib, src/features / approvals, src/features / conversations, src/features / dashboard
- Used by groups: Tests / Features, src/features / reports
- Feature module: dashboard
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Tests related (direct): __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts
- Exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter
- Symbol details: function getDashboardOpsSummary (exported), function getDashboardActionCenter (exported), function emptySummary, function resolveCampaignId, function resolveCampaignName, function resolveAssetId, function resolveAssetName, function resolveEventId, function resolveEventName, type DashboardActionCenterDiscussion (exported), interface DashboardActionCenterApproval (exported), interface DashboardActionCenter (exported), interface GetDashboardOpsSummaryOptions, interface GetDashboardActionCenterOptions
- Defines: emptySummary, resolveCampaignId, resolveCampaignName, resolveAssetId, resolveAssetName, resolveEventId, resolveEventName, getDashboardOpsSummary, getDashboardActionCenter, campaignId, metadataName, assetId, … (+29 more)
- Contents summary: exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter; internal imports: 6

## `src/features/dashboard/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / dashboard
- Ownership: feature module: dashboard
- Type: TypeScript module
- Construction: code module
- Lines: 291
- Bytes: 8103
- Imports (internal): src/lib/formatters.tsx, src/lib/workspace-types.ts
- Imported by: __tests__/features/dashboard/summary.test.ts, src/features/dashboard/server.ts, src/features/reports/server.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/features / dashboard, src/features / reports
- Feature module: dashboard
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/dashboard/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+15 more)
- Tests related (direct): __tests__/features/dashboard/summary.test.ts
- Exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord, DashboardOpsMetric, DashboardAttentionCampaign, DashboardOpsSummary
- Symbol details: function buildDashboardOpsSummary (exported), function fallbackCampaignName, function metadataString, function resolveCampaignId, function sortDateDesc, function buildMetrics, function ensureAggregate, function bumpLastActivity, type DashboardSummaryMode (exported), type DashboardMetricKey (exported), type CampaignAggregate, interface DashboardCampaignRecord (exported), interface DashboardApprovalRecord (exported), interface DashboardActionItemRecord (exported), interface DashboardCommentRecord (exported), interface DashboardEventRecord (exported), … (+4 more)
- Defines: fallbackCampaignName, metadataString, resolveCampaignId, sortDateDesc, buildMetrics, ensureAggregate, bumpLastActivity, buildDashboardOpsSummary, value, existing, aggregates, campaignId, … (+20 more)
- Contents summary: exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord; internal imports: 2
