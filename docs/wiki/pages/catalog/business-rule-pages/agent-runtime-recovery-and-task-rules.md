# Agent runtime recovery and task rules

Generated from the current working tree on 2026-04-28 02:32:49.

Files and DB objects that appear to govern queued agent tasks, runtime heartbeat, recovery, and runtime-side task execution boundaries.

- DB objects: acquire_runtime_lease, agent_alerts, agent_jobs, agent_runtime_state, agent_tasks, release_runtime_lease
- Routes: none
- Feature files: none
- Libs / agents / admin actions: none
- Mutation-oriented files: none
- Tests: none
- Docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-02-whatsapp-removal.md, docs/superpowers/plans/2026-04-03-agent-simplification.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md, … (+2 more)
- Behavior signals: client component/module (2), server action/module (2), calls redirect() (1), calls notFound() (1), calls revalidatePath() (1), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
- Auth signals: imports Clerk server auth (2), calls currentUser() (2), calls auth() (2), references membership/scope access concepts (2), contains explicit access/role guard helper usage (1)

## Database objects

### `acquire_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `agent_alerts`
- Kinds: table
- Migrations: supabase/migrations/20260218140000_agent_alerts.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-03-02-project-restructure-plan.md

### `agent_runtime_state`
- Kinds: table
- Migrations: supabase/migrations/20260305010000_agent_runtime_state.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `agent_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md

### `release_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

## Route surfaces
- none

## Feature files
- none

## Libs / agents / admin actions
- none

## Tests and docs
- Tests: none
- Docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-02-whatsapp-removal.md, docs/superpowers/plans/2026-04-03-agent-simplification.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
