# Impact: src/features/client-agent/store.ts

Generated from the current working tree on 2026-04-10 21:27:09.

- Category: Feature files
- Impact score: 34
- Ownership: feature module: client-agent
- Feature module: client-agent
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/store.test.ts
- Tests related: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- DB objects: client_agent_threads, client_agent_messages
- Env vars: none
- Mutation symbols: createThread, appendUserMessage, appendAssistantMessage
- Auth signals: references membership/scope access concepts
- Behavior signals: calls notFound()
- Depends on groups: src/lib, src/features / client-agent
- Used by groups: src/features / client-agent
- Summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3
