# Start here: agent runtime work

Generated from the current working tree on 2026-04-28 02:30:43.

Recommended read order for someone changing the Discord/runtime agent, queued tasks, runtime state, or web-admin queue recovery.

## Recommended wiki read order
- `./workflow-events.md`
- `./workflow-lifecycles.md`
- `./auth-access.md`
- `./mutation-surfaces.md`
- `./env-integrations.md`
- `./feature-profiles.md`

## Source entrypoints
- Routes: none
- Feature files: src/features/AGENTS.md, src/features/system-events/server.ts
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- DB objects: agent_alerts, agent_jobs, agent_runtime_state, agent_tasks, system_events
- Tests: __tests__/features/system-events/list.test.ts
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, … (+15 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (8), imports Clerk server auth (5), calls currentUser() (4), calls auth() (2), contains explicit access/role guard helper usage (1)
- Behavior signals: server action/module (4), calls revalidatePath() (3), client component/module (2), calls redirect() (1), calls notFound() (1), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
