# Table: calls

Generated from the current working tree on 2026-04-10 16:45:57.

- Category: External ingest / reporting tables
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 31
- Referenced by groups: Docs / Plans (6), Docs / Superpowers Plans (4), Root Files (3), Tests / API (2), agent / root (2), agent/src / events (2), src/app / client (2), src/features / client-agent (2), src/lib (2), agent/src / root (1), agent/src / services (1), Docs / Context (1), … (+3 more)
- Routes: src/app/api/ticketmaster/tm1/snapshot/route.ts
- Features: src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/runtime.test.ts
- Shared libs: src/lib/database.types.ts, src/lib/google-ads.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Agent files: agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts
- Mutation-oriented files: agent/src/events/message-handler.test.ts, agent/src/services/queue-service.ts, src/lib/ticketmaster/tm1-client.test.ts
- Tests: __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Docs: docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-03-agent-simplification.md, docs/superpowers/specs/2026-04-01-client-agent-tool-driven-runtime-design.md
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, src/app/client/[slug]/campaign/[campaignId]/data.ts
- Behavior signals from references: client component/module (1)
- Auth signals from references: references membership/scope access concepts (4), calls auth() (1), imports Clerk server auth (1), calls currentUser() (1)

## Reference files
- __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, agent/LEARNINGS.md, agent/MEMORY.md, agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts, audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md, … (+11 more)
