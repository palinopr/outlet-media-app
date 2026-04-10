# Table: asset_follow_up_items

Generated from the current working tree on 2026-04-10 16:52:39.

- Category: Campaign / event / asset workflow
- Kinds: table
- Migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 8
- Referenced by groups: Tests / Features (3), src/app / admin (1), src/features / agent-outcomes (1), src/features / asset-follow-up-items (1), src/features / conversations (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/conversations/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/notifications/server.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: imports Clerk server auth (4), references membership/scope access concepts (4), calls currentUser() (1)

## Reference files
- __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/clients.ts, src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/conversations/server.ts, src/features/notifications/server.ts
