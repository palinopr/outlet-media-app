# Table: system_events

Generated from the current working tree on 2026-04-10 16:45:57.

- Category: Shared timeline / approvals / notifications
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 26
- Referenced by groups: Docs / Context (5), Tests / Features (4), Root Files (2), Docs / Superpowers Plans (2), Docs / Superpowers Specs (2), src/app / admin (2), agent / prompts (1), agent/src / services (1), Docs / Plans (1), src/app / root routes (1), src/features / root files (1), src/features / agent-outcomes (1), … (+3 more)
- Routes: none
- Features: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/dashboard/server.ts, src/features/system-events/server.ts
- Shared libs: none
- Agent files: agent/src/services/system-events-service.ts
- Mutation-oriented files: agent/src/services/system-events-service.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/agent-outcomes/server.ts, src/features/system-events/server.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/system-events/list.test.ts
- Docs: docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/specs/2026-03-31-client-agent-tab-design.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md
- Other mentions: AGENTS.md, agent/prompts/agent.txt, audit/architecture-smells.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, supabase/AGENTS.md
- Behavior signals from references: calls revalidatePath() (2), server action/module (2)
- Auth signals from references: references membership/scope access concepts (6), imports Clerk server auth (5), calls currentUser() (2)

## Reference files
- AGENTS.md, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/system-events/list.test.ts, agent/prompts/agent.txt, agent/src/services/system-events-service.ts, audit/architecture-smells.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/specs/2026-03-31-client-agent-tab-design.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, … (+6 more)
