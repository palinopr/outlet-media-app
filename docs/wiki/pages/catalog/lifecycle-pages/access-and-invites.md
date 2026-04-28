# Access and invite lifecycle

Generated from the current working tree on 2026-04-28 02:30:43.

Files and DB objects involved in client access, invites, membership resolution, and portal entry.

- DB objects: client_access_invites, client_member_campaigns, client_member_events, client_members, clients
- Routes: src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts, src/app/api/user/profile/route.ts, src/app/client/page.tsx, src/app/client/[slug]/layout.tsx, … (+7 more)
- Feature files: src/features/access/revalidation.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.test.ts, … (+8 more)
- Libs / agents / actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: e2e/authenticated-smoke.spec.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.ts, src/app/api/admin/users/[id]/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-table.tsx, … (+4 more)
- Tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, … (+11 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, … (+31 more)
- Behavior signals: client component/module (29), calls redirect() (11), server action/module (9), calls revalidatePath() (8), sets dynamic rendering mode (6), calls notFound() (3), defines generateMetadata (3), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: references membership/scope access concepts (26), imports Clerk server auth (26), calls currentUser() (11), calls auth() (10), contains explicit access/role guard helper usage (1)

## Database objects

### `client_access_invites`
- Kinds: table
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Related routes: src/app/api/admin/invite/route.ts
- Related features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/lib/database.types.ts
- Related tests/docs: docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, src/app/api/admin/invite/route.test.ts

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Related routes: src/app/api/admin/users/[id]/route.ts
- Related features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Related tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts

### `clients`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql, supabase/migrations/20260427001000_retire_events_reports_surfaces.sql
- Related routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts
- Related features/libs/agents: src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Related tests/docs: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, … (+31 more)

## Route surfaces
- src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts, src/app/api/user/profile/route.ts, src/app/client/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/pending/layout.tsx, src/app/client/pending/page.tsx, … (+3 more)

## Feature files
- src/features/access/revalidation.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.test.ts, src/features/client-portal/theme.ts, src/features/client-portal/types.ts, src/features/invitations/server.test.ts, src/features/invitations/server.ts, … (+4 more)

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/client-portal/scope.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/sign-up/invite-flow.test.tsx, src/components/admin/clients/client-detail.test.tsx, … (+7 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/plans/2026-03-03-admin-data-table-upgrade-design.md, … (+27 more)
