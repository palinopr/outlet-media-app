# Table: if

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Other tables
- Kinds: table
- Migrations: supabase/migrations/20260428002000_remove_ticketing_artifacts.sql
- Non-migration references: 130
- Referenced by groups: src/components / admin (22), src/lib (18), src/app / admin (16), src/app / api (15), src/components / client (11), src/app / client (9), src/features / client-portal (7), Root Files (5), src/app / root routes (4), .github (3), Docs / Context (2), src/components / landing (2), … (+14 more)
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/layout.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/callback/route.ts, src/app/api/meta/data-deletion/route.ts, … (+10 more)
- Features: src/features/access/revalidation.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.ts, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.ts, src/features/clients/summary.ts, src/features/invitations/server.ts, … (+4 more)
- Shared libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/env.ts, src/lib/export-csv.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/lib/meta-api.ts, … (+6 more)
- Agent files: none
- Mutation-oriented files: e2e/authenticated-smoke.spec.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/meta-sync.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/campaigns/campaign-cells.tsx, … (+13 more)
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts
- Docs: docs/context/codex-workflow.md, docs/context/meta-ads-playbook.md, docs/references/production-smoke-runbook.md
- Other mentions: .github/workflows/codex-pr-review.yml, .github/workflows/db-drift.yml, .github/workflows/e2e-smoke.yml, AGENTS.md, audit/architecture-smells.md, audit/dead-routes.md, audit/imports-deps.md, e2e/authenticated-smoke.spec.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/meta-sync.ts, … (+50 more)
- Behavior signals from references: client component/module (33), calls redirect() (7), server action/module (5), calls revalidatePath() (4), calls notFound() (2), sets dynamic rendering mode (2), defines generateMetadata (1)
- Auth signals from references: imports Clerk server auth (29), references membership/scope access concepts (15), calls currentUser() (14), calls auth() (8)

## Reference files
- .github/workflows/codex-pr-review.yml, .github/workflows/db-drift.yml, .github/workflows/e2e-smoke.yml, AGENTS.md, __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, audit/architecture-smells.md, audit/dead-routes.md, audit/imports-deps.md, docs/context/codex-workflow.md, docs/context/meta-ads-playbook.md, docs/references/production-smoke-runbook.md, e2e/authenticated-smoke.spec.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/meta-sync.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, … (+110 more)
