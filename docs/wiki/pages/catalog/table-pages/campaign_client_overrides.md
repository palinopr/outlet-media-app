# Table: campaign_client_overrides

Generated from the current working tree on 2026-04-28 02:57:59.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 8
- Referenced by groups: src/app / admin (3), src/lib (3), Root Files (1), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts
- Behavior signals from references: calls revalidatePath() (2), server action/module (2)
- Auth signals from references: references membership/scope access concepts (5), imports Clerk server auth (2), calls currentUser() (1)

## Reference files
- audit/architecture-smells.md, docs/references/database-safety-runbook.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts
