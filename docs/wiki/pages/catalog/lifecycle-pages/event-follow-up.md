# Event follow-up lifecycle

Generated from the current working tree on 2026-04-10 21:27:09.

Files and DB objects involved in event follow-up work, event reporting, and ticket/event workflow surfaces.

- DB objects: event_follow_up_items, notifications, system_events, tm_event_demographics, tm_events
- Routes: src/app/admin/events/loading.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+3 more)
- Feature files: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/server.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/types.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/event-follow-up-items/server.ts, … (+7 more)
- Libs / agents / actions: agent/src/discord/core/entry.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/action-item-labels.ts, src/lib/database.types.ts
- Mutation-oriented files: agent/src/discord/core/entry.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, … (+4 more)
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/events/summary.test.ts, … (+22 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/context/tm1-browserless-api.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, … (+18 more)
- Behavior signals: client component/module (12), server action/module (10), calls revalidatePath() (7), calls redirect() (4), calls notFound() (3), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1), sets dynamic rendering mode (1)
- Auth signals: imports Clerk server auth (32), references membership/scope access concepts (20), calls currentUser() (12), calls auth() (4), contains explicit access/role guard helper usage (1)

## Database objects

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Related routes: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/privacy/page.tsx
- Related features/libs/agents: agent/src/discord/core/entry.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts, src/features/workflow/revalidation.test.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, … (+6 more)

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: agent/src/services/system-events-service.ts, src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/dashboard/server.ts, src/features/system-events/server.ts
- Related tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/system-events/list.test.ts, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, … (+2 more)

### `tm_event_demographics`
- Kinds: table
- Migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/client-portal/types.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md

### `tm_events`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/client-portal/types.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/reports/server.ts, src/lib/database.types.ts
- Related tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/read-clients.test.ts, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, … (+4 more)

## Route surfaces
- src/app/admin/events/loading.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/events/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/server.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/types.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/client-operating.ts, src/features/events/server.ts, src/features/events/summary.ts, src/features/notifications/server.ts, … (+3 more)

## Libs / agents / admin actions
- agent/src/discord/core/entry.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/action-item-labels.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/events/summary.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, __tests__/features/reports/read-clients.test.ts, … (+18 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/context/tm1-browserless-api.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-mobile-responsiveness-plan.md, … (+14 more)
