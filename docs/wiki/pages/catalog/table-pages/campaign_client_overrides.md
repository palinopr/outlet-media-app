# Table: campaign_client_overrides

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 11
- Referenced by groups: Tests / Features (3), src/app / admin (3), src/lib (2), Root Files (1), Docs / Context (1), src/features / campaign-action-items (1)
- Routes: none
- Features: src/features/campaign-action-items/server.test.ts
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts
- Tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts
- Behavior signals from references: calls revalidatePath() (2), server action/module (2)
- Auth signals from references: imports Clerk server auth (5), references membership/scope access concepts (5), calls currentUser() (1)

## Reference files
- __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, audit/architecture-smells.md, docs/context/current-priorities.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/features/campaign-action-items/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts
