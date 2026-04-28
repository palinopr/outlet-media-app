# Reporting-from-shared-backbone rules

Generated from the current working tree on 2026-04-28 02:31:12.

Files and DB objects that appear to connect reports and dashboards back to shared workflow, event, and snapshot data instead of isolated summary-only state.

- DB objects: approval_requests, campaign_action_items, campaign_comments, event_follow_up_items, system_events, tm_event_demographics
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx
- Feature files: src/features/AGENTS.md, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/system-events/server.ts
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/features/system-events/server.ts
- Tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/references/database-safety-runbook.md, … (+11 more)
- Behavior signals: calls redirect() (4), calls revalidatePath() (4), server action/module (3), calls notFound() (2), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1), client component/module (1)
- Auth signals: references membership/scope access concepts (11), imports Clerk server auth (4), calls currentUser() (3), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `campaign_action_items`
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `campaign_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

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

## Route surfaces
- src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/system-events/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, … (+7 more)
