# Outlet Repo Wiki Index

## Primary file-by-file catalog
- [Repo File Catalog](./pages/catalog/manifest.md) — generated file-by-file inventory from the current working tree.
- [Working Tree Snapshot](./pages/catalog/working-tree.md) — modified, untracked, and excluded local paths currently present.
- [Group Dependency Map](./pages/catalog/group-dependencies.md) — internal dependencies rolled up by catalog group.
- [Feature Module Dependency Map](./pages/catalog/feature-dependencies.md) — internal dependencies rolled up by `src/features/*` module.
- [Route Stack Map](./pages/catalog/route-stacks.md) — route file to component/feature/lib stack map.
- [Route Profiles](./pages/catalog/route-profiles.md) — deeper behavior/context pages for each route file.
- [Feature Profiles](./pages/catalog/feature-profiles.md) — deeper behavior/context pages for each feature module.
- [Business Rule Pages](./pages/catalog/business-rules.md) — deeper rule-oriented pages grouped around major business constraints.
- [Table Profiles](./pages/catalog/table-profiles.md) — deeper per-table pages for migration-discovered tables.
- [Service Boundary Map](./pages/catalog/service-boundaries.md) — web vs agent vs database bridge surfaces and shared boundary files.
- [Onboarding Guides](./pages/catalog/onboarding-guides.md) — human-oriented read-order guides for common work areas.
- [Key File Symbol Map](./pages/catalog/key-file-symbols.md) — exported symbols and top-level definitions for important code files.
- [Auth and Access Map](./pages/catalog/auth-access.md) — auth, membership, invite, and scope-related routes/files/DB objects.
- [Workflow and Event Map](./pages/catalog/workflow-events.md) — workflow-bearing DB objects and code files.
- [Workflow Lifecycle Pages](./pages/catalog/workflow-lifecycles.md) — deeper lifecycle pages grouped around major system flows.
- [Mutation Surface Map](./pages/catalog/mutation-surfaces.md) — obvious state-changing routes, actions, and helpers.
- [Env and Integration Map](./pages/catalog/env-integrations.md) — env vars grouped by integration service and code references.
- [Database-to-Code Map](./pages/catalog/database-to-code.md) — database objects linked back to routes, features, libs, tests, and docs.
- [Supabase Schema Map](./pages/catalog/supabase-schema.md) — migration-discovered schema objects grouped by kind.
- [API Contract Map](./pages/catalog/api-contracts.md) — API route methods, request/response signals, validation hints, and dependency context.
- [Component Tree Map](./pages/catalog/component-trees.md) — admin/client UI surface component trees.
- [Test Coverage Map](./pages/catalog/test-coverage.md) — code files linked to exact direct and transitive tests.

## Overview
- [Repo Overview](./pages/overview/repo-overview.md) — product shape, active systems, and current repo understanding.

## Structural inventory
- [Source Map](./pages/inventory/source-map.md) — admin/client/API route map, feature-module map, and agent runtime file map.
- [Feature Modules](./pages/inventory/feature-modules.md) — grouped feature ownership map.

## Secondary audit pages
- [Mismatch Register](./pages/audits/mismatch-register.md) — optional findings page for doc/code/runtime mismatches.
- [Dead Ends and Dead Code](./pages/audits/dead-ends-and-dead-code.md) — optional cleanup-tracking page.

## Operations
- [Log](./log.md) — chronological wiki maintenance log.
- [Schema / Instructions](./AGENTS.md) — how this wiki should be maintained.
- [Raw Sources](./raw/README.md) — what counts as source material for this wiki.
