# Repo Wiki Log

## [2026-04-10] client-events | operating loop slice on event detail
- Added the client event operating-loop slice to the shipped web surface:
  - new shared event workflow loader in `src/features/events/client-operating.ts`
  - new shared event comment reader/access module in `src/features/event-comments/server.ts`
  - new client workflow UI in `src/app/client/[slug]/components/event-operating-panel.tsx`
  - new event discussion composer in `src/app/client/[slug]/components/event-discussion-form.tsx`
  - client event detail now combines ticketing analytics with approvals, shared discussion, event follow-up items, linked agent follow-through, and recent activity
- Added `GET`/`POST` support for shared event discussion via `src/app/api/event-comments/route.ts`, including scope-aware access checks, system events, notifications, agent triage requests, and workflow revalidation.
- Extended approval and system-event helpers so event operating views can include event-linked and linked-campaign context without rebuilding route-local filtering.
- Added component and route coverage for the new event operating panel, event discussion form, event comments API, and approval helper behavior.

## [2026-04-10] client-campaign | operating loop slice and verification hygiene
- Added the first client campaign operating-loop slice to the shipped web surface:
  - new shared client campaign workflow loader in `src/features/campaigns/server.ts`
  - new client workflow UI in `src/app/client/[slug]/components/campaign-operating-panel.tsx`
  - new comment composer in `src/app/client/[slug]/components/campaign-discussion-form.tsx`
  - client campaign detail now combines analytics with approvals, shared discussion, open action items, agent follow-through, and recent activity
- Added component coverage for the new client operating panel and campaign discussion form.
- Fixed repo verification hygiene by excluding `tmp-playwright/**` from Vitest so `npm run check:web` no longer fails on local scratch Playwright files.
- Regenerated the wiki catalog with `python3 docs/wiki/tools/generate_repo_catalog.py` and updated the overview/audit pages to reflect the shipped client operating slice and the resolved Vitest mismatch.

## [2026-04-10] guides | service boundaries and human read-order pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/service-boundaries.md`
  - `docs/wiki/pages/catalog/onboarding-guides.md`
  - nested generated pages under `docs/wiki/pages/catalog/guide-pages/`
- Added a service-boundary page summarizing web vs agent vs database ownership and the shared bridge files that connect those systems.
- Added human-oriented onboarding/read-order guides for admin web work, client portal work, agent runtime work, auth/access work, and reporting/ingest work.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] profiles | business rules and per-table pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/business-rules.md`
  - nested generated pages under `docs/wiki/pages/catalog/business-rule-pages/`
  - `docs/wiki/pages/catalog/table-profiles.md`
  - nested generated pages under `docs/wiki/pages/catalog/table-pages/`
- Added business-rule pages that group files, DB objects, routes, tests, docs, auth signals, and behavior signals around major rule areas such as access, campaign scope, approvals, client-agent read-only behavior, agent runtime recovery, and reporting from the shared backbone.
- Added per-table pages for migration-discovered tables with migrations, reference counts, route/feature/lib/agent usage, mutation-oriented files, and behavior/auth signals from referencing code.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these deeper generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | env/integrations and lifecycle narratives
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/env-integrations.md`
  - `docs/wiki/pages/catalog/workflow-lifecycles.md`
  - nested generated pages under `docs/wiki/pages/catalog/lifecycle-pages/`
- Added an env/integration map that groups environment variables by integration service and shows which routes, features, libs, agent files, tests, and docs reference them.
- Added lifecycle pages that group routes, features, libs, tests, docs, and DB objects around major system flows such as access/invites, agent runtime, campaign discussion/action items, event follow-up, client-agent conversations, approvals/shared timeline, and ingest/snapshots.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | auth/access, workflow, and mutations
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/auth-access.md`
  - `docs/wiki/pages/catalog/workflow-events.md`
  - `docs/wiki/pages/catalog/mutation-surfaces.md`
- Added an auth/access map for route files, code files, and DB objects tied to authentication, membership, invites, and scope.
- Added a workflow/event map for workflow-bearing DB objects and the code files that orchestrate them.
- Added a mutation-surface map for API mutation routes, admin actions, and mutation-oriented helpers/runtime files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] profiles | deep route and feature pages
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/route-profiles.md`
  - `docs/wiki/pages/catalog/feature-profiles.md`
  - nested generated pages under `docs/wiki/pages/catalog/route-pages/`
  - nested generated pages under `docs/wiki/pages/catalog/feature-pages/`
- Added deeper semantic/behavior summaries for each route file, including auth signals, behavior signals, DB objects touched, tests, and grouped dependency stacks.
- Added deeper feature-module summaries for each `src/features/*` module, including entry files, server/client split, route users, DB objects touched, tests, auth/access signals, behavior signals, and exporting files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these deeper generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | api contracts, schema grouping, and component trees
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/supabase-schema.md`
  - `docs/wiki/pages/catalog/api-contracts.md`
  - `docs/wiki/pages/catalog/component-trees.md`
- Added schema grouping documentation that organizes migration-discovered database objects by kind.
- Added API contract documentation that summarizes route methods, request/response signals, validation symbols, dependency context, and related tests for `src/app/api/**/route.ts` files.
- Added component tree documentation for admin and client surface entry files, including direct components, transitive component categories, feature modules, libs, and related tests.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | database references and test coverage
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/database-to-code.md`
  - `docs/wiki/pages/catalog/test-coverage.md`
- Added database-to-code documentation that maps database objects discovered in migrations back to routes, features, libs, agent files, tests, docs, and other mentions.
- Added test coverage documentation that maps code files to exact direct and transitive linked tests.
- Improved import extraction to include dynamic `import()`, `vi.mock()`, and `require()` patterns so test-to-source links are captured more accurately.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] maps | route stacks and key file symbols
- Expanded `docs/wiki/tools/generate_repo_catalog.py` again so the generated wiki now also emits:
  - `docs/wiki/pages/catalog/route-stacks.md`
  - `docs/wiki/pages/catalog/key-file-symbols.md`
- Added route stack documentation that maps each Next.js special route file to its direct and transitive internal dependency stack, touched groups, touched feature modules, related libs, and related tests.
- Added key-file symbol documentation that lists exported symbols, symbol details, definitions, route owners, and related tests for important route, feature, lib, component, and agent runtime files.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so these generated pages are treated as first-class entrypoints.

## [2026-04-10] cross-links | tests, routes, and dependency maps
- Expanded `docs/wiki/tools/generate_repo_catalog.py` so the generated catalog now adds cross-links for imported-by relationships, test links, route-owner links, dependency groups, and feature-module labels.
- Added generated dependency overview pages:
  - `docs/wiki/pages/catalog/group-dependencies.md`
  - `docs/wiki/pages/catalog/feature-dependencies.md`
- Improved internal import resolution so alias imports and agent `.js` runtime-style imports resolve back to source files when possible.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` to reflect the stronger catalog shape.

## [2026-04-10] catalog | generated file-by-file repo catalog
- Re-scoped the wiki toward documentation-first coverage.
- Added `docs/wiki/tools/generate_repo_catalog.py` to generate folder-level catalog pages from the current working tree.
- Generated `docs/wiki/pages/catalog/manifest.md` plus per-folder pages covering source files, docs, tests, migrations, config, and public assets.
- Generated `docs/wiki/pages/catalog/working-tree.md` to document modified and untracked paths currently present.
- Expanded catalog detail so each file entry now captures path, status, system, group, ownership, type, construction, route/route-context when relevant, line count, byte size, imports, exports, symbol definitions, and format-specific details such as tests, headings, JSON keys, and SQL objects.
- Updated `docs/wiki/index.md` and `docs/wiki/AGENTS.md` so the file catalog is now the primary entrypoint.
- Current generated catalog scope: 709 files from the current working tree, excluding dependency/build/local-output directories and the generated catalog pages themselves.

## [2026-04-10] bootstrap | initial repo understanding wiki
- Created `docs/wiki/` as the repo-understanding layer.
- Read current durable context docs:
  - `docs/context/product-direction.md`
  - `docs/context/engineering-principles.md`
  - `docs/context/agent-patterns.md`
  - `docs/context/current-priorities.md`
  - `docs/context/repo-organization.md`
- Read root `README.md` and `package.json`.
- Inventoried current routes, feature modules, and agent runtime files.
- Created initial overview, inventory, and secondary audit pages as starter structure.
