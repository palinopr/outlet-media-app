# Feature: dashboard

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 2
- Entry files: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/dashboard/server.ts
- Route users: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: tm_events, meta_campaigns, system_events, campaign_action_items, campaign_comments
- Depends on feature modules: conversations (2), approvals (1)
- Used by feature modules: reports (2)
- Auth/access signals: none
- Behavior signals: none
- Direct tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/dashboard/summary.test.ts
- All linked tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+13 more)

## Exporting files
- `src/features/dashboard/server.ts` — exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter
- `src/features/dashboard/summary.ts` — exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord, DashboardOpsMetric, DashboardAttentionCampaign, DashboardOpsSummary

## File list
- `src/features/dashboard/server.ts` — exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter; internal imports: 6
- `src/features/dashboard/summary.ts` — exports: buildDashboardOpsSummary, DashboardSummaryMode, DashboardMetricKey, DashboardCampaignRecord, DashboardApprovalRecord, DashboardActionItemRecord, DashboardCommentRecord, DashboardEventRecord; internal imports: 2
