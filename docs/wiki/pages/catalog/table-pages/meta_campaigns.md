# Table: meta_campaigns

Generated from the current working tree on 2026-04-10 21:59:58.

- Category: External ingest / reporting tables
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Non-migration references: 42
- Referenced by groups: Docs / Plans (10), src/app / admin (7), Tests / Features (5), src/lib (4), Tests / App (2), agent / root (2), src/app / api (2), src/app / client (2), Tests / API (1), agent / prompts (1), Docs / Context (1), src/features / assets (1), … (+4 more)
- Routes: src/app/api/campaign-comments/route.ts
- Features: src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/events/server.ts
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/api/campaign-comments/route.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/search.test.ts
- Docs: docs/context/current-priorities.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/admin/events/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts
- Behavior signals from references: calls revalidatePath() (6), server action/module (6), client component/module (5), calls redirect() (2), calls notFound() (1), sets dynamic rendering mode (1)
- Auth signals from references: imports Clerk server auth (16), references membership/scope access concepts (12), calls currentUser() (6), calls auth() (2)

## Reference files
- __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, docs/context/current-priorities.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, … (+22 more)
