# Workflow and Event Map

Generated from the current working tree on 2026-04-10 22:25:15.

This page focuses on workflow/event-bearing database objects and the code files that appear to orchestrate or consume them.

- Workflow DB objects: 19
- Workflow-related code files: 48

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
- Routes: src/app/api/alerts/route.ts
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: __tests__/api/alerts.test.ts, docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `agent_jobs`
- Kinds: table
- Migrations: supabase/migrations/20260218000000_initial_schema.sql
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
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
- Routes: src/app/api/agents/heartbeat/route.ts
- Features/libs/agents: agent/src/services/runtime-state-service.test.ts, agent/src/services/runtime-state-service.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Tests/docs: __tests__/api/agents-heartbeat.test.ts, docs/context/agent-patterns.md

### `agent_tasks`
- Kinds: table
- Migrations: supabase/migrations/20260302000000_agent_tasks.sql, supabase/migrations/20260306223000_agent_tasks_visibility_rls.sql
- Routes: src/app/api/agents/route.ts
- Features/libs/agents: agent/src/services/queue-service.ts, src/features/agent-outcomes/server.ts, src/lib/agent-dispatch.ts, src/lib/agent-jobs.ts, src/lib/database.types.ts
- Tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, docs/superpowers/plans/2026-04-03-enterprise-readiness.md, docs/superpowers/specs/2026-04-03-enterprise-readiness-design.md

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
- Features/libs/agents: src/features/conversations/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts

### `asset_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306103000_asset_follow_up_items.sql, supabase/migrations/20260306213000_client_shared_workflow_rls.sql
- Routes: none
- Features/libs/agents: src/features/agent-outcomes/server.ts, src/features/asset-follow-up-items/server.ts, src/features/conversations/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts

### `campaign_action_items`
- Kinds: table
- Migrations: supabase/migrations/20260305004000_campaign_action_items.sql, supabase/migrations/20260306050000_campaign_action_item_sources.sql, supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306233000_campaign_effective_owner_rls.sql
- Routes: none
- Features/libs/agents: src/features/agent-outcomes/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/clients/data.test.ts

### `campaign_comments`
- Kinds: table
- Migrations: supabase/migrations/20260306070000_campaign_comments.sql, supabase/migrations/20260306230000_campaign_comments_membership_rls.sql
- Routes: src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts
- Features/libs/agents: src/features/campaign-comments/server.ts, src/features/conversations/server.ts, src/features/dashboard/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/notifications/server.test.ts, src/app/admin/clients/data.test.ts, src/app/api/campaign-comments/route.test.ts

### `event_follow_up_items`
- Kinds: table
- Migrations: supabase/migrations/20260306111000_event_follow_up_items.sql, supabase/migrations/20260306170500_event_workflow_rls.sql
- Routes: none
- Features/libs/agents: src/features/agent-outcomes/server.ts, src/features/conversations/server.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts

## Client agent conversation workflow

### `client_agent_messages`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Routes: none
- Features/libs/agents: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/lib/database.types.ts
- Tests/docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md

### `client_agent_threads`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Routes: none
- Features/libs/agents: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/lib/database.types.ts
- Tests/docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md

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
- Tests/docs: docs/context/current-priorities.md, docs/plans/2026-03-03-admin-activity-tracking-design.md, docs/plans/2026-03-03-admin-activity-tracking-plan.md

### `approval_requests`
- Kinds: table
- Migrations: supabase/migrations/20260305002000_approval_requests.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: src/features/AGENTS.md, src/features/approvals/server.ts, src/features/notifications/server.ts
- Tests/docs: __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/notifications/server.test.ts, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, src/app/admin/clients/data.test.ts

### `notifications`
- Kinds: table
- Migrations: supabase/migrations/20260306111500_notification_entities.sql, supabase/migrations/20260306163500_client_surface_rls.sql
- Routes: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/privacy/page.tsx
- Features/libs/agents: agent/src/discord/core/entry.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/campaigns/ownership-sync.test.ts, src/features/event-follow-up-items/server.ts, src/features/notifications/server.ts, src/features/workflow/revalidation.test.ts, src/lib/database.types.ts
- Tests/docs: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, docs/context/architecture-reset.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/context/salvage-map.md, docs/plans/2026-03-02-meta-oauth-integration-plan.md, docs/plans/2026-03-27-shell-reset-implementation-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, … (+6 more)

### `system_events`
- Kinds: table
- Migrations: supabase/migrations/20260305000000_system_events.sql, supabase/migrations/20260305001000_system_events_private_read.sql, supabase/migrations/20260306143000_system_events_envelope.sql, supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: agent/src/services/system-events-service.ts, src/features/AGENTS.md, src/features/agent-outcomes/server.ts, src/features/dashboard/server.ts, src/features/system-events/server.ts
- Tests/docs: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/system-events/list.test.ts, docs/context/agent-patterns.md, docs/context/architecture-reset.md, docs/context/codex-workflow.md, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-07-discord-growth-team-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, … (+2 more)

## Workflow-related code files

### `agent/LEARNINGS.md`
- Ownership: agent root/runtime metadata
- Related DB objects: tm_events, meta_campaigns, agent_jobs, campaign_snapshots, event_snapshots, agent_tasks, agent_runtime_state, clients, calls
- Route owners: none
- Related tests: none
- Contents summary: headings: Outlet Media Agent — Learning Journal \| YYYY-MM-DD HH:MM — Cycle #N \| 2026-02-18 — Cycles #0-3 Summary (Genesis & Setup) \| 2026-02-18 — Cycles #4-7 Summary (Discovery & Hardening) \| 2026-02-18 — Cycles #8-9 Summary (Monitoring + general.txt Audit) \| 2026-02-19 — Cycles #10-11 Summary (First Pacing + Infra Au…

### `agent/MEMORY.md`
- Ownership: agent root/runtime metadata
- Related DB objects: tm_events, meta_campaigns, campaign_snapshots, event_snapshots, agent_alerts, agent_tasks, agent_runtime_state, clients, tm_event_demographics, calls, leads
- Route owners: none
- Related tests: none
- Contents summary: headings: Outlet Media Agent — Shared Memory \| Who Is Jaime \| What Outlet Media Does \| Clients \| Infrastructure \| Campaign Strategy (from Arjona tour learnings)

### `agent/prompts/agent.txt`
- Ownership: agent prompt definition
- Related DB objects: tm_events, meta_campaigns, campaign_snapshots, event_snapshots, agent_tasks, system_events, clients
- Route owners: none
- Related tests: none
- Contents summary: text lines: You are the Outlet Media operations agent running on Jaime's Mac Mini. \| Outlet Media is a music promotion media buying company. Jaime is the founder. You are his autonomous operations assistant — you manage Meta ad campaigns, track events, handle email, schedule meetings, and report on business performanc…

### `agent/src/discord/core/entry.ts`
- Ownership: agent Discord adapter layer
- Related DB objects: notifications
- Route owners: none
- Related tests: agent/src/events/message-handler.test.ts
- Contents summary: exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient; internal imports: 9; package imports: 1

### `agent/src/services/queue-service.ts`
- Ownership: agent runtime service layer
- Related DB objects: agent_tasks, calls
- Route owners: none
- Related tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask; tests/describes: queued; started; completed; internal imports: 2; package imports: 2

### `agent/src/services/runtime-state-service.ts`
- Ownership: agent runtime service layer
- Related DB objects: agent_runtime_state
- Route owners: none
- Related tests: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat; package imports: 1

### `agent/src/services/system-events-service.ts`
- Ownership: agent runtime service layer
- Related DB objects: system_events
- Route owners: none
- Related tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Contents summary: exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted; internal imports: 2

### `src/app/AGENTS.md`
- Ownership: web root/shared route surface
- Related DB objects: system_events, approval_requests
- Route owners: none
- Related tests: none
- Contents summary: headings: App Routes

### `src/app/admin/actions/audit.ts`
- Ownership: web admin route surface
- Related DB objects: admin_activity
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaign-action-items.ts`
- Ownership: web admin route surface
- Related DB objects: campaign_action_items, notifications
- Route owners: none
- Related tests: src/app/admin/actions/campaign-action-items.test.ts
- Contents summary: exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem; tests/describes: campaign_action_item; internal imports: 10; package imports: 2

### `src/app/admin/actions/campaigns.ts`
- Ownership: web admin route surface
- Related DB objects: meta_campaigns, system_events, approval_requests, campaign_action_items, campaign_comments, notifications, clients, campaign_client_overrides
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 9; package imports: 3

### `src/app/admin/actions/clients.ts`
- Ownership: web admin route surface
- Related DB objects: tm_events, meta_campaigns, client_accounts, system_events, approval_requests, campaign_action_items, campaign_comments, email_events, email_reply_examples, crm_contacts, crm_follow_up_items, asset_comments, … (+14 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/admin/actions/event-follow-up-items.ts`
- Ownership: web admin route surface
- Related DB objects: none
- Route owners: none
- Related tests: none
- Contents summary: exports: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction; tests/describes: event_follow_up_item; internal imports: 6; package imports: 2

### `src/app/admin/actions/events.ts`
- Ownership: web admin route surface
- Related DB objects: tm_events, event_comments, event_follow_up_items
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Related tests: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets; tests/describes: event; internal imports: 5; package imports: 2

### `src/app/admin/clients/data.ts`
- Ownership: web admin route surface
- Related DB objects: tm_events, meta_campaigns, client_accounts, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, clients, client_members, client_member_campaigns, client_member_events, … (+1 more)
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: getClientSummaries, getClientDetail; internal imports: 7; package imports: 1

### `src/app/admin/dashboard/data.ts`
- Ownership: web admin route surface
- Related DB objects: tm_events, meta_campaigns, campaign_snapshots, event_snapshots, agent_tasks
- Route owners: src/app/admin/dashboard/page.tsx
- Related tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getData, TmEvent, MetaCampaign, AgentLastRun, DashboardData; internal imports: 6

### `src/app/api/admin/activity/route.ts`
- Ownership: web API route surface
- Related DB objects: admin_activity
- Route owners: none
- Related tests: none
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `src/app/api/agent-outcomes/action-item/route.ts`
- Ownership: web API route surface
- Related DB objects: none
- Route owners: none
- Related tests: none
- Contents summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

### `src/app/api/agents/heartbeat/route.ts`
- Ownership: web API route surface
- Related DB objects: agent_runtime_state
- Route owners: none
- Related tests: __tests__/api/agents-heartbeat.test.ts
- Contents summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

### `src/app/api/agents/route.ts`
- Ownership: web API route surface
- Related DB objects: agent_tasks
- Route owners: none
- Related tests: __tests__/api/agents.test.ts
- Contents summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

### `src/app/api/alerts/route.ts`
- Ownership: web API route surface
- Related DB objects: agent_alerts
- Route owners: none
- Related tests: __tests__/api/alerts.test.ts
- Contents summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

### `src/app/api/campaign-comments/action-item/route.ts`
- Ownership: web API route surface
- Related DB objects: campaign_comments
- Route owners: none
- Related tests: none
- Contents summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

### `src/app/api/campaign-comments/route.ts`
- Ownership: web API route surface
- Related DB objects: meta_campaigns, campaign_comments, notifications
- Route owners: none
- Related tests: src/app/api/campaign-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

### `src/app/api/event-comments/route.ts`
- Ownership: web API route surface
- Related DB objects: event_comments, notifications
- Route owners: none
- Related tests: src/app/api/event-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST, PATCH; exports: GET, POST, PATCH; internal imports: 11; package imports: 3

### `src/app/privacy/page.tsx`
- Ownership: web root/shared route surface
- Related DB objects: notifications
- Route owners: none
- Related tests: none
- Contents summary: Next.js page for `/privacy`; exports: PrivacyPage, metadata, default

### `src/features/AGENTS.md`
- Ownership: feature-layer root file
- Related DB objects: system_events, approval_requests
- Route owners: none
- Related tests: none
- Contents summary: headings: Feature Modules

### `src/features/access/revalidation.ts`
- Ownership: feature module: access
- Related DB objects: clients
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/agent-outcomes/server.ts`
- Ownership: feature module: agent-outcomes
- Related DB objects: agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+16 more)
- Contents summary: exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4

### `src/features/agent-outcomes/summary.ts`
- Ownership: feature module: agent-outcomes
- Related DB objects: none
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/agent-outcomes/server.test.ts, __tests__/features/agent-outcomes/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/operations-center/summary.test.ts, … (+19 more)
- Contents summary: exports: jsonToText, taskStatusToOutcomeStatus, buildAgentOutcomeView, AgentOutcomeStatus, AgentOutcomeVisibility, AgentOutcomeRequestRecord, AgentOutcomeTaskRecord, AgentOutcomeView; internal imports: 1

### `src/features/approvals/server.ts`
- Ownership: feature module: approvals
- Related DB objects: approval_requests
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+19 more)
- Contents summary: exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5

### `src/features/approvals/summary.ts`
- Ownership: feature module: approvals
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+19 more)
- Contents summary: exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2

### `src/features/asset-follow-up-items/server.ts`
- Ownership: feature module: asset-follow-up-items
- Related DB objects: asset_follow_up_items, notifications, ad_assets
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Related tests: none
- Contents summary: exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6

### `src/features/campaign-action-items/server.ts`
- Ownership: feature module: campaign-action-items
- Related DB objects: campaign_action_items, notifications
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7

### `src/features/campaign-comments/server.ts`
- Ownership: feature module: campaign-comments
- Related DB objects: campaign_comments
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1

### `src/features/client-agent/store.ts`
- Ownership: feature module: client-agent
- Related DB objects: client_agent_threads, client_agent_messages
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3

### `src/features/conversations/server.ts`
- Ownership: feature module: conversations
- Related DB objects: tm_events, meta_campaigns, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, ad_assets
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Contents summary: exports: matchesConversationKinds, listConversationThreads; internal imports: 5

### `src/features/dashboard/server.ts`
- Ownership: feature module: dashboard
- Related DB objects: tm_events, meta_campaigns, system_events, campaign_action_items, campaign_comments
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+12 more)
- Contents summary: exports: getDashboardOpsSummary, getDashboardActionCenter, DashboardActionCenterDiscussion, DashboardActionCenterApproval, DashboardActionCenter; internal imports: 6

### `src/features/event-follow-up-items/server.ts`
- Ownership: feature module: event-follow-up-items
- Related DB objects: tm_events, event_follow_up_items, notifications
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6

### `src/features/events/server.ts`
- Ownership: feature module: events
- Related DB objects: tm_events, meta_campaigns, event_comments, event_follow_up_items, clients
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Contents summary: exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 6

### `src/features/notifications/discussions.ts`
- Ownership: feature module: notifications
- Related DB objects: none
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Related tests: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Contents summary: exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput; internal imports: 1

### `src/features/notifications/server.ts`
- Ownership: feature module: notifications
- Related DB objects: approval_requests, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, notifications, clients, client_members, client_member_campaigns, client_member_events
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+5 more)
- Contents summary: exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1

### `src/features/notifications/types.ts`
- Ownership: feature module: notifications
- Related DB objects: none
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+5 more)
- Contents summary: exports: AppNotification, CreateNotificationInput

### `src/features/notifications/workflow.ts`
- Ownership: feature module: notifications
- Related DB objects: none
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, … (+1 more)
- Contents summary: exports: notifyWorkflowAssignee; internal imports: 1

### `src/features/system-events/server.ts`
- Ownership: feature module: system-events
- Related DB objects: system_events
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+7 more)
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, … (+27 more)
- Contents summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName; internal imports: 1; package imports: 1

### `src/features/workflow/revalidation.ts`
- Ownership: feature module: workflow
- Related DB objects: none
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, … (+2 more)
- Related tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+4 more)
- Contents summary: exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath; package imports: 1

### `src/lib/agent-dispatch.ts`
- Ownership: shared web library
- Related DB objects: agent_tasks
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+2 more)
- Contents summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1

### `src/lib/agent-jobs.ts`
- Ownership: shared web library
- Related DB objects: agent_tasks, agent_runtime_state
- Route owners: src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/admin/agents/page.tsx, src/app/admin/dashboard/page.tsx
- Related tests: __tests__/api/agents-jobs.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/api/agents.test.ts, __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx
- Contents summary: exports: mapTaskToJob, listAgentJobs, getAgentJob, getLatestAgentStatuses, getHeartbeatStatus, AgentJobView; internal imports: 2

### `src/lib/database.types.ts`
- Ownership: shared web library
- Related DB objects: tm_events, meta_campaigns, agent_jobs, campaign_snapshots, event_snapshots, agent_alerts, agent_tasks, client_accounts, agent_runtime_state, email_events, email_drafts, email_reply_examples, … (+22 more)
- Route owners: none
- Related tests: none
- Contents summary: exports: Constants, Json, Database, Tables, Enums, CompositeTypes
