# Ingest and snapshot lifecycle

Generated from the current working tree on 2026-04-28 03:23:46.

Files and DB objects involved in external data ingest, campaign/event snapshots, and summary/report surfaces built on them.

- DB objects: meta_campaigns, tm_event_demographics, tm_events
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/reports/page.tsx
- Feature files: src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts
- Docs: docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/audits/dead-ends-and-dead-code.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
- Behavior signals: calls revalidatePath() (4), server action/module (4), calls redirect() (3), calls notFound() (2), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1), client component/module (1)
- Auth signals: references membership/scope access concepts (9), imports Clerk server auth (6), calls currentUser() (3), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

### `meta_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Related routes: none
- Related features/libs/agents: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Related tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, docs/references/database-safety-runbook.md, src/app/admin/actions/search.test.ts

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
- src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/ingest/route.ts, src/app/client/[slug]/reports/page.tsx

## Feature files
- src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts
- Docs: docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/audits/dead-ends-and-dead-code.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
