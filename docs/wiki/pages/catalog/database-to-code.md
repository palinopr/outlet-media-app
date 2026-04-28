# Database-to-Code Map

Generated from the current working tree on 2026-04-28 02:57:59.

This page maps database objects discovered in `supabase/migrations/*` to routes, features, libs, agent files, tests, and docs that mention them.

- Database objects tracked: 83

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
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `admin_activity`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: Docs / Plans (2), Root Files (1), Docs / Context (1), Docs / References (1), src/app / admin (1), src/app / api (1), src/lib (1), supabase / root (1)
- Routes: src/app/api/admin/activity/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/references/database-safety-runbook.md
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
- Mentioned by groups: Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-03-admin-activity-tracking-plan.md
- Other mentions: none

## `agent_jobs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql
- Mentioned by groups: Root Files (1), Docs / Plans (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-02-project-restructure-plan.md
- Other mentions: audit/architecture-smells.md

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
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/agent-dead-code.md

## `agent_tasks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Mentioned by groups: Docs / Plans (3)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: none

## `application_errors`
- Kinds: table
- Defined in migrations: supabase/migrations/20260428003000_create_application_errors.sql
- Mentioned by groups: src/app / api (2), Docs / References (1), src/app / admin (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/observability/client-error/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/api/observability/client-error/route.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: none

## `approval_requests`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: supabase / root (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: supabase/AGENTS.md

## `asset_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306100000_asset_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `asset_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `asset_sources`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `calls`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Docs / Plans (6), Root Files (3), src/app / client (2), Docs / Context (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/google-ads.test.ts
- Agent runtime files: none
- Tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Docs: docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md
- Other mentions: audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md, src/app/client/[slug]/campaign/[campaignId]/data.ts

## `campaign_action_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `campaign_client_overrides`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Mentioned by groups: src/app / admin (3), src/lib (3), Root Files (1), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: audit/architecture-smells.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts

## `campaign_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `campaign_snapshots`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218120000_snapshot_tables.sql
- Mentioned by groups: Docs / Plans (4), Tests / API (1), Docs / References (1), src/app / admin (1), src/app / api (1), src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts

## `client_access_invites`
- Kinds: table
- Defined in migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Mentioned by groups: src/app / api (2), src/features / client-portal (2), Docs / References (1), src/app / admin (1), src/features / invitations (1), src/lib (1)
- Routes: src/app/api/admin/invite/route.ts
- Features: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/api/admin/invite/route.test.ts
- Docs: docs/references/database-safety-runbook.md
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
- Defined in migrations: supabase/migrations/20260302000001_create_client_accounts.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: src/app / admin (4), Docs / Plans (2), Docs / References (1), src/app / api (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/meta/data-deletion/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `client_agent_messages`
- Kinds: table
- Defined in migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `client_agent_threads`
- Kinds: table
- Defined in migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
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
- Mentioned by groups: src/app / admin (3), src/lib (2), Docs / References (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent runtime files: none
- Tests: src/app/admin/clients/data.test.ts
- Docs: docs/references/database-safety-runbook.md
- Other mentions: src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts

## `client_member_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `client_members`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Mentioned by groups: src/app / admin (4), Root Files (2), Docs / Plans (2), src/app / api (2), src/features / client-portal (2), src/lib (2), Docs / Context (1), Docs / References (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts
- Agent runtime files: none
- Tests: src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts
- Docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts

## `client_services`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306173000_client_services_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `clients`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql, supabase/migrations/20260427001000_retire_events_reports_surfaces.sql
- Mentioned by groups: Docs / Plans (19), src/components / admin (19), src/app / admin (15), Root Files (6), src/app / api (5), src/features / client-portal (4), Docs / Context (3), src/lib (3), Tests / Features (2), Docs / References (1), src/app / root routes (1), src/features / access (1), … (+2 more)
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts
- Features: src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts
- Shared libs: src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Agent runtime files: none
- Tests: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, … (+1 more)
- Docs: docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, … (+13 more)
- Other mentions: AGENTS.md, README.md, audit/architecture-smells.md, audit/dead-routes.md, e2e/authenticated-smoke.spec.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/admin/campaigns/data.ts, … (+20 more)

## `compliance_logs`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `contact_submissions`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306190000_contact_submissions_rls.sql
- Mentioned by groups: Docs / Plans (2), src/app / api (2), Docs / References (1), src/lib (1)
- Routes: src/app/api/contact/route.ts
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: src/app/api/contact/route.test.ts
- Docs: docs/plans/2026-03-03-landing-page-design.md, docs/plans/2026-03-03-landing-page-plan.md, docs/references/database-safety-runbook.md
- Other mentions: none

## `conversation_checkpoints`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `crm_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306100100_crm_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `crm_contacts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306090000_crm_contacts.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `crm_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306093000_crm_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `current_clerk_user_id`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `effective_campaign_client_slug`
- Kinds: function
- Defined in migrations: supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `email_drafts`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `email_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `email_reply_examples`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `event_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306110000_event_comments.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `event_follow_up_items`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `event_snapshots`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218120000_snapshot_tables.sql, supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: none
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

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
- Defined in migrations: supabase/migrations/20260307133000_growth_publish_attempts.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
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

## `if`
- Kinds: table
- Defined in migrations: supabase/migrations/20260428002000_remove_ticketing_artifacts.sql
- Mentioned by groups: Docs / Plans (22), src/components / admin (22), src/lib (19), src/app / admin (16), src/app / api (14), src/components / client (11), src/app / client (9), src/features / client-portal (7), Root Files (5), Docs / Context (4), src/app / root routes (4), src / scripts (4), … (+16 more)
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/layout.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, … (+12 more)
- Features: src/features/access/revalidation.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.ts, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.ts, … (+6 more)
- Shared libs: src/lib/api-helpers.test.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/env.ts, src/lib/export-csv.ts, src/lib/formatters.tsx, … (+9 more)
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts
- Docs: docs/context/codex-workflow.md, docs/context/google-ads-api.md, docs/context/meta-ads-playbook.md, docs/context/shopify-merch-sync.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, … (+17 more)
- Other mentions: .github/workflows/codex-pr-review.yml, .github/workflows/db-drift.yml, .github/workflows/e2e-smoke.yml, AGENTS.md, audit/architecture-smells.md, audit/dead-routes.md, audit/imports-deps.md, e2e/authenticated-smoke.spec.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, … (+56 more)

## `internal_dnc`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `is_current_client_member`
- Kinds: function
- Defined in migrations: supabase/migrations/20260307143000_client_member_roster_rls.sql
- Mentioned by groups: src/lib (1)
- Routes: none
- Features: none
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: none

## `leads`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Mentioned by groups: Root Files (1), Docs / Plans (1), src/app / root routes (1), src/components / landing (1), src/features / client-portal (1)
- Routes: src/app/landing/page.tsx
- Features: src/features/client-portal/insights.ts
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-07-discord-growth-team-plan.md
- Other mentions: audit/architecture-smells.md, src/components/landing/faq.tsx

## `meta_campaigns`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Mentioned by groups: Docs / Plans (10), src/app / admin (6), src/lib (4), Tests / API (1), Tests / App (1), Docs / References (1), src/app / api (1), src/app / client (1)
- Routes: none
- Features: none
- Shared libs: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Agent runtime files: none
- Tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md, … (+1 more)
- Other mentions: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

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
- Mentioned by groups: Root Files (3), Docs / Plans (2), src/app / root routes (1)
- Routes: src/app/privacy/page.tsx
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md
- Other mentions: audit/agent-dead-code.md, audit/architecture-smells.md, audit/dead-routes.md

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
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
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
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `system_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Mentioned by groups: Docs / Context (5), Root Files (2), src/app / admin (2), Tests / Features (1), Docs / Plans (1), Docs / References (1), src/app / root routes (1), src/features / root files (1), src/features / system-events (1), src/lib (1), supabase / root (1)
- Routes: none
- Features: src/features/AGENTS.md, src/features/system-events/server.ts
- Shared libs: src/lib/database.types.ts
- Agent runtime files: none
- Tests: __tests__/features/system-events/list.test.ts
- Docs: docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/references/database-safety-runbook.md
- Other mentions: AGENTS.md, audit/architecture-smells.md, src/app/AGENTS.md, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, supabase/AGENTS.md

## `tm_event_daily`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `tm_event_demographics`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Mentioned by groups: Docs / Plans (2)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md
- Other mentions: none

## `tm_events`
- Kinds: table
- Defined in migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Mentioned by groups: Docs / Plans (6)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md
- Other mentions: none

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

## `workspace_comments`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `workspace_pages`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md

## `workspace_tasks`
- Kinds: table
- Defined in migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Mentioned by groups: Root Files (1)
- Routes: none
- Features: none
- Shared libs: none
- Agent runtime files: none
- Tests: none
- Docs: none
- Other mentions: audit/architecture-smells.md
