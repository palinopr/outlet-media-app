# Table: system_events

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Shared timeline / approvals / notifications
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Non-migration references: 16
- Referenced by groups: Docs / Context (5), Root Files (2), src/app / admin (2), Tests / Features (1), Docs / References (1), src/app / root routes (1), src/features / root files (1), src/features / system-events (1), src/lib (1), supabase / root (1)
- Routes: none
- Features: src/features/AGENTS.md, src/features/system-events/server.ts
- Shared libs: src/lib/database.types.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/system-events/server.ts
- Tests: __tests__/features/system-events/list.test.ts
- Docs: docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/references/database-safety-runbook.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, supabase/AGENTS.md
- Behavior signals from references: calls revalidatePath() (2), server action/module (2)
- Auth signals from references: references membership/scope access concepts (6), imports Clerk server auth (3), calls currentUser() (2)

## Reference files
- AGENTS.md, __tests__/features/system-events/list.test.ts, audit/architecture-smells.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/references/database-safety-runbook.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/AGENTS.md, src/features/system-events/server.ts, src/lib/database.types.ts, supabase/AGENTS.md
