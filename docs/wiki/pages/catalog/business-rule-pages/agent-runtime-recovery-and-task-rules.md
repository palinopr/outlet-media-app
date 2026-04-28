# Agent runtime recovery and task rules

Generated from the current working tree on 2026-04-28 03:23:46.

Files and DB objects that appear to govern queued agent tasks, runtime heartbeat, recovery, and runtime-side task execution boundaries.

- DB objects: acquire_runtime_lease, agent_alerts, agent_jobs, agent_runtime_state, agent_tasks, release_runtime_lease
- Routes: none
- Feature files: none
- Libs / agents / admin actions: none
- Mutation-oriented files: none
- Tests: none
- Docs: docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
- Behavior signals: calls redirect() (1), calls notFound() (1), calls revalidatePath() (1), calls revalidateTag() (1), calls unstable_noStore() (1), client component/module (1), server action/module (1), defines generateMetadata (1)
- Auth signals: references membership/scope access concepts (2), imports Clerk server auth (1), calls auth() (1), calls currentUser() (1), contains explicit access/role guard helper usage (1)

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
- Related tests/docs: none

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

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
- Related tests/docs: none

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
- Docs: docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
