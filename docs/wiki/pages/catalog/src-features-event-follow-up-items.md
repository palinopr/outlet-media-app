# src/features / event-follow-up-items

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/event-follow-up-items/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / event-follow-up-items
- Ownership: feature module: event-follow-up-items
- Type: TypeScript module
- Construction: code module
- Lines: 593
- Bytes: 19012
- Imports (internal): src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/features/notifications/workflow.ts, src/lib/supabase.ts, src/features/system-events/server.ts
- Imported by: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/api/agent-outcomes/action-item/route.ts
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: Tests / Features, src/app / admin, src/app / api
- Feature module: event-follow-up-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts
- Tests related: __tests__/features/event-follow-up-items/read-clients.test.ts
- Tests related (direct): __tests__/features/event-follow-up-items/read-clients.test.ts
- Exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility, EventFollowUpItem
- Symbol details: function listEventFollowUpItems (exported), function findEventFollowUpItemBySource (exported), function getEventFollowUpItemById (exported), function maybeEnqueueEventFollowUpItemTriage (exported), function createSystemEventFollowUpItem (exported), function updateSystemEventFollowUpItem (exported), function deleteEventFollowUpItem (exported), function shouldEnqueueEventFollowUpItemTriage, function eventFollowUpItemTriagePrompt, function listEventInfo, function mapEventFollowUpItem, const EVENT_FOLLOW_UP_ITEM_SELECT, type EventFollowUpItemVisibility (exported), interface EventFollowUpItem (exported), interface EventFollowUpItemActor, interface EventFollowUpItemTriagePreviousState, … (+3 more)
- Defines: shouldEnqueueEventFollowUpItemTriage, eventFollowUpItemTriagePrompt, listEventInfo, mapEventFollowUpItem, listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EVENT_FOLLOW_UP_ITEM_SELECT, … (+23 more)
- Contents summary: exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6
