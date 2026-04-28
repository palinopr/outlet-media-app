# Event follow-up lifecycle

Generated from the current working tree on 2026-04-28 03:23:46.

Files and DB objects involved in event follow-up work, event reporting, and ticket/event workflow surfaces.

- DB objects: event_follow_up_items, notifications, system_events, tm_event_demographics, tm_events
- Routes: src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/privacy/page.tsx
- Feature files: src/features/AGENTS.md, src/features/system-events/server.ts
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/system-events/server.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/inventory/feature-modules.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
- Behavior signals: calls redirect() (5), calls revalidatePath() (3), server action/module (3), calls notFound() (1), calls revalidateTag() (1), calls unstable_noStore() (1), client component/module (1), defines generateMetadata (1)
- Auth signals: references membership/scope access concepts (9), imports Clerk server auth (5), calls currentUser() (3), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Related routes: src/app/privacy/page.tsx
- Related features/libs/agents: none
- Related tests/docs: none

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Related routes: none
- Related features/libs/agents: src/features/AGENTS.md, src/features/system-events/server.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/features/system-events/list.test.ts, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/references/database-safety-runbook.md

### `tm_event_demographics`
- Kinds: table
- Migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `tm_events`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

## Route surfaces
- src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/system-events/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/inventory/feature-modules.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
