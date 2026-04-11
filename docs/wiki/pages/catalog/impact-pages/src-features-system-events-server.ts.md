# Impact: src/features/system-events/server.ts

Generated from the current working tree on 2026-04-10 21:59:58.

- Category: Feature files
- Impact score: 148
- Ownership: feature module: system-events
- Feature module: system-events
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+5 more)
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/events.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, … (+15 more)
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/features/client-agent/server.test.ts, __tests__/api/agents.test.ts, … (+25 more)
- DB objects: system_events
- Env vars: none
- Mutation symbols: logSystemEvent, LogSystemEventInput
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / campaigns, src/features / client-agent, src/features / event-follow-up-items, src/features / events, src/lib
- Summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName; internal imports: 1; package imports: 1
