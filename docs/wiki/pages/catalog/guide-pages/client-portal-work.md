# Start here: client portal work

Generated from the current working tree on 2026-04-28 02:31:12.

Recommended read order for someone changing client portal routing, access, campaign/event pages, reports, or the client agent surface.

## Recommended wiki read order
- `./route-profiles.md`
- `./feature-profiles.md`
- `./auth-access.md`
- `./workflow-lifecycles.md`
- `./component-trees.md`
- `./business-rules.md`

## Source entrypoints
- Routes: src/app/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts, src/app/client/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/loading.tsx, … (+10 more)
- Feature files: src/features/access/revalidation.ts, src/features/campaigns/revalidation.test.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, … (+8 more)
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- DB objects: campaign_comments, client_agent_messages, client_agent_threads, client_member_campaigns, client_member_events, client_members, clients, event_follow_up_items
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, … (+18 more)
- Docs: AGENTS.md, README.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, … (+33 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (27), imports Clerk server auth (22), calls currentUser() (10), calls auth() (9), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (33), calls redirect() (13), calls revalidatePath() (9), server action/module (9), calls notFound() (4), defines generateMetadata (4), sets dynamic rendering mode (3), calls revalidateTag() (1), calls unstable_noStore() (1)
