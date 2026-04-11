# Approval visibility and notification rules

Generated from the current working tree on 2026-04-10 22:25:15.

Files and DB objects that appear to control who sees approvals, notifications, and shared timeline events.

- DB objects: approval_requests, client_member_campaigns, client_member_events, client_members, notifications, system_events
- Routes: src/app/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/layout.tsx, … (+2 more)
- Feature files: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/server.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.test.ts, … (+33 more)
- Libs / agents / admin actions: agent/src/discord/core/entry.ts, agent/src/discord/core/router.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, … (+5 more)
- Mutation-oriented files: agent/scripts/tm1-crawl-capabilities.mjs, agent/src/discord/core/entry.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/admin/users/[id]/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, … (+16 more)
- Tests: __tests__/api/ingest.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, … (+43 more)
- Docs: AGENTS.md, README.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-browserless-api.md, docs/context/tm1-dynamic-seating.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, … (+45 more)
- Behavior signals: client component/module (14), server action/module (9), calls redirect() (8), calls revalidatePath() (7), calls notFound() (3), defines generateMetadata (3), calls revalidateTag() (1), calls unstable_noStore() (1), sets dynamic rendering mode (1)
- Auth signals: imports Clerk server auth (37), references membership/scope access concepts (35), calls currentUser() (16), calls auth() (7), contains explicit access/role guard helper usage (1)

## Database objects

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/AGENTS.md, src/features/approvals/server.ts, src/features/notifications/server.ts
- Related tests/docs: __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, src/app/admin/clients/data.test.ts

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Related routes: src/app/api/admin/users/[id]/route.ts
- Related features/libs/agents: src/features/client-portal/entry.ts, src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/clients/data.test.ts

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

## Route surfaces
- src/app/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/server.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+29 more)

## Libs / agents / admin actions
- agent/src/discord/core/entry.ts, agent/src/discord/core/router.ts, agent/src/services/queue-service.test.ts, agent/src/services/queue-service.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/lib/agent-dispatch.ts, src/lib/api-schemas.ts, src/lib/database.types.ts, src/lib/member-access.ts, … (+1 more)

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, … (+39 more)
- Docs: AGENTS.md, README.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-browserless-api.md, docs/context/tm1-dynamic-seating.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-admin-crud-plan.md, … (+41 more)
