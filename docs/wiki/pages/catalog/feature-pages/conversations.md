# Feature: conversations

Generated from the current working tree on 2026-04-10 21:59:58.

- Files: 2
- Entry files: src/features/conversations/server.ts, src/features/conversations/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/conversations/server.ts
- Route users: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: tm_events, meta_campaigns, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, ad_assets
- Depends on feature modules: assets (1)
- Used by feature modules: dashboard (2)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- All linked tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)

## Exporting files
- `src/features/conversations/server.ts` — exports: matchesConversationKinds, listConversationThreads
- `src/features/conversations/summary.ts` — exports: ConversationThreadKind, ConversationThread

## File list
- `src/features/conversations/server.ts` — exports: matchesConversationKinds, listConversationThreads; internal imports: 5
- `src/features/conversations/summary.ts` — exports: ConversationThreadKind, ConversationThread
