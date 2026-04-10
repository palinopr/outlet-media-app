# Impact: src/features/conversations/server.ts

Generated from the current working tree on 2026-04-10 16:14:38.

- Category: Feature files
- Impact score: 72
- Ownership: feature module: conversations
- Feature module: conversations
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/dashboard/server.ts
- Tests related: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+12 more)
- DB objects: tm_events, meta_campaigns, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, ad_assets
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib, src/features / assets, src/features / conversations
- Used by groups: Tests / Features, src/features / dashboard
- Summary: exports: matchesConversationKinds, listConversationThreads; internal imports: 5
