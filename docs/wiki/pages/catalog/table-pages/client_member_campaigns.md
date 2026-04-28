# Table: client_member_campaigns

Generated from the current working tree on 2026-04-28 02:31:12.

- Category: Access / auth tables
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 6
- Referenced by groups: src/app / admin (3), src/lib (2), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (6), imports Clerk server auth (2)

## Reference files
- docs/references/database-safety-runbook.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/lib/database.types.ts, src/lib/member-access.ts
