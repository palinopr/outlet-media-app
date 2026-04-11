# Table: notifications

Generated from the current working tree on 2026-04-10 22:05:59.

- Category: Shared timeline / approvals / notifications
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 37
- Referenced by groups: Tests / Features (5), Root Files (4), Docs / Context (4), src/app / admin (4), src/app / api (4), Docs / Plans (2), Docs / Superpowers Plans (2), Docs / Superpowers Specs (2), src/features / campaign-action-items (2), agent/src / discord (1), src/app / root routes (1), src/features / asset-follow-up-items (1), … (+5 more)
- Routes: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/privacy/page.tsx
- Features: src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts, src/features/workflow/revalidation.test.ts
- Shared libs: src/lib/database.types.ts
- Agent files: agent/src/discord/core/entry.ts
- Mutation-oriented files: agent/src/discord/core/entry.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts
- Tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Docs: docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, docs/superpowers/specs/2026-03-22-web-reset-design.md, docs/superpowers/specs/2026-03-27-shell-reset-design.md
- Other mentions: audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, tsconfig.tsbuildinfo
- Behavior signals from references: server action/module (3), calls redirect() (2), calls revalidatePath() (2), client component/module (1)
- Auth signals from references: imports Clerk server auth (13), references membership/scope access concepts (9), calls currentUser() (5), calls auth() (1)

## Reference files
- __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, agent/src/discord/core/entry.ts, audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, docs/superpowers/specs/2026-03-22-web-reset-design.md, docs/superpowers/specs/2026-03-27-shell-reset-design.md, src/app/admin/actions/campaign-action-items.test.ts, … (+17 more)
