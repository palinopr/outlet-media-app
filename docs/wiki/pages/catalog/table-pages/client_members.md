# Table: client_members

Generated from the current working tree on 2026-04-28 02:32:49.

- Category: Access / auth tables
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Non-migration references: 18
- Referenced by groups: src/app / admin (4), Root Files (2), Docs / Plans (2), Docs / Superpowers Plans (2), src/app / api (2), src/features / client-portal (2), src/lib (2), Docs / Context (1), Docs / References (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/api/admin/users/[id]/route.ts
- Tests: src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts
- Docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts
- Behavior signals from references: calls revalidatePath() (2), server action/module (2), calls redirect() (1), calls notFound() (1), client component/module (1), sets dynamic rendering mode (1)
- Auth signals from references: references membership/scope access concepts (18), imports Clerk server auth (4), calls auth() (1)

## Reference files
- AGENTS.md, audit/architecture-smells.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/users/[id]/route.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/lib/database.types.ts, src/lib/member-access.ts
