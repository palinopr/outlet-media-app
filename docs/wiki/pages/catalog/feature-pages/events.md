# Feature: events

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 3
- Entry files: src/features/events/client-operating.ts, src/features/events/server.ts, src/features/events/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/events/server.ts
- Route users: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: tm_events, meta_campaigns, event_comments, event_follow_up_items, clients
- Depends on feature modules: agent-outcomes (2), event-comments (2), system-events (2), approvals (1), client-portal (1), event-follow-up-items (1)
- Used by feature modules: reports (2), campaigns (1)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, __tests__/features/events/summary.test.ts
- All linked tests: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+17 more)

## Exporting files
- `src/features/events/client-operating.ts` — exports: getClientEventOperatingView, ClientEventOperatingView
- `src/features/events/server.ts` — exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData
- `src/features/events/summary.ts` — exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord, EventOperationsSummary

## File list
- `src/features/events/client-operating.ts` — exports: getClientEventOperatingView, ClientEventOperatingView; internal imports: 8
- `src/features/events/server.ts` — exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 6
- `src/features/events/summary.ts` — exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord; internal imports: 2
