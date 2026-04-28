# Campaign ownership and scope rules

Generated from the current working tree on 2026-04-28 02:57:59.

Files and DB objects that appear to enforce campaign ownership, effective client assignment, and campaign-scoped reads/writes.

- DB objects: campaign_action_items, campaign_comments, client_member_campaigns, meta_campaigns, notifications
- Routes: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/privacy/page.tsx
- Feature files: src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/client-portal/scope.ts
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: e2e/authenticated-smoke.spec.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/nav-config.test.ts, src/features/campaigns/revalidation.test.ts, … (+2 more)
- Docs: docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-03-admin-data-table-upgrade-design.md, docs/plans/2026-03-03-admin-data-table-upgrade.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, … (+13 more)
- Behavior signals: client component/module (14), calls revalidatePath() (8), server action/module (8), calls redirect() (4), calls notFound() (3), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1), sets dynamic rendering mode (1)
- Auth signals: references membership/scope access concepts (14), imports Clerk server auth (10), calls currentUser() (5), calls auth() (4), contains explicit access/role guard helper usage (1)

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

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `meta_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Related routes: none
- Related features/libs/agents: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Related tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md, … (+2 more)

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Related routes: src/app/privacy/page.tsx
- Related features/libs/agents: none
- Related tests/docs: docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md

## Route surfaces
- src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/privacy/page.tsx

## Feature files
- src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/client-portal/scope.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/nav-config.test.ts, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts
- Docs: docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-03-admin-data-table-upgrade-design.md, docs/plans/2026-03-03-admin-data-table-upgrade.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, … (+9 more)
