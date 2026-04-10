# Impact: src/features/client-agent/server.ts

Generated from the current working tree on 2026-04-10 16:45:57.

- Category: Feature files
- Impact score: 41
- Ownership: feature module: client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/features/client-agent/server.test.ts
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- DB objects: none
- Env vars: none
- Mutation symbols: createThread, sendMessage, SendMessageBody
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/features / client-portal, src/features / system-events, src/features / workflow, src/lib, src/features / client-agent
- Used by groups: src/app / api, src/app / client, src/features / client-agent
- Summary: exports: listThreads, createThread, getThread, sendMessage; internal imports: 9
