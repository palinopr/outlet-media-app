# Start here: reporting and ingest work

Generated from the current working tree on 2026-04-28 02:32:49.

Recommended read order for someone changing ingest, snapshots, reports, dashboard summaries, or external analytics integrations.

## Recommended wiki read order
- `./workflow-lifecycles.md`
- `./api-contracts.md`
- `./supabase-schema.md`
- `./database-to-code.md`
- `./feature-profiles.md`
- `./env-integrations.md`

## Source entrypoints
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/client/[slug]/reports/page.tsx
- Feature files: src/features/AGENTS.md, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/system-events/server.ts
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-api.test.ts, src/lib/meta-api.ts, src/lib/meta-campaigns.test.ts, src/lib/meta-campaigns.ts, src/lib/meta-oauth.test.ts, … (+1 more)
- DB objects: meta_campaigns, system_events, tm_event_demographics, tm_events
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/revalidation.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/lib/meta-api.test.ts, … (+2 more)
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, … (+23 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (16), imports Clerk server auth (11), calls currentUser() (5), calls auth() (4), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (9), calls revalidatePath() (8), server action/module (7), calls redirect() (6), calls notFound() (3), defines generateMetadata (2), sets dynamic rendering mode (1), calls revalidateTag() (1), calls unstable_noStore() (1)
