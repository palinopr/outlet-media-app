# Feature: event-comments

Generated from the current working tree on 2026-04-10 21:37:00.

- Files: 1
- Entry files: src/features/event-comments/server.ts
- Component files: none
- Client files: none
- Server files: src/features/event-comments/server.ts
- Route users: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: event_comments
- Depends on feature modules: none
- Used by feature modules: events (2)
- Auth/access signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Direct tests: src/app/api/event-comments/route.test.ts
- All linked tests: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+16 more)

## Exporting files
- `src/features/event-comments/server.ts` — exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment

## File list
- `src/features/event-comments/server.ts` — exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1
