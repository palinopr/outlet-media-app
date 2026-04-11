# Impact: src/features/client-portal/config.ts

Generated from the current working tree on 2026-04-10 21:59:58.

- Category: Feature files
- Impact score: 63
- Ownership: feature module: client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/config.test.ts
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, … (+1 more)
- DB objects: clients
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / client-agent, src/features / client-portal
- Summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2
