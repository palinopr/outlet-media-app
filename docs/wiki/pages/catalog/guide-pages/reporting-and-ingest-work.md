# Start here: reporting and ingest work

Generated from the current working tree on 2026-04-10 22:12:57.

Recommended read order for someone changing ingest, snapshots, reports, dashboard summaries, or external analytics integrations.

## Recommended wiki read order
- `./workflow-lifecycles.md`
- `./api-contracts.md`
- `./supabase-schema.md`
- `./database-to-code.md`
- `./feature-profiles.md`
- `./env-integrations.md`

## Source entrypoints
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, … (+2 more)
- Feature files: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/breakdowns.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/compare-timeseries.ts, … (+19 more)
- Libs / agents / admin actions: agent/src/services/system-events-service.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-api.test.ts, src/lib/meta-api.ts, … (+5 more)
- DB objects: meta_campaigns, system_events, tm_event_demographics, tm_events
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, … (+32 more)
- Docs: AGENTS.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/context/tm1-browserless-api.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, … (+22 more)

## Signals seen in this area
- Auth signals: imports Clerk server auth (32), references membership/scope access concepts (25), calls currentUser() (13), calls auth() (4), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (10), server action/module (9), calls revalidatePath() (7), calls redirect() (4), calls notFound() (4), defines generateMetadata (2), sets dynamic rendering mode (1), calls revalidateTag() (1), calls unstable_noStore() (1)
