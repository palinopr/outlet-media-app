# Repo File Catalog

Generated from the current working tree on 2026-04-10 17:55:29.

This catalog is documentation-first: it describes what files exist, what each file contains, how each file is constructed, and which system or folder ownership it belongs to.

## Scope
- Cataloged files: 731
- Catalog uses the current working tree, so modified and untracked source files are included if they live in the documented code/doc paths.
- Excluded from the generated catalog to avoid noise or recursion: `.git/`, `node_modules/`, `.next/`, `agent/.next/`, `agent/dist/`, `test-results/`, `tmp-playwright/`, `session/`, `.opencode/`, `.claude/`, `.worktrees/`, and `docs/wiki/pages/catalog/`.

## System counts
- agent: 43
- database: 68
- docs: 112
- github: 2
- public: 17
- root: 25
- tests: 49
- web: 415

## Cross-link and dependency pages
- [Group Dependency Map](./group-dependencies.md) — internal dependencies rolled up by catalog group
- [Feature Module Dependency Map](./feature-dependencies.md) — internal dependencies rolled up by `src/features/*` module
- [Route Stack Map](./route-stacks.md) — route file to component/feature/lib stack map
- [Route Profiles](./route-profiles.md) — deeper behavior/context pages for each route file
- [Feature Profiles](./feature-profiles.md) — deeper behavior/context pages for each feature module
- [Business Rule Pages](./business-rules.md) — deeper rule-oriented pages grouped around major business constraints
- [Table Profiles](./table-profiles.md) — deeper per-table pages for migration-discovered tables
- [Schema Object Profiles](./schema-object-profiles.md) — deeper pages for functions, views, triggers, and other non-table schema objects
- [Impact Maps](./impact-maps.md) — if-you-touch-X pages for high-impact shared files
- [Service Boundary Map](./service-boundaries.md) — web vs agent vs database bridge surfaces and shared boundary files
- [Onboarding Guides](./onboarding-guides.md) — human-oriented read-order guides for common work areas
- [Key File Symbol Map](./key-file-symbols.md) — exported symbols and top-level definitions for important code files
- [Auth and Access Map](./auth-access.md) — auth, membership, invite, and scope-related routes/files/DB objects
- [Workflow and Event Map](./workflow-events.md) — workflow-bearing DB objects and code files
- [Workflow Lifecycle Pages](./workflow-lifecycles.md) — deeper lifecycle pages grouped around major system flows
- [Mutation Surface Map](./mutation-surfaces.md) — obvious state-changing routes, actions, and helpers
- [Env and Integration Map](./env-integrations.md) — env vars grouped by integration service and code references
- [Database-to-Code Map](./database-to-code.md) — database objects linked back to code, routes, tests, and docs
- [Supabase Schema Map](./supabase-schema.md) — migration-discovered schema objects grouped by kind
- [API Contract Map](./api-contracts.md) — API route methods, request/response signals, and dependency context
- [Component Tree Map](./component-trees.md) — admin/client UI surface component trees
- [Test Coverage Map](./test-coverage.md) — code files linked to exact direct and transitive tests

## Group pages
- [agent / config](./agent-config.md) — 1 files
- [agent / context](./agent-context.md) — 2 files
- [agent / prompts](./agent-prompts.md) — 1 files
- [agent / root](./agent-root.md) — 13 files
- [agent / scripts](./agent-scripts.md) — 5 files
- [agent/src / discord](./agent-src-discord.md) — 3 files
- [agent/src / events](./agent-src-events.md) — 2 files
- [agent/src / root](./agent-src-root.md) — 3 files
- [agent/src / services](./agent-src-services.md) — 9 files
- [agent/src / utils](./agent-src-utils.md) — 4 files
- [Docs / Context](./docs-context.md) — 17 files
- [Docs / Plans](./docs-plans.md) — 30 files
- [Docs / References](./docs-references.md) — 2 files
- [Docs / Root](./docs-root.md) — 2 files
- [Docs / Screenshots](./docs-screenshots.md) — 30 files
- [Docs / Superpowers Plans](./docs-superpowers-plans.md) — 11 files
- [Docs / Superpowers Specs](./docs-superpowers-specs.md) — 10 files
- [Docs / Wiki (manual control pages)](./docs-wiki.md) — 10 files
- [.github](./github.md) — 2 files
- [Root Mocks](./mocks.md) — 1 files
- [Public Assets](./public.md) — 17 files
- [Root Files](./root.md) — 24 files
- [src/app / admin](./src-app-admin.md) — 54 files
- [src/app / api](./src-app-api.md) — 40 files
- [src/app / client](./src-app-client.md) — 63 files
- [src/app / root routes](./src-app-root.md) — 18 files
- [src/components / admin](./src-components-admin.md) — 64 files
- [src/components / charts](./src-components-charts.md) — 2 files
- [src/components / client](./src-components-client.md) — 17 files
- [src/components / landing](./src-components-landing.md) — 9 files
- [src/components / shared](./src-components-shared.md) — 1 files
- [src/components / ui](./src-components-ui.md) — 13 files
- [src/features / access](./src-features-access.md) — 1 files
- [src/features / agent-outcomes](./src-features-agent-outcomes.md) — 2 files
- [src/features / agents](./src-features-agents.md) — 1 files
- [src/features / approvals](./src-features-approvals.md) — 2 files
- [src/features / asset-follow-up-items](./src-features-asset-follow-up-items.md) — 1 files
- [src/features / assets](./src-features-assets.md) — 3 files
- [src/features / campaign-action-items](./src-features-campaign-action-items.md) — 2 files
- [src/features / campaign-comments](./src-features-campaign-comments.md) — 1 files
- [src/features / campaigns](./src-features-campaigns.md) — 4 files
- [src/features / client-agent](./src-features-client-agent.md) — 33 files
- [src/features / client-portal](./src-features-client-portal.md) — 13 files
- [src/features / clients](./src-features-clients.md) — 1 files
- [src/features / conversations](./src-features-conversations.md) — 2 files
- [src/features / dashboard](./src-features-dashboard.md) — 2 files
- [src-features-event-comments](./src-features-event-comments.md) — 1 files
- [src/features / event-follow-up-items](./src-features-event-follow-up-items.md) — 1 files
- [src/features / events](./src-features-events.md) — 3 files
- [src/features / invitations](./src-features-invitations.md) — 4 files
- [src/features / notifications](./src-features-notifications.md) — 4 files
- [src/features / operations-center](./src-features-operations-center.md) — 1 files
- [src/features / reports](./src-features-reports.md) — 3 files
- [src/features / root files](./src-features-root.md) — 1 files
- [src/features / settings](./src-features-settings.md) — 2 files
- [src/features / shared](./src-features-shared.md) — 1 files
- [src/features / system-events](./src-features-system-events.md) — 1 files
- [src/features / users](./src-features-users.md) — 1 files
- [src/features / workflow](./src-features-workflow.md) — 2 files
- [src / hooks](./src-hooks.md) — 1 files
- [src/lib](./src-lib.md) — 32 files
- [src/lib / ticketmaster](./src-lib-ticketmaster.md) — 2 files
- [src / Root](./src-root.md) — 2 files
- [src / scripts](./src-scripts.md) — 4 files
- [supabase / migrations](./supabase-migrations.md) — 67 files
- [supabase / root](./supabase-root.md) — 1 files
- [Tests / API](./tests-api.md) — 5 files
- [Tests / App](./tests-app.md) — 3 files
- [Tests / Features](./tests-features.md) — 36 files
- [Tests / Lib](./tests-lib.md) — 4 files
- [Tests / Root](./tests-root.md) — 1 files
