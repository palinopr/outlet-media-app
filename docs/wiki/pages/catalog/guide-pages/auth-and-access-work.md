# Start here: auth and access work

Generated from the current working tree on 2026-04-10 18:02:26.

Recommended read order for someone changing sign-in/up flows, invites, memberships, portal-entry behavior, or scope enforcement.

## Recommended wiki read order
- `./auth-access.md`
- `./business-rules.md`
- `./workflow-lifecycles.md`
- `./table-profiles.md`
- `./route-profiles.md`
- `./feature-profiles.md`

## Source entrypoints
- Routes: src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/user/profile/route.ts, … (+12 more)
- Feature files: src/features/access/revalidation.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/client-agent/readers.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+22 more)
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- DB objects: client_access_invites, client_member_campaigns, client_member_events, client_members, clients
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, … (+29 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-dynamic-seating.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, … (+32 more)

## Signals seen in this area
- Auth signals: references membership/scope access concepts (40), imports Clerk server auth (40), calls currentUser() (17), calls auth() (10), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (35), calls redirect() (11), server action/module (9), calls revalidatePath() (8), defines generateMetadata (6), sets dynamic rendering mode (6), calls notFound() (4), calls revalidateTag() (1), calls unstable_noStore() (1)
