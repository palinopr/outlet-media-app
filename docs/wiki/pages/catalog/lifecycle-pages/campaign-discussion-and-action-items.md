# Campaign discussion and action-item lifecycle

Generated from the current working tree on 2026-04-28 03:23:46.

Files and DB objects involved in campaign comments, campaign action items, notifications, and shared system events.

- DB objects: campaign_action_items, campaign_comments, notifications, system_events
- Routes: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/privacy/page.tsx
- Feature files: src/features/AGENTS.md, src/features/client-portal/campaign-detail.ts, src/features/system-events/server.ts
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/system-events/server.ts
- Tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/audits/dead-ends-and-dead-code.md, docs/wiki/pages/inventory/feature-modules.md, docs/wiki/pages/inventory/source-map.md, … (+1 more)
- Behavior signals: client component/module (6), calls revalidatePath() (3), server action/module (3), calls notFound() (2), defines generateMetadata (2), calls redirect() (1), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: references membership/scope access concepts (13), imports Clerk server auth (6), calls currentUser() (4), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

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

## Route surfaces
- src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/AGENTS.md, src/features/client-portal/campaign-detail.ts, src/features/system-events/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/lib/database.types.ts

## Tests and docs
- Tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/audits/dead-ends-and-dead-code.md, docs/wiki/pages/inventory/feature-modules.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
