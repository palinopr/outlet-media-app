# Impact: src/features/events/server.ts

Generated from the current working tree on 2026-04-10 21:37:00.

- Category: Feature files
- Impact score: 83
- Ownership: feature module: events
- Feature module: events
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/components/admin/events/event-operating-panel.tsx, src/features/campaigns/server.ts, src/features/reports/server.ts
- Tests related: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+12 more)
- DB objects: tm_events, meta_campaigns, event_comments, event_follow_up_items, clients
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib, src-features-event-comments, src/features / system-events, src/features / events
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/components / admin, src/features / campaigns, src/features / reports
- Summary: exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 6
