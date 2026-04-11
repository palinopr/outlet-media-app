# src-features-event-comments

Generated from the current working tree on 2026-04-10 21:59:58.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/event-comments/server.ts`
- Status: tracked-clean
- System: web
- Group: src-features-event-comments
- Ownership: feature module: event-comments
- Type: TypeScript module
- Construction: code module
- Lines: 100
- Bytes: 2993
- Imports (internal): src/lib/member-access.ts, src/lib/supabase.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts, src/features/events/server.ts
- Depends on groups: src/lib
- Used by groups: src/app / api, src/app / client, src/features / events
- Feature module: event-comments
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Routes related (direct): src/app/api/event-comments/route.ts
- Tests related: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, … (+18 more)
- Tests related (direct): src/app/api/event-comments/route.test.ts
- Exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment
- Symbol details: function listEventComments (exported), function canAccessEventComments (exported), function mapEventComment, type EventCommentVisibility (exported), interface EventComment (exported), interface ListEventCommentsOptions
- Defines: mapEventComment, listEventComments, canAccessEventComments, db, user, role, isAdmin, access, EventCommentVisibility, EventComment, ListEventCommentsOptions
- Contents summary: exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1
