# Workflow and Event Map

Generated from the current working tree on 2026-04-28 02:57:59.

This page focuses on workflow/event-bearing database objects and the code files that appear to orchestrate or consume them.

- Workflow DB objects: 19
- Workflow-related code files: 11

## Agent runtime workflow

### `acquire_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `agent_alerts`
- Kinds: table
- Migrations: supabase/migrations/20260218140000_agent_alerts.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-02-project-restructure-plan.md

### `agent_jobs_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `agent_runtime_state`
- Kinds: table
- Migrations: supabase/migrations/20260305010000_agent_runtime_state.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `agent_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md

### `release_runtime_lease`
- Kinds: function
- Migrations: supabase/migrations/20260306034500_runtime_leases.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

## Campaign / event / asset workflow

### `asset_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306100000_asset_comments.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `asset_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `campaign_action_items`
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `campaign_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

## Client agent conversation workflow

### `client_agent_messages`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_agent_threads`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_agent_threads_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

## Shared timeline / approvals / notifications

### `admin_activity`
- Kinds: table
- Migrations: supabase/migrations/20260306181500_internal_tables_rls.sql
- Routes: src/app/api/admin/activity/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md, docs/references/database-safety-runbook.md

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Routes: src/app/privacy/page.tsx
- Features/libs/agents: none
- Tests/docs: docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260427000000_remove_agent_artifacts.sql
- Routes: none
- Features/libs/agents: src/features/AGENTS.md, src/features/system-events/server.ts, src/lib/database.types.ts
- Tests/docs: __tests__/features/system-events/list.test.ts, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/product-direction.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/references/database-safety-runbook.md

## Workflow-related code files

### `src/app/AGENTS.md`
- Ownership: web root/shared route surface
- Related DB objects: system_events
- Route owners: none
- Related tests: none
- Contents summary: headings: App Routes

### `src/app/admin/actions/audit.ts`
- Ownership: web admin route surface
- Related DB objects: admin_activity, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaigns.ts`
- Ownership: web admin route surface
- Related DB objects: meta_campaigns, system_events, clients, campaign_client_overrides, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 8; package imports: 3

### `src/app/admin/actions/clients.ts`
- Ownership: web admin route surface
- Related DB objects: meta_campaigns, client_accounts, system_events, clients, client_members, client_member_campaigns, campaign_client_overrides, if
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/api/admin/activity/route.ts`
- Ownership: web API route surface
- Related DB objects: admin_activity, if
- Route owners: none
- Related tests: none
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `src/app/privacy/page.tsx`
- Ownership: web root/shared route surface
- Related DB objects: notifications
- Route owners: none
- Related tests: none
- Contents summary: Next.js page for `/privacy`; exports: PrivacyPage, metadata, default

### `src/features/AGENTS.md`
- Ownership: feature-layer root file
- Related DB objects: system_events
- Route owners: none
- Related tests: none
- Contents summary: headings: Feature Modules

### `src/features/access/revalidation.ts`
- Ownership: feature module: access
- Related DB objects: clients, if
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/campaigns/revalidation.ts`
- Ownership: feature module: campaigns
- Related DB objects: if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCampaignRevalidationPaths, revalidateCampaignPaths; package imports: 1

### `src/features/system-events/server.ts`
- Ownership: feature module: system-events
- Related DB objects: system_events, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1

### `src/lib/database.types.ts`
- Ownership: shared web library
- Related DB objects: meta_campaigns, campaign_snapshots, client_accounts, system_events, clients, client_members, client_member_campaigns, current_clerk_user_id, admin_activity, campaign_client_overrides, contact_submissions, effective_campaign_client_slug, … (+3 more)
- Route owners: none
- Related tests: none
- Contents summary: exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes
