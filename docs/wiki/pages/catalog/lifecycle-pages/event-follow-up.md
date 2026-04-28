# Event follow-up lifecycle

Generated from the current working tree on 2026-04-28 02:32:49.

Files and DB objects involved in event follow-up work, event reporting, and ticket/event workflow surfaces.

- DB objects: event_follow_up_items, notifications, system_events, tm_event_demographics, tm_events
- Routes: src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/privacy/page.tsx
- Feature files: src/features/AGENTS.md, src/features/system-events/server.ts
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/system-events/server.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, … (+18 more)
- Behavior signals: calls redirect() (8), calls revalidatePath() (7), server action/module (6), client component/module (5), calls notFound() (2), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1), sets dynamic rendering mode (1)
- Auth signals: references membership/scope access concepts (11), imports Clerk server auth (8), calls auth() (4), calls currentUser() (4), contains explicit access/role guard helper usage (1)

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
- Related tests/docs: docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, docs/superpowers/specs/2026-03-22-web-reset-design.md, docs/superpowers/specs/2026-03-27-shell-reset-design.md

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Related routes: none
- Related features/libs/agents: src/features/AGENTS.md, src/features/system-events/server.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/features/system-events/list.test.ts, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/specs/2026-03-31-client-agent-tab-design.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md

### `tm_event_demographics`
- Kinds: table
- Migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md

### `tm_events`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md

## Route surfaces
- src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/system-events/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-mobile-responsiveness-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md, … (+14 more)
