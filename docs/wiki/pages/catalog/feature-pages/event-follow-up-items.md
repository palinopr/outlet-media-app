# Feature: event-follow-up-items

Generated from the current working tree on 2026-04-10 16:45:57.

- Files: 1
- Entry files: src/features/event-follow-up-items/server.ts
- Component files: none
- Client files: none
- Server files: src/features/event-follow-up-items/server.ts
- Route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Database objects touched: tm_events, event_follow_up_items, notifications
- Depends on feature modules: notifications (1), system-events (1)
- Used by feature modules: events (1)
- Auth/access signals: none
- Behavior signals: none
- Direct tests: __tests__/features/event-follow-up-items/read-clients.test.ts
- All linked tests: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/event-follow-up-items/server.ts` — exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility, EventFollowUpItem

## File list
- `src/features/event-follow-up-items/server.ts` — exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6
