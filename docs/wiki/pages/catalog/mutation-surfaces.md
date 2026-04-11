# Mutation Surface Map

Generated from the current working tree on 2026-04-10 22:25:15.

This page focuses on obvious state-changing surfaces: API mutation routes, admin actions, and exported mutation-oriented helpers/runtime files.

## API mutation routes

### `/api/admin/activity`
- File: `src/app/api/admin/activity/route.ts`
- Methods: POST
- Validation symbols: ActivitySchema
- DB objects touched: admin_activity
- Related tests: none
- Summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `/api/admin/invite`
- File: `src/app/api/admin/invite/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: clients, client_access_invites
- Related tests: src/app/api/admin/invite/route.test.ts
- Summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `/api/admin/users/[id]`
- File: `src/app/api/admin/users/[id]/route.ts`
- Methods: PATCH
- Validation symbols: UpdateUserSchema
- DB objects touched: clients, client_members
- Related tests: none
- Summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

### `/api/agent-outcomes/action-item`
- File: `src/app/api/agent-outcomes/action-item/route.ts`
- Methods: POST
- Validation symbols: parsed
- DB objects touched: none
- Related tests: none
- Summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

### `/api/agents`
- File: `src/app/api/agents/route.ts`
- Methods: POST, GET
- Validation symbols: parsed
- DB objects touched: agent_tasks
- Related tests: __tests__/api/agents.test.ts
- Summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

### `/api/agents/email/watch`
- File: `src/app/api/agents/email/watch/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: none
- Related tests: none
- Summary: Next.js route handler for `/api/agents/email/watch`; route handlers: POST; exports: POST; package imports: 1

### `/api/agents/heartbeat`
- File: `src/app/api/agents/heartbeat/route.ts`
- Methods: POST
- Validation symbols: parsed
- DB objects touched: agent_runtime_state
- Related tests: __tests__/api/agents-heartbeat.test.ts
- Summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

### `/api/alerts`
- File: `src/app/api/alerts/route.ts`
- Methods: POST, PATCH, GET
- Validation symbols: none
- DB objects touched: agent_alerts
- Related tests: __tests__/api/alerts.test.ts
- Summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

### `/api/campaign-comments`
- File: `src/app/api/campaign-comments/route.ts`
- Methods: GET, POST, PATCH, DELETE
- Validation symbols: none
- DB objects touched: meta_campaigns, campaign_comments, notifications
- Related tests: src/app/api/campaign-comments/route.test.ts
- Summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

### `/api/campaign-comments/action-item`
- File: `src/app/api/campaign-comments/action-item/route.ts`
- Methods: POST
- Validation symbols: parsed
- DB objects touched: campaign_comments
- Related tests: none
- Summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

### `/api/client/[slug]/agent/threads`
- File: `src/app/api/client/[slug]/agent/threads/route.ts`
- Methods: GET, POST
- Validation symbols: none
- DB objects touched: none
- Related tests: src/app/api/client/[slug]/agent/threads/route.test.ts
- Summary: Next.js route handler for `/api/client/[slug]/agent/threads`; route handlers: GET, POST; exports: GET, POST; internal imports: 1; package imports: 1

### `/api/client/[slug]/agent/threads/[threadId]/messages`
- File: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Methods: POST
- Validation symbols: SendMessageSchema, parsed
- DB objects touched: none
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]/messages`; route handlers: POST; exports: POST; internal imports: 4; package imports: 2

### `/api/contact`
- File: `src/app/api/contact/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: contact_submissions
- Related tests: none
- Summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `/api/event-comments`
- File: `src/app/api/event-comments/route.ts`
- Methods: GET, POST, PATCH
- Validation symbols: CreateScopedEventCommentSchema
- DB objects touched: event_comments, notifications
- Related tests: src/app/api/event-comments/route.test.ts
- Summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST, PATCH; exports: GET, POST, PATCH; internal imports: 11; package imports: 3

### `/api/ingest`
- File: `src/app/api/ingest/route.ts`
- Methods: POST, GET
- Validation symbols: none
- DB objects touched: none
- Related tests: __tests__/api/ingest.test.ts
- Summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 6; package imports: 1

### `/api/meta/data-deletion`
- File: `src/app/api/meta/data-deletion/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: client_accounts
- Related tests: src/app/api/meta/data-deletion/route.test.ts
- Summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `/api/ticketmaster/tm1/move-selection`
- File: `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Methods: POST
- Validation symbols: StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, SuccessActionSchema, MoveTargetSchema, BodySchema, … (+1 more)
- DB objects touched: none
- Related tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Summary: Next.js route handler for `/api/ticketmaster/tm1/move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `/api/ticketmaster/tm1/request-move-selection`
- File: `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Methods: POST
- Validation symbols: StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, AllocationTargetSchema, ResolutionStatusSchema, BodySchema, … (+1 more)
- DB objects touched: none
- Related tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Summary: Next.js route handler for `/api/ticketmaster/tm1/request-move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

### `/api/user/profile`
- File: `src/app/api/user/profile/route.ts`
- Methods: POST
- Validation symbols: ProfileSchema, parsed
- DB objects touched: none
- Related tests: none
- Summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3

## Admin actions

### `src/app/admin/actions/audit.ts`
- Mutation symbols: logActivity, logAudit
- DB objects touched: admin_activity
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaign-action-items.ts`
- Mutation symbols: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem, CreateCampaignActionItemSchema, UpdateCampaignActionItemSchema, createdItem, changedKeys, changedFields, updatedItem
- DB objects touched: campaign_action_items, notifications
- Route owners: none
- Related tests: src/app/admin/actions/campaign-action-items.test.ts
- Summary: exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem; tests/describes: campaign_action_item; internal imports: 10; package imports: 2

### `src/app/admin/actions/campaigns.ts`
- Mutation symbols: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta, upsertCampaignClientOverrides, syncCampaignLinkedClientSlug, updateResults, UpdateStatusSchema, UpdateTypeSchema, UpdateBudgetSchema, AssignClientSchema, BulkAssignSchema
- DB objects touched: meta_campaigns, system_events, approval_requests, campaign_action_items, campaign_comments, notifications, clients, campaign_client_overrides
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 9; package imports: 3

### `src/app/admin/actions/clients.ts`
- Mutation symbols: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns, updateMemberEvents, renameClientSlugReferences, RenameClientSchema, DeactivateClientSchema, BulkDeactivateClientsSchema
- DB objects touched: tm_events, meta_campaigns, client_accounts, system_events, approval_requests, campaign_action_items, campaign_comments, email_events, email_reply_examples, crm_contacts, crm_follow_up_items, asset_comments, … (+14 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/admin/actions/event-follow-up-items.ts`
- Mutation symbols: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction, CreateEventFollowUpItemSchema, UpdateEventFollowUpItemSchema
- DB objects touched: none
- Route owners: none
- Related tests: none
- Summary: exports: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction; tests/describes: event_follow_up_item; internal imports: 6; package imports: 2

### `src/app/admin/actions/events.ts`
- Mutation symbols: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets, syncEventWorkflowClientSlug, UpdateEventStatusSchema, AssignEventClientSchema, UpdateTicketsSchema, BulkAssignEventClientSchema, BulkUpdateEventStatusSchema
- DB objects touched: tm_events, event_comments, event_follow_up_items
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Related tests: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets; tests/describes: event; internal imports: 5; package imports: 2

### `src/app/admin/actions/meta-sync.ts`
- Mutation symbols: syncCampaignStatus, syncCampaignBudget
- DB objects touched: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: syncCampaignStatus, syncCampaignBudget; internal imports: 1

### `src/app/admin/actions/users.ts`
- Mutation symbols: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation, ChangeRoleSchema, BulkUpdateRoleSchema, failed, DeleteUserSchema, RevokeInvitationSchema
- DB objects touched: clients, client_access_invites
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

## Other mutation-oriented files

### `agent/src/discord/core/entry.ts`
- Mutation symbols: startDiscordBot, stopDiscordRuntimeState
- DB objects touched: notifications
- Route owners: none
- Related tests: agent/src/events/message-handler.test.ts
- Summary: exports: checkAndReleaseStaleLock, markChannelLockAcquired, markChannelLockHeartbeat, markChannelLockReleased, startDiscordBot, stopDiscordRuntimeState, notifyChannel, discordClient; internal imports: 9; package imports: 1

### `agent/src/services/queue-service.ts`
- Mutation symbols: stopPersistedTaskPoller, enqueueTask, completeTask, failTask, approveTask, rejectTask, deferTask, startPersistedTaskPoller, startTask
- DB objects touched: agent_tasks, calls
- Route owners: none
- Related tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Summary: exports: setTaskExecutor, stopPersistedTaskPoller, pollPersistedTasksNow, initQueue, enqueueTask, completeTask, failTask, escalateTask; tests/describes: queued; started; completed; internal imports: 2; package imports: 2

### `agent/src/services/runtime-state-service.ts`
- Mutation symbols: startRuntimeHeartbeat, stopRuntimeHeartbeat
- DB objects touched: agent_runtime_state
- Route owners: none
- Related tests: agent/src/services/runtime-state-service.test.ts, agent/src/events/message-handler.test.ts
- Summary: exports: writeRuntimeHeartbeat, startRuntimeHeartbeat, stopRuntimeHeartbeat; package imports: 1

### `agent/src/services/system-events-service.ts`
- Mutation symbols: logAgentSystemEvent, logDiscordAgentTurn, LogDiscordAgentTurnInput, startedAt
- DB objects touched: system_events
- Route owners: none
- Related tests: agent/src/services/queue-service.test.ts, agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Summary: exports: logAgentSystemEvent, safeLogAgentSystemEvent, listAgentSystemEvents, listRecentAgentActivity, formatAgentActivityLine, buildAgentActivityDigest, safeLogAgentTaskRequested, safeLogAgentTaskStarted; internal imports: 2

### `agent/src/services/web-task-executor.ts`
- Mutation symbols: createWebTaskExecutor
- DB objects touched: none
- Route owners: none
- Related tests: agent/src/services/web-task-executor.test.ts, agent/src/events/message-handler.test.ts
- Summary: exports: executeWebTask, createWebTaskExecutor; internal imports: 2

### `agent/src/services/webhook-service.ts`
- Mutation symbols: sendAsAgent, created
- DB objects touched: none
- Route owners: none
- Related tests: agent/src/events/message-handler.test.ts
- Summary: exports: initWebhooks, sendAsAgent; internal imports: 1; package imports: 1

### `src/features/agent-outcomes/server.ts`
- Mutation symbols: requestAssetId, requestCampaignId, requestEventId
- DB objects touched: agent_tasks, system_events, campaign_action_items, asset_follow_up_items, event_follow_up_items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/components/admin/agents/job-history.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+16 more)
- Summary: exports: matchesContext, listAgentOutcomes, getAgentOutcomeContext, AgentOutcomeContext; internal imports: 4

### `src/features/agents/summary.ts`
- Mutation symbols: failedRecent
- DB objects touched: none
- Route owners: src/app/admin/agents/page.tsx
- Related tests: __tests__/features/agents/summary.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: buildAgentCommandSummary, AgentCommandMetric, AgentCommandOutcomeBucket, AgentCommandSummary; internal imports: 3

### `src/features/approvals/server.ts`
- Mutation symbols: requestedLimit
- DB objects touched: approval_requests
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+19 more)
- Summary: exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5

### `src/features/asset-follow-up-items/server.ts`
- Mutation symbols: createSystemAssetFollowUpItem, CreateSystemAssetFollowUpItemInput
- DB objects touched: asset_follow_up_items, notifications, ad_assets
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Related tests: none
- Summary: exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6

### `src/features/campaign-action-items/server.ts`
- Mutation symbols: createSystemCampaignActionItem, updateSystemCampaignActionItem, changedKeys, updated, changedFields, CreateSystemCampaignActionItemInput, UpdateSystemCampaignActionItemInput
- DB objects touched: campaign_action_items, notifications
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7

### `src/features/client-agent/components/agent-shell.tsx`
- Mutation symbols: createThreadAndSelect, createdAt, SendMessagePayload
- DB objects touched: none
- Route owners: src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/components/agent-shell.test.tsx, src/app/client/[slug]/agent/page.test.tsx
- Summary: contains `use client`; exports: AgentShell, AgentThreadSummary, AgentThreadMessage; internal imports: 4; package imports: 1

### `src/features/client-agent/range.ts`
- Mutation symbols: addDays, startOfWeek, startOfMonth, startOfQuarter
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/range.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: normalizeRange, resolveRangeFromMessage; tests/describes: -; internal imports: 1

### `src/features/client-agent/server.ts`
- Mutation symbols: createThread, sendMessage, SendMessageBody
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Summary: exports: listThreads, createThread, getThread, sendMessage; internal imports: 9

### `src/features/client-agent/store.ts`
- Mutation symbols: createThread, appendUserMessage, appendAssistantMessage
- DB objects touched: client_agent_threads, client_agent_messages
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3

### `src/features/client-agent/tools/breakdowns.ts`
- Mutation symbols: requestedIds, request
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: getDemographicBreakdown, getGeographyBreakdown, getPlacementBreakdown; internal imports: 4

### `src/features/client-agent/tools/compare-timeseries.ts`
- Mutation symbols: startOfWeek, request
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: compareEntities, getTimeseries; internal imports: 4

### `src/features/client-agent/tools/details.ts`
- Mutation symbols: request, requestedIds
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/details.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: getCampaignDetails, getEventDetails, getCreativeDetails; internal imports: 4

### `src/features/client-agent/tools/overview.ts`
- Mutation symbols: request
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/overview.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: getAdsOverview, getEventsOverview; internal imports: 4

### `src/features/client-agent/tools/search.ts`
- Mutation symbols: request
- DB objects touched: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Summary: exports: searchScope; internal imports: 5

### `src/features/client-portal/insights.ts`
- Mutation symbols: change
- DB objects touched: leads
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Related tests: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+17 more)
- Summary: exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4

### `src/features/client-portal/theme.ts`
- Mutation symbols: createTheme
- DB objects touched: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Related tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Summary: exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1

### `src/features/event-follow-up-items/server.ts`
- Mutation symbols: createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, changedKeys, changedFields, CreateSystemEventFollowUpItemInput, UpdateSystemEventFollowUpItemInput
- DB objects touched: tm_events, event_follow_up_items, notifications
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: listEventFollowUpItems, findEventFollowUpItemBySource, getEventFollowUpItemById, maybeEnqueueEventFollowUpItemTriage, createSystemEventFollowUpItem, updateSystemEventFollowUpItem, deleteEventFollowUpItem, EventFollowUpItemVisibility; internal imports: 6

### `src/features/notifications/server.ts`
- Mutation symbols: createNotification, requestedLimit, assignedRows
- DB objects touched: approval_requests, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, notifications, clients, client_members, client_member_campaigns, client_member_events
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+5 more)
- Summary: exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1

### `src/features/notifications/types.ts`
- Mutation symbols: CreateNotificationInput
- DB objects touched: none
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+5 more)
- Summary: exports: AppNotification, CreateNotificationInput

### `src/features/system-events/server.ts`
- Mutation symbols: logSystemEvent, LogSystemEventInput
- DB objects touched: system_events
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+7 more)
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, … (+27 more)
- Summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName; internal imports: 1; package imports: 1

### `src/lib/agent-dispatch.ts`
- Mutation symbols: enqueueExternalAgentTask, EnqueueExternalAgentTaskInput
- DB objects touched: agent_tasks
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, … (+2 more)
- Summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1

### `src/lib/api-schemas.ts`
- Mutation symbols: CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, CreateCampaignCommentSchema, CreateAssetCommentSchema, CreateEventCommentSchema
- DB objects touched: none
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, src/app/api/event-comments/route.ts, src/app/api/ingest/route.ts, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, … (+1 more)
- Related tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, __tests__/api/agents-heartbeat.test.ts, __tests__/api/agents.test.ts, __tests__/api/alerts.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/api/ingest.test.ts, … (+1 more)
- Summary: exports: IngestPayloadSchema, AlertPostSchema, AlertPatchSchema, VALID_AGENTS, AgentPostSchema, InviteSchema, CreateClientSchema, UpdateClientSchema; package imports: 1

### `src/lib/google-ads.ts`
- Mutation symbols: loginCustomerId
- DB objects touched: none
- Route owners: none
- Related tests: src/lib/google-ads.test.ts
- Summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

### `src/lib/supabase.ts`
- Mutation symbols: createClerkSupabaseClient
- DB objects touched: none
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, … (+29 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+71 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/lib/ticketmaster/tm1-client.ts`
- Mutation symbols: createTm1ClientFromEnv, requestPath, requestId
- DB objects touched: none
- Route owners: src/app/api/ticketmaster/tm1/move-selection/route.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts
- Related tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Summary: exports: normalizeTm1Summary, createTm1ClientFromEnv, TM1_DEFAULT_BASE_URL, TM1_DEFAULT_API_PREFIX, TM1_DEFAULT_EVENTBASE_API_PREFIX, TM1_DEFAULT_EVENT_START, TM1_DEFAULT_EVENT_END, TM1_EXTERNAL_EVENT_VERSION_HEADER; tests/describes: .; package imports: 1
