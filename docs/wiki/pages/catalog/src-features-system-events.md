# src/features / system-events

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/system-events/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / system-events
- Ownership: feature module: system-events
- Type: TypeScript module
- Construction: code module
- Lines: 429
- Bytes: 14227
- Imports (internal): src/lib/supabase.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/events.ts, … (+14 more)
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / campaigns, src/features / client-agent, src/features / event-follow-up-items, src/features / events, src/lib
- Feature module: system-events
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+7 more)
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, … (+24 more)
- Tests related (direct): __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, … (+2 more)
- Exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, summarizeChangedFields, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent
- Symbol details: function filterSystemEventsByScope (exported), function getCurrentActor (exported), function logSystemEvent (exported), function listSystemEvents (exported), function listCampaignSystemEvents (exported), function summarizeChangedFields (exported), function eventMatchesCampaign, function systemEventCampaignId, function systemEventEventId, function systemEventAssetId, function normalizeScopeSet, function metadataString, function normalizeOccurredAt, function agentTaskEventId, function resolveEventSource, function resolveCorrelationId, … (+8 more)
- Defines: eventMatchesCampaign, systemEventCampaignId, systemEventEventId, systemEventAssetId, normalizeScopeSet, metadataString, normalizeOccurredAt, agentTaskEventId, resolveEventSource, resolveCorrelationId, resolveCausationId, resolveIdempotencyKey, … (+44 more)
- Contents summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, summarizeChangedFields, SystemEventName, SystemEventVisibility; internal imports: 1; package imports: 1
