# Table: client_accounts

Generated from the current working tree on 2026-04-28 02:30:43.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260302000001_create_client_accounts.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 9
- Referenced by groups: src/app / admin (4), Docs / Plans (2), Docs / References (1), src/app / api (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/meta/data-deletion/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Behavior signals from references: calls redirect() (1), client component/module (1), calls revalidatePath() (1), server action/module (1)
- Auth signals from references: references membership/scope access concepts (5), imports Clerk server auth (3), calls auth() (1)

## Reference files
- docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/references/database-safety-runbook.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx, src/app/api/meta/data-deletion/route.ts, src/lib/database.types.ts
