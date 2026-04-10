# Feature: events

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 2
- Entry files: src/features/events/server.ts, src/features/events/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/events/server.ts
- Route users: src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: tm_events, meta_campaigns, event_comments, event_follow_up_items, clients
- Depends on feature modules: system-events (1)
- Used by feature modules: reports (2), campaigns (1)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/events/summary.test.ts
- All linked tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+12 more)

## Exporting files
- `src/features/events/server.ts` — exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData
- `src/features/events/summary.ts` — exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord, EventOperationsSummary

## File list
- `src/features/events/server.ts` — exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 5
- `src/features/events/summary.ts` — exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord; internal imports: 2
