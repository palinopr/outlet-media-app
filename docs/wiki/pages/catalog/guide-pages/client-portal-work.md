# Start here: client portal work

Generated from the current working tree on 2026-04-10 21:37:00.

Recommended read order for someone changing client portal routing, access, campaign/event pages, reports, or the client agent surface.

## Recommended wiki read order
- `./route-profiles.md`
- `./feature-profiles.md`
- `./auth-access.md`
- `./workflow-lifecycles.md`
- `./component-trees.md`
- `./business-rules.md`

## Source entrypoints
- Routes: src/app/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, … (+23 more)
- Feature files: src/features/access/revalidation.ts, src/features/agent-outcomes/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.test.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx, src/features/client-agent/model.test.ts, … (+54 more)
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- DB objects: campaign_comments, client_agent_messages, client_agent_threads, client_member_campaigns, client_member_events, client_members, clients, event_follow_up_items
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, … (+58 more)
- Docs: AGENTS.md, README.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, … (+36 more)

## Signals seen in this area
- Auth signals: imports Clerk server auth (42), references membership/scope access concepts (38), calls currentUser() (18), calls auth() (9), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (49), server action/module (11), calls redirect() (10), calls revalidatePath() (8), defines generateMetadata (6), calls notFound() (6), sets dynamic rendering mode (3), calls revalidateTag() (1), calls unstable_noStore() (1)
