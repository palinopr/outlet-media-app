# src/features / conversations

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 2
- File kinds: TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/conversations/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / conversations
- Ownership: feature module: conversations
- Type: TypeScript module
- Construction: code module
- Lines: 263
- Bytes: 9283
- Imports (internal): src/lib/member-access.ts, src/lib/supabase.ts, src/features/assets/server.ts, src/lib/campaign-client-assignment.ts, src/features/conversations/summary.ts
- Imported by: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/dashboard/server.ts
- Depends on groups: src/lib, src/features / assets, src/features / conversations
- Used by groups: Tests / Features, src/features / dashboard
- Feature module: conversations
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, … (+16 more)
- Tests related (direct): __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- Exports: matchesConversationKinds, listConversationThreads
- Symbol details: function matchesConversationKinds (exported), function listConversationThreads (exported), function stringValue, function sortThreads, interface GetConversationsCenterOptions
- Defines: stringValue, sortThreads, matchesConversationKinds, listConversationThreads, db, limitPerKind, effectiveClientCampaignIds, allowedCampaignIds, allowedEventIds, campaignRows, rawAssetRows, eventRows, … (+17 more)
- Contents summary: exports: matchesConversationKinds, listConversationThreads; internal imports: 5

## `src/features/conversations/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / conversations
- Ownership: feature module: conversations
- Type: TypeScript module
- Construction: code module
- Lines: 15
- Bytes: 343
- Imported by: src/features/conversations/server.ts, src/features/dashboard/server.ts
- Used by groups: src/features / conversations, src/features / dashboard
- Feature module: conversations
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, … (+16 more)
- Exports: ConversationThreadKind, ConversationThread
- Symbol details: type ConversationThreadKind (exported), interface ConversationThread (exported)
- Defines: ConversationThreadKind, ConversationThread
- Contents summary: exports: ConversationThreadKind, ConversationThread
