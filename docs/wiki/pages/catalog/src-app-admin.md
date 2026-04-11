# src/app / admin

Generated from the current working tree on 2026-04-10 22:12:57.

- Files: 54
- File kinds: TypeScript module (17), Next.js page (11), test file (10), React/TSX module (9), Next.js loading UI (6), Next.js layout (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/app/admin/actions/audit.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 45
- Bytes: 1157
- Imports (internal): src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/admin/actions/users.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/actions/campaign-action-items.test.ts
- Exports: logActivity, logAudit, ActivityEventType
- Symbol details: function logActivity (exported), function logAudit (exported), type ActivityEventType (exported)
- Defines: logActivity, logAudit, err, user, ActivityEventType
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

## `src/app/admin/actions/campaign-action-items.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/actions
- Lines: 239
- Bytes: 6693
- Imports (internal): src/app/admin/actions/campaign-action-items.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-action-items/server.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts, src/features/workflow/revalidation.ts, src/app/admin/actions/audit.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / admin, src/lib, src/features / campaign-action-items, src/features / notifications, src/features / system-events, src/features / workflow
- Defines: applyFilters, state, supabaseAdmin, query, rows
- Tests / describe labels: campaign action item admin ownership, uses effective campaign ownership on update notifications and revalidation, uses effective campaign ownership on delete revalidation
- Contents summary: tests/describes: campaign action item admin ownership; uses effective campaign ownership on update notifications and revalidation; uses effective campaign ownership on delete revalidation; internal imports: 9; package imports: 2

## `src/app/admin/actions/campaign-action-items.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 345
- Bytes: 12358
- Imports (internal): src/features/campaign-action-items/server.ts, src/features/notifications/workflow.ts, src/features/workflow/revalidation.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/app/admin/actions/audit.ts, src/features/system-events/server.ts
- Imports (packages): @clerk/nextjs/server, zod/v4
- Imported by: src/app/admin/actions/campaign-action-items.test.ts
- Depends on groups: src/features / campaign-action-items, src/features / notifications, src/features / workflow, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/app / admin
- Tests related: src/app/admin/actions/campaign-action-items.test.ts
- Tests related (direct): src/app/admin/actions/campaign-action-items.test.ts
- Exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem
- Symbol details: function createCampaignActionItem (exported), function updateCampaignActionItem (exported), function deleteCampaignActionItem (exported), const CampaignActionVisibility, const CreateCampaignActionItemSchema, const UpdateCampaignActionItemSchema
- Defines: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem, CampaignActionVisibility, CreateCampaignActionItemSchema, UpdateCampaignActionItemSchema, err, parsed, user, effectiveClientSlug, nextPosition, createdItem, … (+6 more)
- Tests / describe labels: campaign_action_item
- Contents summary: exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem; tests/describes: campaign_action_item; internal imports: 10; package imports: 2

## `src/app/admin/actions/campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 522
- Bytes: 17317
- Imports (internal): src/features/workflow/revalidation.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/formatters.tsx, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts, src/features/system-events/server.ts, src/features/campaigns/ownership-sync.ts
- Imports (packages): next/cache, zod/v4, @clerk/nextjs/server
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx
- Depends on groups: src/features / workflow, src/lib, src/app / admin, src/features / system-events, src/features / campaigns
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta
- Symbol details: function updateCampaignStatus (exported), function updateCampaignType (exported), function updateCampaignBudget (exported), function assignCampaignClient (exported), function bulkAssignClient (exported), function syncCampaignToMeta (exported), function eventVisibility, function centsLabel, function revalidateCampaignPaths, function revalidateClientAccountPaths, function ensureClientExists, function upsertCampaignClientOverrides, function syncCampaignLinkedClientSlug, const UpdateStatusSchema, const UpdateTypeSchema, const UpdateBudgetSchema, … (+2 more)
- Defines: eventVisibility, centsLabel, revalidateCampaignPaths, revalidateClientAccountPaths, ensureClientExists, upsertCampaignClientOverrides, syncCampaignLinkedClientSlug, updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, … (+28 more)
- Tests / describe labels: _, campaign
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 9; package imports: 3

## `src/app/admin/actions/clients.revalidation.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 8
- Bytes: 147
- Exports: getClientSlugRevalidationPaths
- Symbol details: function getClientSlugRevalidationPaths (exported)
- Defines: getClientSlugRevalidationPaths
- Contents summary: exports: getClientSlugRevalidationPaths

## `src/app/admin/actions/clients.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/actions
- Lines: 17
- Bytes: 557
- Imports (internal unresolved): src/app/admin/actions/clients.revalidation
- Imports (packages): vitest
- Tests / describe labels: getClientSlugRevalidationPaths, keeps client rename revalidation on surviving admin surfaces, does not include the retired assets route
- Contents summary: tests/describes: getClientSlugRevalidationPaths; keeps client rename revalidation on surviving admin surfaces; does not include the retired assets route; internal imports: 1; package imports: 1

## `src/app/admin/actions/clients.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 498
- Bytes: 16226
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/app/admin/actions/audit.ts, src/features/access/revalidation.ts
- Imports (internal unresolved): src/app/admin/actions/clients.revalidation
- Imports (packages): next/cache, zod/v4
- Imported by: src/components/admin/client-onboard-form.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/components/admin/clients/client-detail.test.tsx
- Exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns, updateMemberEvents
- Symbol details: function renameClient (exported), function deactivateClient (exported), function bulkDeactivateClients (exported), function createClient (exported), function updateClient (exported), function addClientMember (exported), function removeClientMember (exported), function changeClientMemberRole (exported), function changeClientMemberScope (exported), function updateMemberCampaigns (exported), function updateMemberEvents (exported), function getClientAccessContextById, function getClientAccessContextByMemberId, function revalidateClientSlugSurfaces, function renameClientSlugReferences, function pauseCampaignsForClientSlug, … (+6 more)
- Defines: getClientAccessContextById, getClientAccessContextByMemberId, revalidateClientSlugSurfaces, renameClientSlugReferences, pauseCampaignsForClientSlug, renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, … (+19 more)
- Tests / describe labels: client, client_member
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

## `src/app/admin/actions/event-follow-up-items.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 160
- Bytes: 5236
- Imports (internal): src/lib/api-helpers.ts, src/lib/workspace-types.ts, src/features/event-follow-up-items/server.ts, src/features/events/server.ts, src/features/workflow/revalidation.ts, src/app/admin/actions/audit.ts
- Imports (packages): @clerk/nextjs/server, zod/v4
- Depends on groups: src/lib, src/features / event-follow-up-items, src/features / events, src/features / workflow, src/app / admin
- Exports: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction
- Symbol details: function createEventFollowUpItem (exported), function updateEventFollowUpItem (exported), function deleteEventFollowUpItemAction (exported), const VisibilityOptions, const CreateEventFollowUpItemSchema, const UpdateEventFollowUpItemSchema
- Defines: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction, VisibilityOptions, CreateEventFollowUpItemSchema, UpdateEventFollowUpItemSchema, err, parsed, user, event, item, existing
- Tests / describe labels: event_follow_up_item
- Contents summary: exports: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction; tests/describes: event_follow_up_item; internal imports: 6; package imports: 2

## `src/app/admin/actions/events.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 317
- Bytes: 10739
- Imports (internal): src/features/workflow/revalidation.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/app/admin/actions/audit.ts, src/features/system-events/server.ts
- Imports (packages): zod/v4, @clerk/nextjs/server
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/events/event-table.tsx
- Depends on groups: src/features / workflow, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/components / admin
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets
- Symbol details: function updateEventStatus (exported), function assignEventClient (exported), function bulkAssignEventClient (exported), function bulkUpdateEventStatus (exported), function updateEventTickets (exported), function eventVisibility, function syncEventWorkflowClientSlug, function revalidateEventPaths, const UpdateEventStatusSchema, const AssignEventClientSchema, const UpdateTicketsSchema, const BulkAssignEventClientSchema, const BulkUpdateEventStatusSchema
- Defines: eventVisibility, syncEventWorkflowClientSlug, revalidateEventPaths, updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets, uniqueClientSlugs, UpdateEventStatusSchema, err, parsed, … (+9 more)
- Tests / describe labels: event
- Contents summary: exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets; tests/describes: event; internal imports: 5; package imports: 2

## `src/app/admin/actions/meta-sync.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 44
- Bytes: 1497
- Imports (internal): src/lib/constants.ts
- Imported by: src/app/admin/actions/campaigns.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: syncCampaignStatus, syncCampaignBudget
- Symbol details: function syncCampaignStatus (exported), function syncCampaignBudget (exported), function getMetaCredentials
- Defines: getMetaCredentials, syncCampaignStatus, syncCampaignBudget, token, rawAccountId, url, res, data
- Contents summary: exports: syncCampaignStatus, syncCampaignBudget; internal imports: 1

## `src/app/admin/actions/search.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/actions
- Lines: 127
- Bytes: 3076
- Imports (internal): src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/app / admin, src/lib
- Defines: queryResult, query, supabaseAdmin, records
- Tests / describe labels: fetchSearchableRecords, does not surface asset results
- Contents summary: tests/describes: fetchSearchableRecords; does not surface asset results; internal imports: 3; package imports: 1

## `src/app/admin/actions/search.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 70
- Bytes: 1970
- Imports (internal): src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imported by: src/app/admin/actions/search.test.ts, src/components/admin/command-palette.tsx
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/layout.tsx
- Tests related: src/app/admin/actions/search.test.ts
- Tests related (direct): src/app/admin/actions/search.test.ts
- Exports: fetchSearchableRecords, SearchableRecord
- Symbol details: function fetchSearchableRecords (exported), type SearchableRecord (exported)
- Defines: fetchSearchableRecords, err, effectiveCampaignRows, SearchableRecord
- Contents summary: exports: fetchSearchableRecords, SearchableRecord; internal imports: 3

## `src/app/admin/actions/users.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 148
- Bytes: 4596
- Imports (internal): src/lib/api-helpers.ts, src/app/admin/actions/audit.ts, src/features/access/revalidation.ts, src/lib/supabase.ts
- Imports (packages): zod/v4, @clerk/nextjs/server
- Imported by: src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/users/user-table.tsx
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/components/admin/users/revoke-invitation-button.test.tsx
- Exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation
- Symbol details: function changeUserRole (exported), function bulkUpdateUserRole (exported), function deleteUser (exported), function revokeInvitation (exported), const ChangeRoleSchema, const BulkUpdateRoleSchema, const DeleteUserSchema, const RevokeInvitationSchema
- Defines: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation, ChangeRoleSchema, err, parsed, client, user, oldRole, BulkUpdateRoleSchema, clerk, … (+8 more)
- Tests / describe labels: user, invitation
- Contents summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

## `src/app/admin/agents/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/agents
- Lines: 42
- Bytes: 1013
- Imports (internal): src/features/agent-outcomes/server.ts, src/features/agents/summary.ts, src/lib/agent-jobs.ts
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/job-history.test.tsx, src/components/admin/agents/job-history.tsx
- Depends on groups: src/features / agent-outcomes, src/features / agents, src/lib
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/command-summary.test.tsx
- Tests related (direct): src/components/admin/agents/job-history.test.tsx
- Exports: getInitialData, AgentJob, AgentsData
- Symbol details: function getInitialData (exported), type AgentJob (exported), interface AgentsData (exported)
- Defines: getInitialData, AgentJobView, AgentJob, AgentsData
- Contents summary: exports: getInitialData, AgentJob, AgentsData; internal imports: 3

## `src/app/admin/agents/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/agents
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/agents/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/agents
- Lines: 69
- Bytes: 2608
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: AgentsLoading, default
- Symbol details: default function AgentsLoading (exported)
- Defines: AgentsLoading
- Contents summary: Next.js loading UI for `/admin/agents`; exports: AgentsLoading, default; internal imports: 2

## `src/app/admin/agents/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/agents
- Lines: 68
- Bytes: 2599
- Imports (internal): src/app/admin/agents/data.ts, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/job-history.tsx, src/components/ui/sheet.tsx, src/components/ui/button.tsx, src/components/admin/page-header.tsx
- Imports (packages): lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/app / admin, src/components / admin, src/components / ui
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: AgentsPage, dynamic, default
- Symbol details: default function AgentsPage (exported), const dynamic (exported)
- Defines: AgentsPage, dynamic, chatJobs
- Contents summary: Next.js page for `/admin/agents`; exports: AgentsPage, dynamic, default; internal imports: 8; package imports: 1

## `src/app/admin/campaigns/[campaignId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/campaigns/[campaignId]
- Lines: 90
- Bytes: 2534
- Imports (internal): src/features/campaigns/server.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/features / campaigns, src/app / admin, src/components / admin
- Symbol details: const getCampaignOperatingData, const data
- Defines: getCampaignOperatingData, data, element
- Tests / describe labels: AdminCampaignDetailPage, renders the client requests tab when requested
- Contents summary: tests/describes: AdminCampaignDetailPage; renders the client requests tab when requested; internal imports: 5; package imports: 3

## `src/app/admin/campaigns/[campaignId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/campaigns/[campaignId]
- Lines: 120
- Bytes: 5059
- Imports (internal): src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Imports (packages): next/link, next/navigation, lucide-react
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Depends on groups: src/components / admin, src/features / campaigns, src/lib
- Used by groups: src/app / admin
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Tests related (direct): src/app/admin/campaigns/[campaignId]/page.test.tsx
- Exports: AdminCampaignDetailPage, default
- Symbol details: default function AdminCampaignDetailPage (exported), interface Props
- Defines: AdminCampaignDetailPage, activeTab, data, statusCfg, requestClientSlug, openRequestCount, Props
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 6; package imports: 3

## `src/app/admin/campaigns/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/campaigns
- Lines: 26
- Bytes: 679
- Imports (internal): src/lib/meta-campaigns.ts, src/lib/constants.ts
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / root routes
- Route owners: src/app/admin/campaigns/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getCampaigns, CampaignsData
- Symbol details: function getCampaigns (exported), interface CampaignsData (exported)
- Defines: getCampaigns, result, CampaignsData
- Contents summary: exports: getCampaigns, CampaignsData; internal imports: 2

## `src/app/admin/campaigns/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/campaigns
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/campaigns/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/campaigns
- Lines: 54
- Bytes: 1911
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: CampaignsLoading, default
- Symbol details: default function CampaignsLoading (exported)
- Defines: CampaignsLoading
- Contents summary: Next.js loading UI for `/admin/campaigns`; exports: CampaignsLoading, default; internal imports: 2

## `src/app/admin/campaigns/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/campaigns
- Lines: 34
- Bytes: 1117
- Imports (internal): src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/data.ts, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / admin, src/components / admin
- Tests / describe labels: CampaignsPage, uses thin agent-entry copy in the empty state
- Contents summary: tests/describes: CampaignsPage; uses thin agent-entry copy in the empty state; internal imports: 5; package imports: 2

## `src/app/admin/campaigns/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/campaigns
- Lines: 136
- Bytes: 5677
- Imports (internal): src/components/ui/card.tsx, src/components/admin/stat-card.tsx, src/app/admin/campaigns/data.ts, src/lib/constants.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/components/admin/page-header.tsx
- Imports (packages): lucide-react, react
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / admin, src/app / admin, src/lib
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: CampaignsPage, default
- Symbol details: default function CampaignsPage (exported), interface Props
- Defines: CampaignsPage, clientSlug, range, totalSpend, totalImpressions, totalClicks, avgRoas, overallCtr, metaAdAccountId, hasData, Props
- Contents summary: Next.js page for `/admin/campaigns`; exports: CampaignsPage, default; internal imports: 10; package imports: 2

## `src/app/admin/clients/[id]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/clients/[id]
- Lines: 18
- Bytes: 482
- Imports (internal): src/app/admin/clients/data.ts, src/components/admin/clients/client-detail.tsx
- Imports (packages): next/navigation
- Depends on groups: src/app / admin, src/components / admin
- Exports: ClientDetailPage, dynamic, default
- Symbol details: default function ClientDetailPage (exported), const dynamic (exported), interface Props
- Defines: ClientDetailPage, dynamic, client, Props
- Contents summary: Next.js page for `/admin/clients/[id]`; exports: ClientDetailPage, dynamic, default; internal imports: 2; package imports: 1

## `src/app/admin/clients/data.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/clients
- Lines: 245
- Bytes: 7021
- Imports (internal): src/app/admin/clients/data.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/features/invitations/server.ts, src/features/settings/connected-accounts.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / admin, src/lib, src/features / invitations, src/features / settings
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, summaries, detail
- Tests / describe labels: admin clients data, does not count CRM comments in client summary open-discussion totals, does not count CRM comments in client detail open-discussion totals
- Contents summary: tests/describes: admin clients data; does not count CRM comments in client summary open-discussion totals; does not count CRM comments in client detail open-discussion totals; internal imports: 5; package imports: 2

## `src/app/admin/clients/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/clients
- Lines: 513
- Bytes: 17387
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/features/clients/summary.ts, src/features/invitations/server.ts, src/features/settings/connected-accounts.ts, src/app/admin/clients/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/data.test.ts, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-detail.tsx, src/components/admin/clients/client-table.tsx, … (+3 more)
- Depends on groups: src/lib, src/features / clients, src/features / invitations, src/features / settings, src/app / admin
- Used by groups: src/app / admin, src/app / root routes, src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts
- Exports: getClientSummaries, getClientDetail
- Symbol details: function getClientSummaries (exported), function getClientDetail (exported), function fetchMemberAssignments, function enrichMembersWithClerk
- Defines: getClientSummaries, fetchMemberAssignments, enrichMembersWithClerk, getClientDetail, effectiveCampaignRows, slug, campaignIdsBySlug, approvalClientSlug, entityType, entityId, metadata, campaignId, … (+19 more)
- Contents summary: exports: getClientSummaries, getClientDetail; internal imports: 7; package imports: 1

## `src/app/admin/clients/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/clients
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/clients/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/clients
- Lines: 60
- Bytes: 2104
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: ClientsLoading, default
- Symbol details: default function ClientsLoading (exported)
- Defines: ClientsLoading
- Contents summary: Next.js loading UI for `/admin/clients`; exports: ClientsLoading, default; internal imports: 2

## `src/app/admin/clients/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/clients
- Lines: 156
- Bytes: 7108
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/app/admin/clients/data.ts, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/features/clients/summary.ts, src/components/admin/page-header.tsx
- Imports (packages): lucide-react, next/link
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/app / admin, src/lib, src/components / admin, src/features / clients
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: ClientsPage, default
- Symbol details: default function ClientsPage (exported)
- Defines: ClientsPage, clients, totalSpend, totalCampaigns, activeCampaigns, assetsNeedingReview, connectionRiskAccounts, blendedRoas, clientsNeedingAttention, attentionClients, stats
- Contents summary: Next.js page for `/admin/clients`; exports: ClientsPage, default; internal imports: 8; package imports: 2

## `src/app/admin/clients/types.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/clients
- Lines: 70
- Bytes: 1408
- Imported by: src/app/admin/clients/data.ts
- Used by groups: src/app / admin
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Exports: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientEvent, ClientCampaign
- Symbol details: interface ClientSummary (exported), interface ClientDetail (exported), interface ClientPendingInvite (exported), interface ClientMember (exported), interface ClientEvent (exported), interface ClientCampaign (exported)
- Defines: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientEvent, ClientCampaign
- Contents summary: exports: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientEvent, ClientCampaign

## `src/app/admin/dashboard/campaign-cards.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /admin/dashboard
- Lines: 85
- Bytes: 3978
- Imports (internal): src/components/ui/card.tsx, src/lib/formatters.tsx, src/app/admin/dashboard/data.ts
- Imports (packages): next/link, lucide-react
- Imported by: src/app/admin/dashboard/page.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: CampaignCards
- Symbol details: function CampaignCards (exported), interface Props
- Defines: CampaignCards, m, color, Props
- Contents summary: exports: CampaignCards; internal imports: 3; package imports: 2

## `src/app/admin/dashboard/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/dashboard
- Lines: 131
- Bytes: 5013
- Imports (internal): src/lib/supabase.ts, src/lib/formatters.tsx, src/app/client/[slug]/lib.ts, src/lib/agent-jobs.ts, src/lib/campaign-client-assignment.ts
- Imports (internal unresolved): src/lib/database.types
- Imported by: src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/dashboard/upcoming-shows.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client
- Used by groups: src/app / admin, src/app / root routes
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getData, TmEvent, MetaCampaign, AgentLastRun, DashboardData
- Symbol details: function getData (exported), type TmEvent (exported), type MetaCampaign (exported), interface AgentLastRun (exported), interface DashboardData (exported), interface SnapshotRow, interface DailyRow
- Defines: getData, thirtyDaysAgo, events, campaigns, allCampaigns, snapshots, dailyRows, seen, job, trendData, velocityData, pts, … (+6 more)
- Contents summary: exports: getData, TmEvent, MetaCampaign, AgentLastRun, DashboardData; internal imports: 6

## `src/app/admin/dashboard/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/dashboard
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/dashboard/events-preview-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /admin/dashboard
- Lines: 121
- Bytes: 5833
- Imports (internal): src/components/ui/card.tsx, src/components/ui/table.tsx, src/lib/formatters.tsx, src/app/admin/dashboard/data.ts
- Imports (packages): next/link, lucide-react
- Imported by: src/app/admin/dashboard/page.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: EventsPreviewTable
- Symbol details: function EventsPreviewTable (exported), interface Props
- Defines: EventsPreviewTable, cap, pct, Props
- Contents summary: exports: EventsPreviewTable; internal imports: 4; package imports: 2

## `src/app/admin/dashboard/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/dashboard
- Lines: 55
- Bytes: 1870
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: DashboardLoading, default
- Symbol details: default function DashboardLoading (exported)
- Defines: DashboardLoading
- Contents summary: Next.js loading UI for `/admin/dashboard`; exports: DashboardLoading, default; internal imports: 2

## `src/app/admin/dashboard/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/dashboard
- Lines: 24
- Bytes: 650
- Imports (internal): src/app/admin/dashboard/page.tsx, src/app/admin/dashboard/data.ts
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / admin
- Tests / describe labels: AdminDashboard, does not render the creative snapshot block
- Contents summary: tests/describes: AdminDashboard; does not render the creative snapshot block; internal imports: 2; package imports: 2

## `src/app/admin/dashboard/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/dashboard
- Lines: 187
- Bytes: 7973
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/components/charts/ticket-velocity-chart.tsx, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/agents/constants.ts, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/upcoming-shows.tsx, … (+2 more)
- Imports (packages): lucide-react
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / charts, src/lib, src/components / admin, src/app / admin
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AdminDashboard, default
- Symbol details: default function AdminDashboard (exported), function getUpcomingShows
- Defines: getUpcomingShows, AdminDashboard, nowMs, d, upcomingShows, totalSold, totalCap, totalGross, totalSpend, avgRoas, now, heroStats, … (+8 more)
- Contents summary: Next.js page for `/admin/dashboard`; exports: AdminDashboard, default; internal imports: 12; package imports: 1

## `src/app/admin/dashboard/upcoming-shows.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /admin/dashboard
- Lines: 78
- Bytes: 3434
- Imports (internal): src/lib/campaign-event-match.ts, src/lib/formatters.tsx, src/app/admin/dashboard/data.ts
- Imports (packages): next/link, lucide-react
- Imported by: src/app/admin/dashboard/page.tsx
- Depends on groups: src/lib, src/app / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: UpcomingShows
- Symbol details: function UpcomingShows (exported), function daysUntil, interface Props
- Defines: daysUntil, UpcomingShows, diff, days, linked, hasActive, hasPaused, urgent, borderColor, bgColor, Props
- Contents summary: exports: UpcomingShows; internal imports: 3; package imports: 2

## `src/app/admin/events/[eventId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/events/[eventId]
- Lines: 82
- Bytes: 2356
- Imports (internal): src/features/events/server.ts, src/app/admin/events/[eventId]/page.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/client-requests-panel.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/features / events, src/app / admin, src/components / admin
- Symbol details: const getEventOperatingData, const data
- Defines: getEventOperatingData, data, element
- Tests / describe labels: AdminEventDetailPage, renders the client requests tab when requested
- Contents summary: tests/describes: AdminEventDetailPage; renders the client requests tab when requested; internal imports: 4; package imports: 3

## `src/app/admin/events/[eventId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/events/[eventId]
- Lines: 234
- Bytes: 9897
- Imports (internal): src/components/admin/client-requests-panel.tsx, src/components/admin/page-header.tsx, src/components/admin/stat-card.tsx, src/components/admin/events/event-operating-panel.tsx, src/features/events/server.ts, src/lib/formatters.tsx
- Imports (packages): next/link, next/navigation, lucide-react
- Imported by: src/app/admin/events/[eventId]/page.test.tsx
- Depends on groups: src/components / admin, src/features / events, src/lib
- Used by groups: src/app / admin
- Tests related: src/app/admin/events/[eventId]/page.test.tsx
- Tests related (direct): src/app/admin/events/[eventId]/page.test.tsx
- Exports: AdminEventDetailPage, default
- Symbol details: default function AdminEventDetailPage (exported), function eventSellThrough, interface Props
- Defines: eventSellThrough, AdminEventDetailPage, capacity, activeTab, data, totalCampaignSpend, averageRoas, sellThrough, openRequestCount, Props
- Contents summary: Next.js page for `/admin/events/[eventId]`; exports: AdminEventDetailPage, default; internal imports: 6; package imports: 3

## `src/app/admin/events/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/events
- Lines: 86
- Bytes: 2758
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts
- Imports (internal unresolved): src/lib/database.types
- Imported by: src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/events/columns.tsx, src/components/admin/events/event-table.tsx
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / root routes, src/components / admin
- Route owners: src/app/admin/events/page.tsx
- Routes related (direct): src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getEvents, TmEventRow, DemoRow, CampaignRow, EventsData
- Symbol details: function getEvents (exported), type TmEventRow (exported), type DemoRow (exported), type CampaignRow (exported), interface EventsData (exported)
- Defines: getEvents, clientsRes, clients, effectiveCampaignRows, TmEventRow, DemoRow, CampaignRow, EventsData
- Contents summary: exports: getEvents, TmEventRow, DemoRow, CampaignRow, EventsData; internal imports: 3

## `src/app/admin/events/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/events
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/events/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/events
- Lines: 54
- Bytes: 1925
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: EventsLoading, default
- Symbol details: default function EventsLoading (exported)
- Defines: EventsLoading
- Contents summary: Next.js loading UI for `/admin/events`; exports: EventsLoading, default; internal imports: 2

## `src/app/admin/events/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/events
- Lines: 30
- Bytes: 860
- Imports (internal): src/app/admin/events/page.tsx, src/app/admin/events/data.ts, src/components/admin/events/event-table.tsx, src/components/admin/campaigns/client-filter.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / admin, src/components / admin
- Tests / describe labels: EventsPage, uses thin agent-entry copy in the header
- Contents summary: tests/describes: EventsPage; uses thin agent-entry copy in the header; internal imports: 4; package imports: 2

## `src/app/admin/events/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/events
- Lines: 98
- Bytes: 4249
- Imports (internal): src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/admin/stat-card.tsx, src/app/admin/events/data.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/events/event-table.tsx, src/lib/formatters.tsx, src/components/admin/page-header.tsx
- Imports (packages): lucide-react, react
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / admin, src/app / admin, src/lib
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: EventsPage, default
- Symbol details: default function EventsPage (exported), interface Props
- Defines: EventsPage, clientSlug, totalSold, eventsWithCap, capSold, capTotal, totalGross, avgSellPct, totalFans, Props
- Contents summary: Next.js page for `/admin/events`; exports: EventsPage, default; internal imports: 8; package imports: 2

## `src/app/admin/layout.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js layout
- Construction: App Router layout, component/UI-oriented module
- Route: /admin
- Lines: 80
- Bytes: 2920
- Imports (internal): src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx
- Imports (packages): react, next, @clerk/nextjs/server, next/navigation, nuqs/adapters/next/app
- Depends on groups: src/components / admin
- Exports: AdminLayout, dynamic, metadata, default
- Symbol details: default function AdminLayout (exported), const dynamic (exported)
- Defines: AdminLayout, dynamic, clerkEnabled, role, full
- Contents summary: Next.js layout for `/admin`; exports: AdminLayout, dynamic, metadata, default; internal imports: 5; package imports: 5

## `src/app/admin/reports/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/reports
- Lines: 65
- Bytes: 2045
- Imports (internal): src/features/reports/server.ts, src/app/admin/reports/page.tsx, src/features/reports/components/reports-surface.tsx
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/features / reports, src/app / admin
- Symbol details: const mockedGetReportsData, const mockedGetReportsWorkflowData
- Defines: mockedGetReportsData, mockedGetReportsWorkflowData, element
- Tests / describe labels: AdminReportsPage, renders the shared reports surface in admin mode
- Contents summary: tests/describes: AdminReportsPage; renders the shared reports surface in admin mode; internal imports: 3; package imports: 2

## `src/app/admin/reports/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/reports
- Lines: 25
- Bytes: 724
- Imports (internal): src/components/admin/page-header.tsx, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / admin, src/features / reports
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AdminReportsPage, default
- Symbol details: default function AdminReportsPage (exported)
- Defines: AdminReportsPage
- Contents summary: Next.js page for `/admin/reports`; exports: AdminReportsPage, default; internal imports: 3

## `src/app/admin/settings/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/settings
- Lines: 357
- Bytes: 16285
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/client-onboard-form.tsx, src/components/admin/agents/constants.ts, src/components/admin/users/revoke-invitation-button.tsx, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/components/admin/stat-card.tsx, src/lib/formatters.tsx, src/features/settings/summary.ts, … (+4 more)
- Imports (packages): next/link, lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / admin, src/app / admin, src/lib, src/features / settings
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: SettingsPage, default
- Symbol details: default function SettingsPage (exported), function getApiKeyStatus
- Defines: getApiKeyStatus, SettingsPage, keys, value, configured, masked, apiKeys, connectedAccounts, summary, Icon, inviteStatus
- Contents summary: Next.js page for `/admin/settings`; exports: SettingsPage, default; internal imports: 14; package imports: 2

## `src/app/admin/users/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/users
- Lines: 91
- Bytes: 2865
- Imports (internal): src/lib/supabase.ts, src/features/invitations/server.ts, src/features/invitations/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx
- Depends on groups: src/lib, src/features / invitations
- Used by groups: src/app / admin, src/app / root routes, src/components / admin
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: getUsers, UserRow
- Symbol details: function getUsers (exported), interface UserRow (exported)
- Defines: getUsers, clerkEnabled, client, membershipMap, slug, existing, meta, slugs, existingEmails, invitations, UserRow
- Contents summary: exports: getUsers, UserRow; internal imports: 3; package imports: 1

## `src/app/admin/users/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /admin/users
- Lines: 3
- Bytes: 75
- Imports (internal): src/components/admin/error-boundary.tsx
- Depends on groups: src/components / admin
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/admin/users/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /admin/users
- Lines: 56
- Bytes: 1881
- Imports (internal): src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Depends on groups: src/components / ui
- Exports: UsersLoading, default
- Symbol details: default function UsersLoading (exported)
- Defines: UsersLoading
- Contents summary: Next.js loading UI for `/admin/users`; exports: UsersLoading, default; internal imports: 2

## `src/app/admin/users/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/users
- Lines: 187
- Bytes: 8552
- Imports (internal): src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/lib/formatters.tsx, src/features/users/summary.ts, src/components/admin/page-header.tsx
- Imports (packages): next/link, lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/app / admin, src/components / admin, src/components / ui, src/lib, src/features / users
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: UsersPage, dynamic, default
- Symbol details: default function UsersPage (exported), const dynamic (exported)
- Defines: UsersPage, dynamic, activeUsers, invitedCount, adminCount, clientCount, pendingCount, accessSummary, stats, inviteStatus
- Contents summary: Next.js page for `/admin/users`; exports: UsersPage, dynamic, default; internal imports: 10; package imports: 2
