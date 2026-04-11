# Auth and Access Map

Generated from the current working tree on 2026-04-10 21:51:44.

This page focuses on files and database objects that participate in authentication, membership, scope, invite, or access-control behavior.

- Auth-related routes: 19
- Auth-related code files: 49
- Auth-related DB objects: 7

## Route and API surfaces

### `/`
- File: `src/app/page.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Related DB objects: none
- Related tests: none
- Direct imports: src/features/client-portal/entry.ts

### `/admin`
- File: `src/app/admin/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), sets dynamic rendering mode
- Related DB objects: none
- Related tests: none
- Direct imports: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx

### `/api/admin/activity`
- File: `src/app/api/admin/activity/route.ts`
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Related DB objects: admin_activity
- Related tests: none
- Direct imports: src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/admin/invite`
- File: `src/app/api/admin/invite/route.ts`
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Related DB objects: clients, client_access_invites
- Related tests: src/app/api/admin/invite/route.test.ts
- Direct imports: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/admin/users/[id]`
- File: `src/app/api/admin/users/[id]/route.ts`
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Related DB objects: clients, client_members
- Related tests: none
- Direct imports: src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/campaign-comments`
- File: `src/app/api/campaign-comments/route.ts`
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Related DB objects: meta_campaigns, campaign_comments, notifications
- Related tests: src/app/api/campaign-comments/route.test.ts
- Direct imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-comments/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)

### `/api/event-comments`
- File: `src/app/api/event-comments/route.ts`
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Related DB objects: event_comments, notifications
- Related tests: src/app/api/event-comments/route.test.ts
- Direct imports: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)

### `/api/user/profile`
- File: `src/app/api/user/profile/route.ts`
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Related DB objects: none
- Related tests: none
- Direct imports: src/lib/api-helpers.ts

### `/client`
- File: `src/app/client/page.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Related DB objects: none
- Related tests: none
- Direct imports: src/components/ui/button.tsx, src/features/client-portal/entry.ts

### `/client/[slug]`
- File: `src/app/client/[slug]/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts

### `/client/[slug]/agent`
- File: `src/app/client/[slug]/agent/page.tsx`
- Auth signals: none
- Behavior signals: defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/agent/page.test.tsx
- Direct imports: src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-agent/server.ts, src/features/client-agent/components/agent-shell.tsx

### `/client/[slug]/campaign/[campaignId]`
- File: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Auth signals: none
- Behavior signals: none
- Related DB objects: none
- Related tests: src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, … (+3 more)

### `/client/[slug]/campaigns`
- File: `src/app/client/[slug]/campaigns/page.tsx`
- Auth signals: none
- Behavior signals: defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts

### `/client/[slug]/event/[eventId]`
- File: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Auth signals: none
- Behavior signals: none
- Related DB objects: none
- Related tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/formatters.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, … (+2 more)

### `/client/[slug]/events`
- File: `src/app/client/[slug]/events/page.tsx`
- Auth signals: none
- Behavior signals: defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/events/events-filter.tsx, src/features/client-portal/access.ts

### `/client/[slug]/reports`
- File: `src/app/client/[slug]/reports/page.tsx`
- Auth signals: none
- Behavior signals: defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts

### `/client/pending`
- File: `src/app/client/pending/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth()
- Behavior signals: calls redirect()
- Related DB objects: none
- Related tests: none
- Direct imports: none

### `/sign-in/[[...sign-in]]`
- File: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Auth signals: none
- Behavior signals: sets dynamic rendering mode
- Related DB objects: none
- Related tests: none
- Direct imports: none

### `/sign-up/[[...sign-up]]`
- File: `src/app/sign-up/[[...sign-up]]/page.tsx`
- Auth signals: none
- Behavior signals: sets dynamic rendering mode
- Related DB objects: none
- Related tests: src/app/sign-up/invite-flow.test.tsx
- Direct imports: none

## Code files

### `src/app/admin/actions/audit.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: admin_activity
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/app/admin/actions/campaign-action-items.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaign-action-items.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: campaign_action_items, notifications
- Route owners: none
- Related tests: src/app/admin/actions/campaign-action-items.test.ts
- Contents summary: exports: createCampaignActionItem, updateCampaignActionItem, deleteCampaignActionItem; tests/describes: campaign_action_item; internal imports: 10; package imports: 2

### `src/app/admin/actions/campaigns.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: meta_campaigns, system_events, approval_requests, campaign_action_items, campaign_comments, notifications, clients, campaign_client_overrides
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 9; package imports: 3

### `src/app/admin/actions/clients.ts`
- Ownership: web admin route surface
- Auth signals: references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, client_accounts, system_events, approval_requests, campaign_action_items, campaign_comments, email_events, email_reply_examples, crm_contacts, crm_follow_up_items, asset_comments, … (+14 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/admin/actions/event-follow-up-items.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: none
- Route owners: none
- Related tests: none
- Contents summary: exports: createEventFollowUpItem, updateEventFollowUpItem, deleteEventFollowUpItemAction; tests/describes: event_follow_up_item; internal imports: 6; package imports: 2

### `src/app/admin/actions/events.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: tm_events, event_comments, event_follow_up_items
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Related tests: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateEventStatus, assignEventClient, bulkAssignEventClient, bulkUpdateEventStatus, updateEventTickets; tests/describes: event; internal imports: 5; package imports: 2

### `src/app/admin/actions/users.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth
- Related DB objects: clients, client_access_invites
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

### `src/app/admin/clients/data.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, client_accounts, approval_requests, campaign_action_items, campaign_comments, asset_comments, event_comments, clients, client_members, client_member_campaigns, client_member_events, … (+1 more)
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: getClientSummaries, getClientDetail; internal imports: 7; package imports: 1

### `src/app/admin/users/data.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, references membership/scope access concepts
- Related DB objects: clients, client_members
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/shell-import-smoke.test.ts
- Contents summary: exports: getUsers, UserRow; internal imports: 3; package imports: 1

### `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Ownership: web client route surface
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: meta_campaigns, calls
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Contents summary: exports: getCampaignDetail, CampaignDetailRangeInput; internal imports: 9; package imports: 1

### `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CampaignDetailHeader; internal imports: 6; package imports: 2

### `src/app/client/[slug]/data.ts`
- Ownership: web client route surface
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: tm_events, tm_event_demographics
- Route owners: src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Contents summary: exports: toCampaignCard, getCampaignsPageData, getEventsPageData, getData, ClientData, EventsPageData; internal imports: 7; package imports: 1

### `src/app/client/[slug]/event/[eventId]/data.ts`
- Ownership: web client route surface
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, event_snapshots, tm_event_demographics
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, … (+5 more)
- Contents summary: exports: getEventDetail; internal imports: 7; package imports: 1

### `src/app/client/[slug]/lib.ts`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, … (+12 more)
- Contents summary: internal imports: 1

### `src/app/client/[slug]/types.ts`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+11 more)
- Contents summary: internal imports: 1

### `src/components/admin/clients/members-section.tsx`
- Ownership: shared admin UI components
- Auth signals: none
- Related DB objects: clients
- Route owners: src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx
- Contents summary: contains `use client`; exports: MembersSection; internal imports: 13; package imports: 3

### `src/features/access/revalidation.ts`
- Ownership: feature module: access
- Auth signals: none
- Related DB objects: clients
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/approvals/server.ts`
- Ownership: feature module: approvals
- Auth signals: references membership/scope access concepts
- Related DB objects: approval_requests
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+19 more)
- Contents summary: exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5

### `src/features/approvals/summary.ts`
- Ownership: feature module: approvals
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+19 more)
- Contents summary: exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2

### `src/features/assets/server.ts`
- Ownership: feature module: assets
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: meta_campaigns, ad_assets
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+4 more)
- Related tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, … (+37 more)
- Contents summary: exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord; tests/describes: /; internal imports: 4; package imports: 1

### `src/features/campaign-comments/server.ts`
- Ownership: feature module: campaign-comments
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: campaign_comments
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Related tests: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1

### `src/features/campaigns/client-operating.ts`
- Ownership: feature module: campaigns
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientCampaignOperatingView, ClientCampaignOperatingView; internal imports: 8

### `src/features/client-agent/readers.ts`
- Ownership: feature module: client-agent
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+2 more)
- Contents summary: exports: loadClientAgentCampaignDetail, loadClientAgentEventDetail; internal imports: 4

### `src/features/client-agent/server.ts`
- Ownership: feature module: client-agent
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts
- Contents summary: exports: listThreads, createThread, getThread, sendMessage; internal imports: 9

### `src/features/client-agent/store.ts`
- Ownership: feature module: client-agent
- Auth signals: references membership/scope access concepts
- Related DB objects: client_agent_threads, client_agent_messages
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/features/client-agent/server.test.ts, src/features/client-agent/store.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx
- Contents summary: exports: createThread, listThreads, getThread, appendUserMessage, appendAssistantMessage; internal imports: 3

### `src/features/client-portal/access.ts`
- Ownership: feature module: client-portal
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser(), references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts
- Related tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+1 more)
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi; internal imports: 3; package imports: 2

### `src/features/client-portal/config.ts`
- Ownership: feature module: client-portal
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: clients
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx
- Related tests: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, … (+3 more)
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

### `src/features/client-portal/entry.ts`
- Ownership: feature module: client-portal
- Auth signals: references membership/scope access concepts
- Related DB objects: clients, client_members, client_access_invites
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+2 more)
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, … (+3 more)
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

### `src/features/client-portal/insights.ts`
- Ownership: feature module: client-portal
- Auth signals: none
- Related DB objects: leads
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Related tests: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+17 more)
- Contents summary: exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4

### `src/features/client-portal/scope.ts`
- Ownership: feature module: client-portal
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, … (+11 more)
- Contents summary: exports: allowsCampaignInScope, allowsEventInScope; internal imports: 1

### `src/features/conversations/server.ts`
- Ownership: feature module: conversations
- Auth signals: references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, ad_assets
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/conversations/read-clients.test.ts, __tests__/features/conversations/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Contents summary: exports: matchesConversationKinds, listConversationThreads; internal imports: 5

### `src/features/event-comments/server.ts`
- Ownership: feature module: event-comments
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: event_comments
- Route owners: src/app/api/event-comments/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: src/app/api/event-comments/route.test.ts, src/app/client/[slug]/components/event-operating-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+16 more)
- Contents summary: exports: listEventComments, canAccessEventComments, EventCommentVisibility, EventComment; internal imports: 2; package imports: 1

### `src/features/events/client-operating.ts`
- Ownership: feature module: events
- Auth signals: references membership/scope access concepts
- Related DB objects: none
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientEventOperatingView, ClientEventOperatingView; internal imports: 8

### `src/features/events/server.ts`
- Ownership: feature module: events
- Auth signals: references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, event_comments, event_follow_up_items, clients
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/events/[eventId]/page.test.tsx, src/app/api/event-comments/route.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, src/app/admin/reports/page.test.tsx, … (+14 more)
- Contents summary: exports: getEventRecordById, getEventOperatingData, getEventOperationsSummary, EventOperatingRecord, EventLinkedCampaign, EventClientOption, EventOperatingData; internal imports: 6

### `src/features/invitations/server.ts`
- Ownership: feature module: invitations
- Auth signals: imports Clerk server auth
- Related DB objects: clients, client_access_invites
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1

### `src/features/invitations/sort.ts`
- Ownership: feature module: invitations
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1

### `src/features/invitations/types.ts`
- Ownership: feature module: invitations
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, … (+12 more)
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, … (+43 more)
- Contents summary: exports: ActionableInvitationStatus, ActionableInvitation

### `src/features/notifications/server.ts`
- Ownership: feature module: notifications
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: approval_requests, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, notifications, clients, client_members, client_member_campaigns, client_member_events
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Related tests: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+5 more)
- Contents summary: exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1

### `src/features/reports/server.ts`
- Ownership: feature module: reports
- Auth signals: references membership/scope access concepts
- Related DB objects: tm_events, clients
- Route owners: src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Related tests: __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+8 more)
- Contents summary: exports: getReportsData, getReportsWorkflowData, ReportsData, ReportsWorkflowData; internal imports: 14

### `src/features/settings/summary.ts`
- Ownership: feature module: settings
- Auth signals: none
- Related DB objects: client_accounts, clients
- Route owners: src/app/admin/settings/page.tsx
- Related tests: __tests__/features/settings/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildPlatformSettingsSummary, PlatformSettingsMetricKey, PlatformKeyStatus, PlatformSettingsMetric, PlatformSettingsSummary; internal imports: 3

### `src/features/shared/admin-summary-types.ts`
- Ownership: feature module: shared
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Related tests: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/settings/summary.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike; internal imports: 1

### `src/features/system-events/server.ts`
- Ownership: feature module: system-events
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: system_events
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+7 more)
- Related tests: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, … (+27 more)
- Contents summary: exports: filterSystemEventsByScope, getCurrentActor, logSystemEvent, listSystemEvents, listCampaignSystemEvents, listEventSystemEvents, summarizeChangedFields, SystemEventName; internal imports: 1; package imports: 1

### `src/features/users/summary.ts`
- Ownership: feature module: users
- Auth signals: none
- Related DB objects: clients
- Route owners: src/app/admin/users/page.tsx
- Related tests: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildUsersAccessSummary, UsersAccessSummary; internal imports: 2

### `src/lib/api-helpers.ts`
- Ownership: shared web library
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Related DB objects: none
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/job/[id]/route.ts, src/app/api/agents/jobs/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, … (+18 more)
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, … (+12 more)
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, getAuthorName; package imports: 3

### `src/lib/database.types.ts`
- Ownership: shared web library
- Auth signals: references membership/scope access concepts
- Related DB objects: tm_events, meta_campaigns, agent_jobs, campaign_snapshots, event_snapshots, agent_alerts, agent_tasks, client_accounts, agent_runtime_state, email_events, email_drafts, email_reply_examples, … (+22 more)
- Route owners: none
- Related tests: none
- Contents summary: exports: Constants, Json, Database, Tables, Enums, CompositeTypes

### `src/lib/formatters.tsx`
- Ownership: shared web library
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, … (+12 more)
- Related tests: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/agent/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, … (+39 more)
- Contents summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2

### `src/lib/member-access.ts`
- Ownership: shared web library
- Auth signals: references membership/scope access concepts
- Related DB objects: clients, client_members, client_member_campaigns, client_member_events
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/reports/page.tsx, … (+10 more)
- Related tests: src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, __tests__/features/approvals/server.test.ts, … (+50 more)
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/supabase.ts`
- Ownership: shared web library
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Related DB objects: none
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/agents/heartbeat/route.ts, src/app/api/agents/route.ts, src/app/api/alerts/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/contact/route.ts, … (+29 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+71 more)
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/proxy.ts`
- Ownership: web source
- Auth signals: imports Clerk server auth
- Related DB objects: none
- Route owners: none
- Related tests: none
- Contents summary: exports: config, default; package imports: 1

## Database objects

### `client_access_invites`
- Kinds: table
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Routes: src/app/api/admin/invite/route.ts
- Features/libs/agents: src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/lib/database.types.ts
- Tests/docs: docs/superpowers/plans/2026-03-22-outlet-web-reset.md, src/app/api/admin/invite/route.test.ts

### `client_access_invites_updated_at`
- Kinds: trigger
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_member_campaigns`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, src/app/admin/clients/data.test.ts

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Routes: src/app/api/admin/users/[id]/route.ts
- Features/libs/agents: src/features/client-portal/entry.ts, src/features/notifications/server.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: __tests__/features/notifications/server.test.ts, docs/context/current-priorities.md, docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/superpowers/plans/2026-03-22-outlet-web-reset.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, src/app/admin/clients/data.test.ts

### `current_clerk_user_id`
- Kinds: function
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `is_current_client_member`
- Kinds: function
- Migrations: supabase/migrations/20260307143000_client_member_roster_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none
