# Start here: admin web work

Generated from the current working tree on 2026-04-28 02:31:12.

Recommended read order for someone changing admin surfaces, admin actions, admin workflow, or admin reporting views.

## Recommended wiki read order
- `./manifest.md`
- `./route-profiles.md`
- `./feature-profiles.md`
- `./component-trees.md`
- `./mutation-surfaces.md`
- `./business-rules.md`

## Source entrypoints
- Routes: src/app/admin/layout.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, … (+7 more)
- Feature files: src/features/AGENTS.md, src/features/access/revalidation.ts, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/system-events/server.ts, … (+1 more)
- Libs / agents / admin actions: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/meta-sync.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, … (+2 more)
- DB objects: approval_requests, client_members, clients, meta_campaigns, notifications, system_events, tm_events
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, … (+15 more)
- Docs: AGENTS.md, README.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, … (+36 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (22), imports Clerk server auth (20), calls currentUser() (9), calls auth() (5), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (49), server action/module (10), calls revalidatePath() (9), calls redirect() (8), calls notFound() (4), sets dynamic rendering mode (4), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
