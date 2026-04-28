# Client-agent read-only reporting rules

Generated from the current working tree on 2026-04-28 03:23:46.

Files and DB objects that appear to keep the client agent constrained to read-only reporting and scoped conversational context.

- DB objects: calls, client_agent_messages, client_agent_threads, clients
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts
- Feature files: src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Mutation-oriented files: e2e/authenticated-smoke.spec.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.ts, src/app/api/admin/users/[id]/route.ts, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, … (+3 more)
- Docs: AGENTS.md, README.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
- Behavior signals: client component/module (17), server action/module (5), calls revalidatePath() (4), calls notFound() (2), sets dynamic rendering mode (2), calls redirect() (1), calls revalidateTag() (1), calls unstable_noStore() (1), defines generateMetadata (1)
- Auth signals: references membership/scope access concepts (17), imports Clerk server auth (12), calls currentUser() (4), calls auth() (1), contains explicit access/role guard helper usage (1)

## Database objects

### `calls`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: src/app/client/[slug]/components/campaign-detail-header.test.tsx

### `client_agent_messages`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `client_agent_threads`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Related routes: none
- Related features/libs/agents: none
- Related tests/docs: none

### `clients`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql, supabase/migrations/20260427001000_retire_events_reports_surfaces.sql
- Related routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts
- Related features/libs/agents: src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Related tests/docs: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, … (+4 more)

## Route surfaces
- src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts

## Feature files
- src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts

## Libs / agents / admin actions
- src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts

## Tests and docs
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/nav-config.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/entry-accept.test.ts
- Docs: AGENTS.md, README.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/tools/generate_repo_catalog.py
