# Database-to-Code Map

Generated from the current working tree on 2026-04-10 16:45:57.

This page maps database objects discovered in `supabase/migrations/*` to routes, features, libs, agent files, tests, and docs that mention them.

- Database objects tracked: 98

## `acquire_runtime_lease`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `ad_assets`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: src/app / admin (4), Tests / Features (2), Root Files (1), src/features / asset-follow-up-items (1), src/features / assets (1), src/features / conversations (1)
- Routes: none
- Features: src/features/asset-follow-up-items/server.ts, src/features/assets/server.ts, src/features/conversations/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/assets/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `admin_activity`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: Docs / Plans (2), Root Files (1), Docs / Context (1), src/app / admin (1), src/app / api (1), src/lib (1), supabase / root (1)
- Routes: src/app/api/admin/activity/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/context/current-priorities.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md
- Other mentions: AGENTS.md, src/app/admin/actions/audit.ts, supabase/AGENTS.md

## `admin_audit_log`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: Docs / Plans (3)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-admin-activity-tracking-design.md
- Other mentions: none

## `agent_alerts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218140000_agent_alerts.sql
- Mentioned by groups: Tests / API (1), agent / root (1), Docs / Plans (1), src/app / api (1), src/lib (1)
- Routes: src/app/api/alerts/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/alerts.test.ts
- Docs: docs/plans/2026-03-03-admin-activity-tracking-plan.md
- Other mentions: agent/MEMORY.md

## `agent_jobs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql
- Mentioned by groups: agent / root (1), Root Files (1), Docs / Plans (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-02-project-restructure-plan.md
- Other mentions: agent/LEARNINGS.md, audit/architecture-smells.md

## `agent_jobs_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `agent_runtime_state`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305010000_agent_runtime_state.sql
- Mentioned by groups: Root Files (2), agent / root (2), agent/src / services (2), src/lib (2), Tests / API (1), Docs / Context (1), src/app / api (1)
- Routes: src/app/api/agents/heartbeat/route.ts
- Features: none
- Shared libs: src/lib/agent-jobs.ts, src/lib/database.types.ts
- Agent runtime files: agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts
- Tests: __tests__/api/agents-heartbeat.test.ts
- Docs: docs/context/agent-patterns.md
- Other mentions: AGENTS.md, agent/LEARNINGS.md, agent/MEMORY.md, audit/agent-dead-code.md

## `agent_tasks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Mentioned by groups: Docs / Context (4), Docs / Plans (3), src/lib (3), agent / root (2), Docs / Superpowers Plans (2), Root Files (1), Tests / Features (1), agent / prompts (1), agent/src / services (1), Docs / Superpowers Specs (1), src/app / admin (1), src/app / api (1), … (+1 more)
- Routes: src/app/api/agents/route.ts
- Features: src/features/agent-outcomes/server.ts
- Shared libs: src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Agent runtime files: agent/src/services/queue-service.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts
- Docs: docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md
- Other mentions: AGENTS.md, agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/dashboard/data.ts

## `approval_requests`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: src/app / admin (4), Tests / Features (3), Docs / Context (3), Root Files (1), src/app / root routes (1), src/features / root files (1), src/features / approvals (1), src/features / notifications (1), supabase / root (1)
- Routes: none
- Features: src/features/AGENTS.md, src/features/approvals/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md
- Other mentions: AGENTS.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, supabase/AGENTS.md

## `asset_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306100000_asset_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: src/app / admin (3), Tests / Features (2), src/features / conversations (1), src/features / notifications (1)
- Routes: none
- Features: src/features/conversations/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `asset_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Tests / Features (3), src/app / admin (1), src/features / agent-outcomes (1), src/features / asset-follow-up-items (1), src/features / conversations (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/conversations/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts

## `asset_sources`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: src/app / admin (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts

## `calls`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Docs / Plans (6), Docs / Superpowers Plans (4), Root Files (3), Tests / API (2), agent / root (2), agent/src / events (2), src/app / client (2), src/features / client-agent (2), src/lib (2), agent/src / root (1), agent/src / services (1), Docs / Context (1), … (+3 more)
- Routes: src/app/api/ticketmaster/tm1/snapshot/route.ts
- Features: src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/runtime.test.ts
- Shared libs: src/lib/database.types.ts, src/lib/google-ads.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Agent runtime files: agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts
- Tests: __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Docs: docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, … (+2 more)
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, src/app/client/[slug]/campaign/[campaignId]/data.ts

## `campaign_action_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Mentioned by groups: Tests / Features (6), src/app / admin (6), src/features / campaign-action-items (2), Root Files (1), src/features / agent-outcomes (1), src/features / conversations (1), src/features / dashboard (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `campaign_client_overrides`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: Tests / Features (3), src/app / admin (3), src/lib (2), Root Files (1), Docs / Context (1), src/features / campaign-action-items (1)
- Routes: none
- Features: src/features/campaign-action-items/server.test.ts
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts
- Agent runtime files: none
- Tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts

## `campaign_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Mentioned by groups: Tests / Features (5), src/app / admin (4), src/app / api (3), Root Files (1), src/features / campaign-comments (1), src/features / conversations (1), src/features / dashboard (1), src/features / notifications (1)
- Routes: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts
- Features: src/features/campaign-comments/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `campaign_snapshots`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218120000_snapshot_tables.sql
- Mentioned by groups: Docs / Plans (4), agent / root (2), Tests / API (1), agent / prompts (1), src/app / admin (1), src/app / api (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts

## `client_access_invites`
- Kinds: table
- Defined in migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Mentioned by groups: src/app / api (2), Docs / Superpowers Plans (1), src/app / admin (1), src/features / client-portal (1), src/features / invitations (1), src/lib (1)
- Routes: src/app/api/admin/invite/route.ts
- Features: src/features/client-portal/entry.ts, src/features/invitations/server.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/api/admin/invite/route.test.ts
- Docs: docs/superpowers/plans/2026-03-22-outlet-web-reset.md
- Other mentions: src/app/admin/actions/users.ts

## `client_access_invites_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `client_accounts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260302_create_client_accounts.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: src/app / admin (4), Docs / Plans (2), Tests / Features (1), src/app / api (1), src/features / settings (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/meta/data-deletion/route.ts
- Features: src/features/settings/summary.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/features/settings/summary.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `client_agent_messages`
- Kinds: table
- Defined in migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Mentioned by groups: Docs / Superpowers Plans (2), src/features / client-agent (2), src/lib (1)
- Routes: none
- Features: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md
- Other mentions: none

## `client_agent_threads`
- Kinds: table
- Defined in migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Mentioned by groups: src/features / client-agent (2), Docs / Superpowers Plans (1), src/lib (1)
- Routes: none
- Features: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md
- Other mentions: none

## `client_agent_threads_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `client_member_campaigns`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: src/app / admin (3), src/lib (2), Tests / Features (1), Docs / Context (1), src/features / notifications (1)
- Routes: none
- Features: src/features/notifications/server.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent runtime files: none
- Tests: __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `client_member_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: src/app / admin (3), src/lib (2), Tests / Features (1), Docs / Context (1), src/features / notifications (1)
- Routes: none
- Features: src/features/notifications/server.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent runtime files: none
- Tests: __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `client_members`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Mentioned by groups: src/app / admin (4), Root Files (2), Docs / Context (2), Docs / Plans (2), Docs / Superpowers Plans (2), src/lib (2), Tests / Features (1), src/app / api (1), src/features / client-portal (1), src/features / notifications (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features: src/features/client-portal/entry.ts, src/features/notifications/server.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent runtime files: none
- Tests: __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts

## `client_services`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306173000_client_services_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `clients`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql
- Mentioned by groups: src/components / admin (25), src/app / admin (21), Docs / Plans (19), Tests / Features (14), Docs / Context (7), Root Files (5), Docs / Superpowers Specs (5), src/features / client-agent (5), Docs / Superpowers Plans (4), src/app / api (3), src/features / client-portal (3), src/lib (3), … (+11 more)
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts
- Features: src/features/access/revalidation.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/events/server.ts, … (+5 more)
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Agent runtime files: none
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, … (+15 more)
- Docs: docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, … (+25 more)
- Other mentions: AGENTS.md, README.md, agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, audit/architecture-smells.md, audit/dead-routes.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, … (+29 more)

## `compliance_logs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `contact_submissions`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306190000_contact_submissions_rls.sql
- Mentioned by groups: Docs / Plans (2), src/app / api (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-03-landing-page-design.md, docs/plans/2026-03-03-landing-page-plan.md
- Other mentions: none

## `conversation_checkpoints`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `crm_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306100000_crm_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: src/app / admin (2), Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: src/app/admin/clients/data.test.ts
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `crm_contacts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306090000_crm_contacts.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Root Files (1), src/app / admin (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `crm_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306093000_crm_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Root Files (1), src/app / admin (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `current_clerk_user_id`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `effective_campaign_client_slug`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `email_drafts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070000_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (2), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: AGENTS.md, audit/architecture-smells.md

## `email_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070000_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (2), Docs / Superpowers Plans (1), src/app / admin (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-03-10-agent-code-quality-10-10.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `email_reply_examples`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070000_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (1), src/app / admin (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `event_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306110000_event_comments.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Mentioned by groups: src/app / admin (4), Tests / Features (3), src/app / api (2), src/features / conversations (1), src-features-event-comments (1), src/features / events (1), src/features / notifications (1)
- Routes: src/app/api/event-comments/route.ts
- Features: src/features/conversations/server.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts, src/app/api/event-comments/route.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/clients/data.ts

## `event_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Mentioned by groups: Tests / Features (6), src/app / admin (2), src/features / agent-outcomes (1), src/features / conversations (1), src/features / event-follow-up-items (1), src/features / events (1), src/features / notifications (1)
- Routes: none
- Features: src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Shared libs: none
- Agent runtime files: none
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts
- Docs: none
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts

## `event_snapshots`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218120000_snapshot_tables.sql, supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: agent / root (2), Tests / API (1), Tests / App (1), agent / prompts (1), src/app / admin (1), src/app / api (1), src/app / client (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/event-detail-data.test.ts
- Docs: none
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-tm-events.ts, src/app/client/[slug]/event/[eventId]/data.ts

## `growth_accounts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_accounts_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_content_jobs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_content_jobs_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_ideas`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_ideas_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_inbound_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_inbound_events_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_lanes`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_lanes_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_leads`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_leads_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_playbooks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_playbooks_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_post_targets`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `growth_post_targets_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `growth_publish_attempts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260307133000_growth_publish_attempts.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `growth_publish_attempts_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260307133000_growth_publish_attempts.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `handle_updated_at`
- Kinds: function
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `internal_dnc`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `is_current_client_member`
- Kinds: function
- Defined in migrations: supabase/migrations/20260307143000_client_member_roster_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `leads`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: agent / root (1), agent / scripts (1), Root Files (1), Docs / Plans (1), src/features / client-agent (1), src/features / client-portal (1), src/lib (1)
- Routes: none
- Features: src/features/client-agent/store.test.ts, src/features/client-portal/insights.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: agent/MEMORY.md, agent/scripts/growth-ledger.ts, audit/architecture-smells.md

## `meta_campaigns`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Mentioned by groups: Docs / Plans (10), src/app / admin (7), Tests / Features (5), src/lib (4), Tests / App (2), agent / root (2), src/app / api (2), src/app / client (2), Tests / API (1), agent / prompts (1), Docs / Context (1), src/features / assets (1), … (+4 more)
- Routes: src/app/api/campaign-comments/route.ts
- Features: src/features/assets/server.ts, src/features/campaign-action-items/server.test.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/events/server.ts
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/search.test.ts
- Docs: docs/context/current-priorities.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, … (+1 more)
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/admin/events/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts, … (+2 more)

## `meta_campaigns_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `notifications`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Tests / Features (5), Root Files (4), Docs / Context (4), src/app / admin (4), src/app / api (4), Docs / Plans (2), Docs / Superpowers Plans (2), Docs / Superpowers Specs (2), src/features / campaign-action-items (2), agent/src / discord (1), src/app / root routes (1), src/features / asset-follow-up-items (1), … (+5 more)
- Routes: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/privacy/page.tsx
- Features: src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts, src/features/workflow/revalidation.test.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: agent/src/discord/core/entry.ts
- Tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Docs: docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-02-core-reset-salvage-map.md, docs/superpowers/specs/2026-03-22-web-reset-design.md, docs/superpowers/specs/2026-03-27-shell-reset-design.md
- Other mentions: audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, tsconfig.tsbuildinfo

## `pf_update_updated_at`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `recordings`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `release_runtime_lease`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `scheduled_callbacks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `system_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: Docs / Context (5), Tests / Features (4), Root Files (2), Docs / Superpowers Plans (2), Docs / Superpowers Specs (2), src/app / admin (2), agent / prompts (1), agent/src / services (1), Docs / Plans (1), src/app / root routes (1), src/features / root files (1), src/features / agent-outcomes (1), … (+3 more)
- Routes: none
- Features: src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/dashboard/server.ts, src/features/system-events/server.ts
- Shared libs: none
- Agent runtime files: agent/src/services/system-events-service.ts
- Tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/system-events/list.test.ts
- Docs: docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/specs/2026-03-31-client-agent-tab-design.md, docs/superpowers/specs/2026-04-03-agent-simplification-design.md
- Other mentions: AGENTS.md, agent/prompts/agent.txt, audit/architecture-smells.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, supabase/AGENTS.md

## `tm_event_daily`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `tm_event_demographics`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: Tests / App (2), Docs / Plans (2), src/app / client (2), Tests / API (1), agent / root (1), src/app / admin (1), src/app / api (1), src/features / client-portal (1), src/lib (1)
- Routes: none
- Features: src/features/client-portal/types.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md
- Other mentions: agent/MEMORY.md, src/app/admin/events/data.ts, src/app/api/ingest/ingest-tm-demographics.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts

## `tm_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Mentioned by groups: src/app / admin (8), Docs / Plans (6), Tests / Features (5), Tests / App (2), agent / root (2), src/app / client (2), Tests / API (1), agent / prompts (1), src/app / api (1), src/features / client-portal (1), src/features / conversations (1), src/features / dashboard (1), … (+4 more)
- Routes: none
- Features: src/features/client-portal/types.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/reports/server.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md
- Other mentions: agent/LEARNINGS.md, agent/MEMORY.md, agent/prompts/agent.txt, src/app/admin/actions/clients.ts, src/app/admin/actions/events.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/admin/events/data.ts, src/app/api/ingest/ingest-tm-events.ts, … (+2 more)

## `tm_events_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `update_updated_at_column`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_accounts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_accounts_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_contacts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_contacts_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_conversations`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_conversations_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_messages`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_messages_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260306130000_whatsapp_cloud.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_ticket_concierge_bans`
- Kinds: table
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_ticket_concierge_bans_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_ticket_concierge_checkout_attempts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_ticket_concierge_checkout_attempts_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_ticket_concierge_option_sets`
- Kinds: table
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_ticket_concierge_option_sets_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `whatsapp_ticket_concierge_options`
- Kinds: table
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_ticket_concierge_runs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: Docs / Superpowers Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md
- Other mentions: none

## `whatsapp_ticket_concierge_runs_updated_at`
- Kinds: trigger
- Defined in migrations: supabase/migrations/20260401190000_whatsapp_ticket_concierge.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `workspace_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `workspace_pages`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1), src/app / admin (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts

## `workspace_tasks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1), src/app / admin (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/clients.ts
