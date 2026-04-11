# Impact: src/features/client-portal/access.ts

Generated from the current working tree on 2026-04-10 21:27:09.

- Category: Feature files
- Impact score: 66
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/client/[slug]/reports/page.tsx, src/features/client-agent/server.test.ts, … (+2 more)
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser(), references membership/scope access concepts
- Behavior signals: calls redirect()
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client, src/features / client-agent, src/features / client-portal
- Summary: exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi; internal imports: 3; package imports: 2
