# Table: client_member_events

Generated from the current working tree on 2026-04-10 21:59:58.

- Category: Access / auth tables
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 8
- Referenced by groups: src/app / admin (3), src/lib (2), Tests / Features (1), Docs / Context (1), src/features / notifications (1)
- Routes: none
- Features: src/features/notifications/server.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/features/notifications/server.ts
- Tests: __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (8), imports Clerk server auth (4), calls currentUser() (1)

## Reference files
- __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
