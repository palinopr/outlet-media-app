# Ingest and snapshot lifecycle

Generated from the current working tree on 2026-04-10 18:02:26.

Files and DB objects involved in external data ingest, campaign/event snapshots, and summary/report surfaces built on them.

- DB objects: meta_campaigns, tm_event_demographics, tm_events
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/reports/page.tsx
- Feature files: src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, … (+16 more)
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.ts, … (+3 more)
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, … (+24 more)
- Docs: docs/context/current-priorities.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, … (+9 more)
- Behavior signals: server action/module (9), calls revalidatePath() (7), client component/module (7), calls redirect() (4), calls notFound() (4), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1), sets dynamic rendering mode (1)
- Auth signals: imports Clerk server auth (29), references membership/scope access concepts (23), calls currentUser() (12), calls auth() (3), contains explicit access/role guard helper usage (1)

## Database objects

### `meta_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Related routes: src/app/api/campaign-comments/route.ts
- Related features/libs/agents: src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/events/server.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Related tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, … (+8 more)

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
- src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/reports/page.tsx

## Feature files
- src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/details.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/overview.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/tools/search.ts, … (+12 more)

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/events/summary.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+20 more)
- Docs: docs/context/current-priorities.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, … (+5 more)
