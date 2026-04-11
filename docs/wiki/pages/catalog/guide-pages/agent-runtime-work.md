# Start here: agent runtime work

Generated from the current working tree on 2026-04-10 22:25:15.

Recommended read order for someone changing the Discord/runtime agent, queued tasks, runtime state, or web-admin queue recovery.

## Recommended wiki read order
- `./workflow-events.md`
- `./workflow-lifecycles.md`
- `./auth-access.md`
- `./mutation-surfaces.md`
- `./env-integrations.md`
- `./feature-profiles.md`

## Source entrypoints
- Routes: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/agents/email/watch/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/alerts/route.ts
- Feature files: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/agents/summary.ts, src/features/campaigns/client-operating.ts, src/features/dashboard/server.ts, src/features/events/client-operating.ts, src/features/operations-center/summary.ts, src/features/reports/server.ts, src/features/system-events/server.ts
- Libs / agents / admin actions: agent/src/discord/commands/slash.ts, agent/src/discord/core/entry.ts, agent/src/discord/core/router.ts, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/index.ts, agent/src/runner.test.ts, agent/src/runner.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, … (+14 more)
- DB objects: agent_alerts, agent_jobs, agent_runtime_state, agent_tasks, system_events
- Tests: __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents-jobs.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/system-events/list.test.ts, … (+5 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/repo-organization.md, docs/context/salvage-map.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, … (+16 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (12), imports Clerk server auth (9), calls currentUser() (4), calls auth() (2), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (4), server action/module (4), calls revalidatePath() (3), calls redirect() (1), calls notFound() (1), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
