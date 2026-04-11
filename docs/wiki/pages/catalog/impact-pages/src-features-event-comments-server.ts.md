# Impact: src/features/event-comments/server.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Feature files
- Impact score: 68
- Ownership: feature module: event-comments
- Feature module: event-comments
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts, src/features/events/server.ts
- Tests related: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+14 more)
- DB objects: event_comments
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / api, src/app / client, src/features / events
- Summary: exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1
