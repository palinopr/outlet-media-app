# Start here: reporting and ingest work

Generated from the current working tree on 2026-04-28 03:23:46.

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
- Docs: AGENTS.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/log.md, docs/wiki/pages/audits/dead-ends-and-dead-code.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py

## Signals seen in this area
- Auth signals: references membership/scope access concepts (12), imports Clerk server auth (8), calls currentUser() (4), calls auth() (1), contains explicit access/role guard helper usage (1)
- Behavior signals: calls revalidatePath() (4), server action/module (4), client component/module (4), calls redirect() (3), calls notFound() (2), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1)
