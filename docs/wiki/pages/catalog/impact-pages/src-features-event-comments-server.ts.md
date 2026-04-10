# Impact: src/features/event-comments/server.ts

Generated from the current working tree on 2026-04-10 16:52:39.

- Category: Feature files
- Impact score: 20
- Ownership: feature module: event-comments
- Feature module: event-comments
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts
- Tests related: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: event_comments
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / api, src/app / client, src/features / events
- Summary: exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1
