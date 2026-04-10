# Table: event_comments

Generated from the current working tree on 2026-04-10 15:42:38.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260306110000_event_comments.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Non-migration references: 10
- Referenced by groups: src/app / admin (4), Tests / Features (3), src/features / conversations (1), src/features / events (1), src/features / notifications (1)
- Routes: none
- Features: src/features/conversations/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/features/notifications/server.ts
- Tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/clients/data.ts
- Behavior signals from references: server action/module (2), calls revalidatePath() (1)
- Auth signals from references: imports Clerk server auth (7), references membership/scope access concepts (7), calls currentUser() (2)

## Reference files
- __tests__/features/conversations/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/features/conversations/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
