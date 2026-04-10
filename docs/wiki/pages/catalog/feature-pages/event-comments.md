# Feature: event-comments

Generated from the current working tree on 2026-04-10 16:52:39.

- Files: 1
- Entry files: src/features/event-comments/server.ts
- Component files: none
- Client files: none
- Server files: src/features/event-comments/server.ts
- Route users: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Database objects touched: event_comments
- Depends on feature modules: none
- Used by feature modules: events (1)
- Auth/access signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Direct tests: src/app/api/event-comments/route.test.ts
- All linked tests: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/event-comments/server.ts` — exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment

## File list
- `src/features/event-comments/server.ts` — exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1
