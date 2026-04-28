# Start here: agent runtime work

Generated from the current working tree on 2026-04-28 03:23:46.

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
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/references/database-safety-runbook.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/raw/README.md, docs/wiki/tools/generate_repo_catalog.py

## Signals seen in this area
- Auth signals: references membership/scope access concepts (7), imports Clerk server auth (4), calls currentUser() (3), calls auth() (1), contains explicit access/role guard helper usage (1)
- Behavior signals: calls revalidatePath() (3), server action/module (3), calls redirect() (1), calls notFound() (1), calls revalidateTag() (1), calls unstable_noStore() (1), client component/module (1), defines generateMetadata (1)
