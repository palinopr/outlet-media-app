# Start here: admin web work

Generated from the current working tree on 2026-04-10 18:46:37.

Recommended read order for someone changing admin surfaces, admin actions, admin workflow, or admin reporting views.

## Recommended wiki read order
- `./manifest.md`
- `./route-profiles.md`
- `./feature-profiles.md`
- `./component-trees.md`
- `./mutation-surfaces.md`
- `./business-rules.md`

## Source entrypoints
- Routes: src/app/admin/layout.tsx, src/app/admin/agents/loading.tsx, src/app/admin/agents/page.tsx, src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/loading.tsx, … (+14 more)
- Feature files: src/features/AGENTS.md, src/features/access/revalidation.ts, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/asset-follow-up-items/server.ts, src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, … (+30 more)
- Libs / agents / admin actions: agent/src/discord/core/entry.ts, agent/src/services/system-events-service.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.revalidation.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/meta-sync.ts, … (+8 more)
- DB objects: approval_requests, client_members, clients, meta_campaigns, notifications, system_events, tm_events
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, … (+53 more)
- Docs: AGENTS.md, README.md, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-prd130-capability-map.md, … (+38 more)

## Signals seen in this area
- Auth signals: imports Clerk server auth (47), references membership/scope access concepts (30), calls currentUser() (18), calls auth() (5), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (63), server action/module (13), calls revalidatePath() (8), calls redirect() (5), sets dynamic rendering mode (5), calls notFound() (5), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1)
