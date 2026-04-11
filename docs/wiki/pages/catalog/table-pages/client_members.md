# Table: client_members

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Access / auth tables
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Non-migration references: 18
- Referenced by groups: src/app / admin (4), Root Files (2), Docs / Context (2), Docs / Plans (2), Docs / Superpowers Plans (2), src/lib (2), Tests / Features (1), src/app / api (1), src/features / client-portal (1), src/features / notifications (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features: src/features/client-portal/entry.ts, src/features/notifications/server.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/api/admin/users/[id]/route.ts, src/features/notifications/server.ts
- Tests: __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts
- Behavior signals from references: calls revalidatePath() (2), server action/module (2), calls redirect() (1), calls notFound() (1), client component/module (1), sets dynamic rendering mode (1)
- Auth signals from references: references membership/scope access concepts (18), imports Clerk server auth (6), calls auth() (1), calls currentUser() (1)

## Reference files
- AGENTS.md, __tests__/features/notifications/server.test.ts, audit/architecture-smells.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/app/api/admin/users/[id]/route.ts, src/features/client-portal/entry.ts, src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
