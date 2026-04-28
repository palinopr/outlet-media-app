# src/features / system-events

Generated from the current working tree on 2026-04-28 03:23:46.

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
- Lines: 268
- Bytes: 9274
- Imports (internal): src/lib/supabase.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/features/system-events/list.test.ts, src/app/admin/actions/campaigns.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / admin
- Feature module: system-events
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/system-events/list.test.ts
- Exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent
- Symbol details: function getCurrentActor (exported), function logSystemEvent (exported), function listSystemEvents (exported), function metadataString, function normalizeOccurredAt, function resolveEventSource, function resolveCorrelationId, function resolveCausationId, function resolveIdempotencyKey, function isEnvelopeSchemaError, function isSystemEventIdempotencyConflict, function mapSystemEventRow, function buildSystemEventsQuery, function toActorName, function resolveActor, const LEGACY_SYSTEM_EVENT_SELECT, … (+8 more)
- Defines: metadataString, normalizeOccurredAt, resolveEventSource, resolveCorrelationId, resolveCausationId, resolveIdempotencyKey, isEnvelopeSchemaError, isSystemEventIdempotencyConflict, mapSystemEventRow, buildSystemEventsQuery, toActorName, resolveActor, … (+23 more)
- Contents summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1
