# Table: asset_comments

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Campaign / event / asset workflow
- Kinds: table
- Migrations: supabase/migrations/20260306100000_asset_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 7
- Referenced by groups: src/app / admin (3), Tests / Features (2), src/features / conversations (1), src/features / notifications (1)
- Routes: none
- Features: src/features/conversations/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/features/notifications/server.ts
- Tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (6), imports Clerk server auth (5), calls currentUser() (1)

## Reference files
- __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/features/conversations/server.ts, src/features/notifications/server.ts
