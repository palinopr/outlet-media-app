# Agent runtime lifecycle

Generated from the current working tree on 2026-04-10 16:45:57.

Files and DB objects involved in queued agent work, runtime heartbeat, alerts, and runtime state.

- DB objects: acquire_runtime_lease, agent_alerts, agent_jobs, agent_runtime_state, agent_tasks, release_runtime_lease
- Routes: src/app/api/agents/route.ts, src/app/api/agents/email/watch/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/alerts/route.ts
- Feature files: src/features/agent-outcomes/server.ts
- Libs / agents / actions: agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts, src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Mutation-oriented files: agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.ts, agent/src/services/web-task-executor.ts, src/components/admin/agents/chat-panel.tsx, src/features/agent-outcomes/server.ts, src/lib/agent-dispatch.ts
- Tests: __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents-jobs.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, agent/src/services/queue-service.test.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/web-task-executor.test.ts
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, … (+6 more)
- Behavior signals: client component/module (4), server action/module (2), calls redirect() (1), calls notFound() (1), calls revalidatePath() (1), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
- Auth signals: references membership/scope access concepts (7), imports Clerk server auth (4), calls auth() (2), calls currentUser() (2), contains explicit access/role guard helper usage (1)

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
- Related routes: src/app/api/alerts/route.ts
- Related features/libs/agents: src/lib/database.types.ts
- Related tests/docs: __tests__/api/alerts.test.ts, docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Related routes: none
- Related features/libs/agents: src/lib/database.types.ts
- Related tests/docs: docs/plans/2026-03-02-project-restructure-plan.md

### `agent_runtime_state`
- Kinds: table
- Migrations: supabase/migrations/20260305010000_agent_runtime_state.sql
- Related routes: src/app/api/agents/heartbeat/route.ts
- Related features/libs/agents: agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/api/agents-heartbeat.test.ts, docs/context/agent-patterns.md

### `agent_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Related routes: src/app/api/agents/route.ts
- Related features/libs/agents: agent/src/services/queue-service.ts, src/features/agent-outcomes/server.ts, src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md

### `release_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

## Route surfaces
- src/app/api/agents/route.ts, src/app/api/agents/email/watch/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/alerts/route.ts

## Feature files
- src/features/agent-outcomes/server.ts

## Libs / agents / admin actions
- agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, agent/src/services/web-task-executor.test.ts, agent/src/services/web-task-executor.ts, src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents-jobs.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, agent/src/services/queue-service.test.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/web-task-executor.test.ts
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-02-whatsapp-removal.md, docs/superpowers/plans/2026-04-03-agent-simplification.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md, … (+2 more)
