# Supabase Schema Map

Generated from the current working tree on 2026-04-28 02:57:59.

This page groups migration-discovered database objects by schema kind and records which migrations define them plus how many code/docs references exist outside the migrations.

- Database objects tracked: 83

## Tables
- Objects: 61

### `ad_assets`
- Kinds: table
- Migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `admin_activity`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 9
- Referenced by groups: Docs / Plans (2), Root Files (1), Docs / Context (1), Docs / References (1), src/app / admin (1), src/app / api (1), src/lib (1), supabase / root (1)
- Routes: src/app/api/admin/activity/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/references/database-safety-runbook.md

### `admin_audit_log`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 3
- Referenced by groups: Docs / Plans (3)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-admin-activity-tracking-design.md

### `agent_alerts`
- Kinds: table
- Migrations: supabase/migrations/20260218140000_agent_alerts.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Non-migration references: 2
- Referenced by groups: Root Files (1), Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-02-project-restructure-plan.md

### `agent_runtime_state`
- Kinds: table
- Migrations: supabase/migrations/20260305010000_agent_runtime_state.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `agent_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Non-migration references: 3
- Referenced by groups: Docs / Plans (3)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md

### `application_errors`
- Kinds: table
- Migrations: supabase/migrations/20260428003000_create_application_errors.sql
- Non-migration references: 5
- Referenced by groups: src/app / api (2), Docs / References (1), src/app / admin (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/observability/client-error/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/api/observability/client-error/route.test.ts

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 1
- Referenced by groups: supabase / root (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `asset_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306100000_asset_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `asset_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `asset_sources`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `calls`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 13
- Referenced by groups: Docs / Plans (6), Root Files (3), src/app / client (2), Docs / Context (1), src/lib (1)
- Routes: none
- Features/libs/agents: src/lib/google-ads.test.ts
- Tests/docs: docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, src/app/client/[slug]/components/campaign-detail-header.test.tsx

### `campaign_action_items`
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `campaign_client_overrides`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Non-migration references: 8
- Referenced by groups: src/app / admin (3), src/lib (3), Root Files (1), Docs / References (1)
- Routes: none
- Features/libs/agents: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `campaign_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `campaign_snapshots`
- Kinds: table
- Migrations: supabase/migrations/20260218120000_snapshot_tables.sql
- Non-migration references: 9
- Referenced by groups: Docs / Plans (4), Tests / API (1), Docs / References (1), src/app / admin (1), src/app / api (1), src/lib (1)
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: __tests__/api/ingest.test.ts, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/references/database-safety-runbook.md

### `client_access_invites`
- Kinds: table
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Non-migration references: 8
- Referenced by groups: src/app / api (2), src/features / client-portal (2), Docs / References (1), src/app / admin (1), src/features / invitations (1), src/lib (1)
- Routes: src/app/api/admin/invite/route.ts
- Features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/lib/database.types.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/api/admin/invite/route.test.ts

### `client_accounts`
- Kinds: table
- Migrations: supabase/migrations/20260302000001_create_client_accounts.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 9
- Referenced by groups: src/app / admin (4), Docs / Plans (2), Docs / References (1), src/app / api (1), src/lib (1)
- Routes: src/app/admin/settings/page.tsx, src/app/api/meta/data-deletion/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: docs/plans/2026-03-02-meta-oauth-integration-design.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `client_agent_messages`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_agent_threads`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 6
- Referenced by groups: src/app / admin (3), src/lib (2), Docs / References (1)
- Routes: none
- Features/libs/agents: src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Non-migration references: 16
- Referenced by groups: src/app / admin (4), Root Files (2), Docs / Plans (2), src/app / api (2), src/features / client-portal (2), src/lib (2), Docs / Context (1), Docs / References (1)
- Routes: src/app/api/admin/users/[id]/route.ts
- Features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts

### `client_services`
- Kinds: table
- Migrations: supabase/migrations/20260306173000_client_services_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `clients`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql, supabase/migrations/20260427001000_retire_events_reports_surfaces.sql
- Non-migration references: 81
- Referenced by groups: Docs / Plans (19), src/components / admin (19), src/app / admin (15), Root Files (6), src/app / api (5), src/features / client-portal (4), Docs / Context (3), src/lib (3), Tests / Features (2), Docs / References (1), src/app / root routes (1), src/features / access (1), … (+2 more)
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/health/route.ts
- Features/libs/agents: src/features/access/revalidation.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/features/users/summary.ts, src/lib/database.types.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts
- Tests/docs: __tests__/features/access/revalidation.test.ts, __tests__/features/clients/summary.test.ts, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, … (+24 more)

### `compliance_logs`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `contact_submissions`
- Kinds: table
- Migrations: supabase/migrations/20260306190000_contact_submissions_rls.sql
- Non-migration references: 6
- Referenced by groups: Docs / Plans (2), src/app / api (2), Docs / References (1), src/lib (1)
- Routes: src/app/api/contact/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: docs/plans/2026-03-03-landing-page-design.md, docs/plans/2026-03-03-landing-page-plan.md, docs/references/database-safety-runbook.md, src/app/api/contact/route.test.ts

### `conversation_checkpoints`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `crm_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306100100_crm_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `crm_contacts`
- Kinds: table
- Migrations: supabase/migrations/20260306090000_crm_contacts.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `crm_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306093000_crm_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `email_drafts`
- Kinds: table
- Migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `email_events`
- Kinds: table
- Migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `email_reply_examples`
- Kinds: table
- Migrations: supabase/migrations/20260306070100_email_agent_intelligence.sql, supabase/migrations/20260306073000_lock_email_agent_tables.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `event_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306110000_event_comments.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `event_snapshots`
- Kinds: table
- Migrations: supabase/migrations/20260218120000_snapshot_tables.sql, supabase/migrations/20260306175500_event_analytics_rls.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_accounts`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_content_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_ideas`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_inbound_events`
- Kinds: table
- Migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_lanes`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_leads`
- Kinds: table
- Migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_playbooks`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_post_targets`
- Kinds: table
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 1
- Referenced by groups: Docs / Plans (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `growth_publish_attempts`
- Kinds: table
- Migrations: supabase/migrations/20260307133000_growth_publish_attempts.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `if`
- Kinds: table
- Migrations: supabase/migrations/20260428002000_remove_ticketing_artifacts.sql
- Non-migration references: 158
- Referenced by groups: Docs / Plans (22), src/components / admin (22), src/lib (19), src/app / admin (16), src/app / api (14), src/components / client (11), src/app / client (9), src/features / client-portal (7), Root Files (5), Docs / Context (4), src/app / root routes (4), src / scripts (4), … (+16 more)
- Routes: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/layout.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, … (+14 more)
- Features/libs/agents: src/features/access/revalidation.ts, src/features/campaigns/revalidation.ts, src/features/campaigns/server.ts, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/scope.ts, src/features/client-portal/theme.ts, … (+25 more)
- Tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, docs/context/codex-workflow.md, docs/context/google-ads-api.md, docs/context/meta-ads-playbook.md, docs/context/shopify-merch-sync.md, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, … (+25 more)

### `internal_dnc`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `leads`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 5
- Referenced by groups: Root Files (1), Docs / Plans (1), src/app / root routes (1), src/components / landing (1), src/features / client-portal (1)
- Routes: src/app/landing/page.tsx
- Features/libs/agents: src/features/client-portal/insights.ts
- Tests/docs: docs/plans/2026-03-07-discord-growth-team-plan.md

### `meta_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218130000_start_time.sql, supabase/migrations/20260304000000_campaign_type.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Non-migration references: 25
- Referenced by groups: Docs / Plans (10), src/app / admin (6), src/lib (4), Tests / API (1), Tests / App (1), Docs / References (1), src/app / api (1), src/app / client (1)
- Routes: none
- Features/libs/agents: src/lib/campaign-client-assignment.test.ts, src/lib/campaign-client-assignment.ts, src/lib/database.types.ts, src/lib/meta-campaigns.ts
- Tests/docs: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-03-campaign-client-assignment-design.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, … (+4 more)

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 6
- Referenced by groups: Root Files (3), Docs / Plans (2), src/app / root routes (1)
- Routes: src/app/privacy/page.tsx
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md

### `recordings`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `scheduled_callbacks`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Non-migration references: 17
- Referenced by groups: Docs / Context (5), Root Files (2), src/app / admin (2), Tests / Features (1), Docs / Plans (1), Docs / References (1), src/app / root routes (1), src/features / root files (1), src/features / system-events (1), src/lib (1), supabase / root (1)
- Routes: none
- Features/libs/agents: src/features/AGENTS.md, src/features/system-events/server.ts, src/lib/database.types.ts
- Tests/docs: __tests__/features/system-events/list.test.ts, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/references/database-safety-runbook.md

### `tm_event_daily`
- Kinds: table
- Migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `tm_event_demographics`
- Kinds: table
- Migrations: supabase/migrations/20260306175500_event_analytics_rls.sql
- Non-migration references: 2
- Referenced by groups: Docs / Plans (2)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md

### `tm_events`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260218150000_tm_events_client_slug.sql, supabase/migrations/20260306214500_client_campaign_event_rls.sql
- Non-migration references: 6
- Referenced by groups: Docs / Plans (6)
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-02-23-client-portal-redesign-plan.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/plans/2026-03-04-admin-must-have-upgrades.md

### `workspace_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `workspace_pages`
- Kinds: table
- Migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `workspace_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260306163500_client_surface_rls.sql
- Non-migration references: 1
- Referenced by groups: Root Files (1)
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

## Views
- Objects: 0

## Functions
- Objects: 8

### `acquire_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `current_clerk_user_id`
- Kinds: function
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql
- Non-migration references: 1
- Referenced by groups: src/lib (1)
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: none

### `effective_campaign_client_slug`
- Kinds: function
- Migrations: supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Non-migration references: 1
- Referenced by groups: src/lib (1)
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: none

### `handle_updated_at`
- Kinds: function
- Migrations: supabase/migrations/20260218000000_initial_schema.sql, supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `is_current_client_member`
- Kinds: function
- Migrations: supabase/migrations/20260307143000_client_member_roster_rls.sql
- Non-migration references: 1
- Referenced by groups: src/lib (1)
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: none

### `pf_update_updated_at`
- Kinds: function
- Migrations: supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `release_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `update_updated_at_column`
- Kinds: function
- Migrations: supabase/migrations/20260306155500_updated_at_function_search_paths.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

## Triggers
- Objects: 14

### `agent_jobs_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_access_invites_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_agent_threads_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_accounts_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_content_jobs_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_ideas_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_inbound_events_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_lanes_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_leads_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307124500_growth_lead_ops.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_playbooks_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_post_targets_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307120000_growth_ledgers.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `growth_publish_attempts_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260307133000_growth_publish_attempts.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `meta_campaigns_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `tm_events_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Non-migration references: 0
- Referenced by groups: none
- Routes: none
- Features/libs/agents: none
- Tests/docs: none
