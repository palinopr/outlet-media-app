# Reporting-from-shared-backbone rules

Generated from the current working tree on 2026-04-10 18:46:37.

Files and DB objects that appear to connect reports and dashboards back to shared workflow, event, and snapshot data instead of isolated summary-only state.

- DB objects: approval_requests, campaign_action_items, campaign_comments, event_follow_up_items, system_events, tm_event_demographics
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/reports/page.tsx
- Feature files: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, … (+21 more)
- Libs / agents / admin actions: agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/lib/database.types.ts
- Mutation-oriented files: agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, … (+9 more)
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, … (+28 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, … (+9 more)
- Behavior signals: server action/module (6), calls notFound() (3), calls revalidatePath() (3), calls redirect() (2), client component/module (2), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: imports Clerk server auth (32), references membership/scope access concepts (23), calls currentUser() (12), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/AGENTS.md, src/features/approvals/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, src/app/admin/clients/data.test.ts

### `campaign_action_items`
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/clients/data.test.ts

### `campaign_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Related routes: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts
- Related features/libs/agents: src/features/campaign-comments/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts

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

## Route surfaces
- src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/reports/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, … (+17 more)

## Libs / agents / admin actions
- agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/events/summary.test.ts, … (+24 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, … (+5 more)
