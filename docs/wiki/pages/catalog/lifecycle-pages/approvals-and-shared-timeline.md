# Approvals and shared timeline lifecycle

Generated from the current working tree on 2026-04-28 02:31:12.

Files and DB objects involved in approvals, notifications, shared events, and summary/reporting surfaces that expose them.

- DB objects: admin_activity, approval_requests, notifications, system_events
- Routes: src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, … (+1 more)
- Feature files: src/features/AGENTS.md, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/system-events/server.ts
- Libs / agents / actions: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- Mutation-oriented files: e2e/authenticated-smoke.spec.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/system-events/server.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/activity-tracker.test.ts, … (+4 more)
- Docs: AGENTS.md, README.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, … (+42 more)
- Behavior signals: calls redirect() (12), client component/module (12), server action/module (8), calls revalidatePath() (7), calls notFound() (3), defines generateMetadata (3), sets dynamic rendering mode (2), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: references membership/scope access concepts (17), imports Clerk server auth (13), calls currentUser() (10), calls auth() (7), contains explicit access/role guard helper usage (1)

## Database objects

### `admin_activity`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Related routes: src/app/api/admin/activity/route.ts
- Related features/libs/agents: src/lib/database.types.ts
- Related tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/references/database-safety-runbook.md

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
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

## Route surfaces
- src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/system-events/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/activity-tracker.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/nav-config.test.ts, src/features/campaigns/revalidation.test.ts, src/features/client-portal/entry.test.ts
- Docs: AGENTS.md, README.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-design.md, … (+38 more)
