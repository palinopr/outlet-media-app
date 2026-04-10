# src/features / events

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 2
- File kinds: TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/events/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / events
- Ownership: feature module: events
- Type: TypeScript module
- Construction: code module
- Lines: 300
- Bytes: 9416
- Imports (internal): src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/system-events/server.ts, src/features/events/summary.ts
- Imported by: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/events/[eventId]/page.tsx, src/components/admin/events/event-operating-panel.tsx, src/features/campaigns/server.ts, src/features/reports/server.ts
- Depends on groups: src/lib, src/features / system-events, src/features / events
- Used by groups: Tests / Features, src/app / admin, src/components / admin, src/features / campaigns, src/features / reports
- Feature module: events
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/admin/events/[eventId]/page.tsx
- Tests related: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+13 more)
- Tests related (direct): __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts
- Exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData
- Symbol details: function getEventRecordById (exported), function getEventOperatingData (exported), function getEventOperationsSummary (exported), function mapEventRow, interface EventOperatingRecord (exported), interface EventLinkedCampaign (exported), interface EventClientOption (exported), interface EventOperatingData (exported), interface EventLinkedCampaignRow, interface GetEventOperationsSummaryOptions
- Defines: mapEventRow, getEventRecordById, getEventOperatingData, getEventOperationsSummary, event, linkedCampaignRows, db, allowedEventIds, recentSince, allowedEventSet, eventId, EventOperationsCommentRecord, … (+9 more)
- Contents summary: exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 5

## `src/features/events/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / events
- Ownership: feature module: events
- Type: TypeScript module
- Construction: code module
- Lines: 222
- Bytes: 5973
- Imports (internal): src/lib/formatters.tsx, src/lib/workspace-types.ts
- Imported by: __tests__/features/events/summary.test.ts, src/features/events/server.ts, src/features/reports/server.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/features / events, src/features / reports
- Feature module: events
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/events/summary.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+14 more)
- Tests related (direct): __tests__/features/events/summary.test.ts
- Exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord, EventOperationsSummary
- Symbol details: function buildEventOperationsSummary (exported), function sortDateDesc, function ensureAggregate, function bumpLastActivity, type EventOperationsMetricKey (exported), interface EventOperationsMetric (exported), interface EventOperationsEventRecord (exported), interface EventOperationsFollowUpRecord (exported), interface EventOperationsCommentRecord (exported), interface EventOperationsUpdateRecord (exported), interface EventAttentionRecord (exported), interface EventOperationsSummary (exported), interface BuildEventOperationsSummaryInput
- Defines: sortDateDesc, ensureAggregate, bumpLastActivity, buildEventOperationsSummary, existing, aggregates, aggregate, ranked, openFollowUps, urgentFollowUps, openDiscussions, recentUpdates, … (+9 more)
- Contents summary: exports: buildEventOperationsSummary, EventOperationsMetricKey, EventOperationsMetric, EventOperationsEventRecord, EventOperationsFollowUpRecord, EventOperationsCommentRecord, EventOperationsUpdateRecord, EventAttentionRecord; internal imports: 2
