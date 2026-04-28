# Feature: system-events

Generated from the current working tree on 2026-04-28 02:31:12.

- Files: 1
- Entry files: src/features/system-events/server.ts
- Component files: none
- Client files: none
- Server files: src/features/system-events/server.ts
- Route users: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Database objects touched: system_events, if
- Depends on feature modules: none
- Used by feature modules: none
- Auth/access signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Direct tests: __tests__/features/system-events/list.test.ts
- All linked tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/system-events/server.ts` — exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent

## File list
- `src/features/system-events/server.ts` — exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1
