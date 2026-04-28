# Table: client_members

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Access / auth tables
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Non-migration references: 14
- Referenced by groups: src/app / admin (4), Root Files (2), src/app / api (2), src/features / client-portal (2), src/lib (2), Docs / Context (1), Docs / References (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/api/admin/users/[id]/route.ts
- Tests: src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts
- Docs: docs/context/engineering-principles.md, docs/references/database-safety-runbook.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (14), imports Clerk server auth (3)

## Reference files
- AGENTS.md, audit/architecture-smells.md, docs/context/engineering-principles.md, docs/references/database-safety-runbook.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/users/[id]/route.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/lib/database.types.ts, src/lib/member-access.ts
