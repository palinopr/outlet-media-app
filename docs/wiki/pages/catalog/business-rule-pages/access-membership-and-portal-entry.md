# Access, membership, and portal-entry rules

Generated from the current working tree on 2026-04-10 18:02:26.

Files and DB objects that appear to enforce how users gain access, how memberships are resolved, and how users land in the correct portal state.

- DB objects: client_access_invites, client_member_campaigns, client_member_events, client_members, clients
- Routes: src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/user/profile/route.ts, … (+12 more)
- Feature files: src/features/access/revalidation.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/client-agent/readers.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+22 more)
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/api/admin/users/[id]/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx, … (+3 more)
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, … (+29 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-dynamic-seating.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, … (+32 more)
- Behavior signals: client component/module (35), calls redirect() (11), server action/module (9), calls revalidatePath() (8), defines generateMetadata (6), sets dynamic rendering mode (6), calls notFound() (4), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: references membership/scope access concepts (40), imports Clerk server auth (40), calls currentUser() (17), calls auth() (10), contains explicit access/role guard helper usage (1)

## Database objects

### `client_access_invites`
- Kinds: table
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Related routes: src/app/api/admin/invite/route.ts
- Related features/libs/agents: src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/lib/database.types.ts
- Related tests/docs: docs/superpowers/plans/2026-03-22-outlet-web-reset.md, src/app/api/admin/invite/route.test.ts

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Related routes: src/app/api/admin/users/[id]/route.ts
- Related features/libs/agents: src/features/client-portal/entry.ts, src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/clients/data.test.ts

### `clients`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql
- Related routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts
- Related features/libs/agents: src/features/access/revalidation.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/events/server.ts, src/features/invitations/server.ts, src/features/notifications/server.ts, … (+6 more)
- Related tests/docs: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, … (+49 more)

## Route surfaces
- src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/user/profile/route.ts, src/app/client/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, … (+8 more)

## Feature files
- src/features/access/revalidation.ts, src/features/approvals/server.ts, src/features/approvals/summary.ts, src/features/assets/server.ts, src/features/campaign-comments/server.ts, src/features/campaigns/client-operating.ts, src/features/client-agent/readers.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, … (+18 more)

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/settings/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, … (+25 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-dynamic-seating.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, … (+28 more)
