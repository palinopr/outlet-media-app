# Impact: src/features/event-follow-up-items/server.ts

Generated from the current working tree on 2026-04-10 16:14:38.

- Category: Feature files
- Impact score: 38
- Ownership: feature module: event-follow-up-items
- Feature module: event-follow-up-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/features/events/client-operating.ts
- Tests related: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: tm_events, event_follow_up_items, notifications
- Env vars: none
- Mutation symbols: createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, changedKeys, changedFields, CreateSystemEventFollowUpItemInput, UpdateSystemEventFollowUpItemInput
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / events
- Summary: exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6
