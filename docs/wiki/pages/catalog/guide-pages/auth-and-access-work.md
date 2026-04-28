# Start here: auth and access work

Generated from the current working tree on 2026-04-28 03:23:46.

Recommended read order for someone changing sign-in/up flows, invites, memberships, portal-entry behavior, or scope enforcement.

## Recommended wiki read order
- `./auth-access.md`
- `./business-rules.md`
- `./workflow-lifecycles.md`
- `./table-profiles.md`
- `./route-profiles.md`
- `./feature-profiles.md`

## Source entrypoints
- Routes: src/app/page.tsx, src/app/admin/layout.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts, src/app/api/user/profile/route.ts, src/app/client/page.tsx, src/app/client/[slug]/layout.tsx, … (+7 more)
- Feature files: src/features/access/revalidation.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/scope.ts, src/features/invitations/server.test.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, … (+3 more)
- Libs / agents / admin actions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- DB objects: client_access_invites, client_member_campaigns, client_member_events, client_members, clients
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/user/profile/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, … (+8 more)
- Docs: AGENTS.md, README.md, docs/context/codex-workflow.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/references/database-safety-runbook.md, docs/references/production-smoke-runbook.md, docs/wiki/pages/inventory/source-map.md, docs/wiki/pages/overview/repo-overview.md, docs/wiki/tools/generate_repo_catalog.py

## Signals seen in this area
- Auth signals: imports Clerk server auth (22), references membership/scope access concepts (22), calls currentUser() (9), calls auth() (7), contains explicit access/role guard helper usage (1)
- Behavior signals: client component/module (20), calls redirect() (7), sets dynamic rendering mode (5), server action/module (5), calls revalidatePath() (4), defines generateMetadata (3), calls notFound() (2), calls revalidateTag() (1), calls unstable_noStore() (1)
