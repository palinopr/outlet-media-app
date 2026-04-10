# Table: tm_events

Generated from the current working tree on 2026-04-10 18:02:26.

- Category: External ingest / reporting tables
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Non-migration references: 35
- Referenced by groups: src/app / admin (8), Docs / Plans (6), Tests / Features (5), Tests / App (2), agent / root (2), src/app / client (2), Tests / API (1), agent / prompts (1), src/app / api (1), src/features / client-portal (1), src/features / conversations (1), src/features / dashboard (1), … (+4 more)
- Routes: none
- Features: src/features/client-portal/types.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/reports/server.ts
- Shared libs: src/lib/database.types.ts
- Agent files: none
- Mutation-oriented files: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/features/event-follow-up-items/server.ts
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/admin/events/data.ts, src/app/api/ingest/ingest-tm-events.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts
- Behavior signals from references: server action/module (6), calls revalidatePath() (5), client component/module (3), calls redirect() (1), calls notFound() (1), sets dynamic rendering mode (1)
- Auth signals from references: imports Clerk server auth (13), references membership/scope access concepts (10), calls currentUser() (4), calls auth() (1)

## Reference files
- __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/read-clients.test.ts, agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.test.ts, … (+15 more)
