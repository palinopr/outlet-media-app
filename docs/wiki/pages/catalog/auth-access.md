# Auth and Access Map

Generated from the current working tree on 2026-04-28 02:57:59.

This page focuses on files and database objects that participate in authentication, membership, scope, invite, or access-control behavior.

- Auth-related routes: 14
- Auth-related code files: 30
- Auth-related DB objects: 7

## Route and API surfaces

### `/`
- File: `src/app/page.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Related DB objects: if
- Related tests: none
- Direct imports: src/features/client-portal/entry.ts

### `/admin`
- File: `src/app/admin/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), sets dynamic rendering mode
- Related DB objects: if
- Related tests: none
- Direct imports: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx

### `/api/admin/activity`
- File: `src/app/api/admin/activity/route.ts`
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Related DB objects: admin_activity, if
- Related tests: none
- Direct imports: src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/admin/invite`
- File: `src/app/api/admin/invite/route.ts`
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Related DB objects: clients, client_access_invites, if
- Related tests: src/app/api/admin/invite/route.test.ts
- Direct imports: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/admin/users/[id]`
- File: `src/app/api/admin/users/[id]/route.ts`
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Related DB objects: clients, client_members, if
- Related tests: src/app/api/admin/users/[id]/route.test.ts
- Direct imports: src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/observability/client-error`
- File: `src/app/api/observability/client-error/route.ts`
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Related DB objects: if, application_errors
- Related tests: src/app/api/observability/client-error/route.test.ts
- Direct imports: src/lib/api-helpers.ts, src/lib/supabase.ts

### `/api/user/profile`
- File: `src/app/api/user/profile/route.ts`
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Related DB objects: if
- Related tests: none
- Direct imports: src/lib/api-helpers.ts

### `/client`
- File: `src/app/client/page.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect()
- Related DB objects: if
- Related tests: none
- Direct imports: src/components/ui/button.tsx, src/features/client-portal/entry.ts

### `/client/[slug]`
- File: `src/app/client/[slug]/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Behavior signals: calls redirect(), defines generateMetadata
- Related DB objects: if
- Related tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts

### `/client/[slug]/campaign/[campaignId]`
- File: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Auth signals: none
- Behavior signals: none
- Related DB objects: if
- Related tests: src/app/shell-import-smoke.test.ts
- Direct imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/app/client/[slug]/lib.ts

### `/client/[slug]/campaigns`
- File: `src/app/client/[slug]/campaigns/page.tsx`
- Auth signals: none
- Behavior signals: defines generateMetadata
- Related DB objects: none
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Direct imports: src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts, src/lib/constants.ts, src/app/client/[slug]/campaigns/campaign-range-filter.tsx

### `/client/pending`
- File: `src/app/client/pending/layout.tsx`
- Auth signals: imports Clerk server auth, calls auth()
- Behavior signals: calls redirect()
- Related DB objects: if
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
- Related DB objects: admin_activity, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaigns.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: meta_campaigns, system_events, clients, campaign_client_overrides, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 8; package imports: 3

### `src/app/admin/actions/clients.ts`
- Ownership: web admin route surface
- Auth signals: references membership/scope access concepts
- Related DB objects: meta_campaigns, client_accounts, system_events, clients, client_members, client_member_campaigns, campaign_client_overrides, if
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/admin/actions/users.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth
- Related DB objects: clients, client_access_invites, if
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

### `src/app/admin/clients/data.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, references membership/scope access concepts
- Related DB objects: meta_campaigns, client_accounts, clients, client_members, client_member_campaigns, if
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: getClientSummaries, getClientDetail; internal imports: 6; package imports: 1

### `src/app/admin/users/data.ts`
- Ownership: web admin route surface
- Auth signals: imports Clerk server auth, references membership/scope access concepts
- Related DB objects: clients, client_members, if
- Route owners: src/app/admin/users/page.tsx
- Related tests: src/app/shell-import-smoke.test.ts
- Contents summary: exports: getUsers, UserRow; internal imports: 3; package imports: 1

### `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Ownership: web client route surface
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Related DB objects: meta_campaigns, calls, if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCampaignDetail, CampaignDetailRangeInput; internal imports: 9; package imports: 1

### `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CampaignDetailHeader; internal imports: 5; package imports: 2

### `src/app/client/[slug]/data.ts`
- Ownership: web client route surface
- Auth signals: references membership/scope access concepts
- Related DB objects: if
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: toCampaignCard, getCampaignsPageData; internal imports: 4

### `src/app/client/[slug]/lib.ts`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Contents summary: internal imports: 1

### `src/app/client/[slug]/types.ts`
- Ownership: web client route surface
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Related tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
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
- Related DB objects: clients, if
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getAccessManagementPaths, revalidateAccessManagementPaths; package imports: 1

### `src/features/client-portal/access.ts`
- Ownership: feature module: client-portal
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser(), references membership/scope access concepts
- Related DB objects: if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess; internal imports: 2; package imports: 2

### `src/features/client-portal/config.ts`
- Ownership: feature module: client-portal
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: clients, if
- Route owners: src/app/client/[slug]/layout.tsx
- Related tests: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

### `src/features/client-portal/entry.ts`
- Ownership: feature module: client-portal
- Auth signals: references membership/scope access concepts
- Related DB objects: clients, client_members, client_access_invites, if
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

### `src/features/client-portal/insights.ts`
- Ownership: feature module: client-portal
- Auth signals: none
- Related DB objects: leads, if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Contents summary: exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative; internal imports: 4

### `src/features/client-portal/scope.ts`
- Ownership: feature module: client-portal
- Auth signals: references membership/scope access concepts
- Related DB objects: if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Related tests: __tests__/features/client-portal/scope.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: allowsCampaignInScope; internal imports: 1

### `src/features/invitations/server.ts`
- Ownership: feature module: invitations
- Auth signals: imports Clerk server auth
- Related DB objects: clients, client_access_invites, if
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Contents summary: exports: buildActionableInvitations, listActionableInvitations; internal imports: 3; package imports: 1

### `src/features/invitations/sort.ts`
- Ownership: feature module: invitations
- Auth signals: none
- Related DB objects: if
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Related tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: invitationStatusPriority, compareActionableInvitationState, countActionableInvitationStatuses; internal imports: 1

### `src/features/invitations/types.ts`
- Ownership: feature module: invitations
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, … (+10 more)
- Contents summary: exports: ActionableInvitationStatus, ActionableInvitation

### `src/features/shared/admin-summary-types.ts`
- Ownership: feature module: shared
- Auth signals: none
- Related DB objects: none
- Route owners: src/app/admin/users/page.tsx
- Related tests: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: CLIENT_SUMMARY_FIELDS, USER_ROW_FIELDS, ClientSummaryLike, UserRowLike; internal imports: 1

### `src/features/system-events/server.ts`
- Ownership: feature module: system-events
- Auth signals: imports Clerk server auth, calls currentUser()
- Related DB objects: system_events, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1

### `src/features/users/summary.ts`
- Ownership: feature module: users
- Auth signals: none
- Related DB objects: clients, if
- Route owners: src/app/admin/users/page.tsx
- Related tests: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Contents summary: exports: buildUsersAccessSummary, UsersAccessSummary; internal imports: 2

### `src/lib/api-helpers.ts`
- Ownership: shared web library
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Related DB objects: if
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, … (+3 more)
- Related tests: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+2 more)
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest; package imports: 3

### `src/lib/database.types.ts`
- Ownership: shared web library
- Auth signals: references membership/scope access concepts
- Related DB objects: meta_campaigns, campaign_snapshots, client_accounts, system_events, clients, client_members, client_member_campaigns, current_clerk_user_id, admin_activity, campaign_client_overrides, contact_submissions, effective_campaign_client_slug, … (+3 more)
- Route owners: none
- Related tests: none
- Contents summary: exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes

### `src/lib/formatters.tsx`
- Ownership: shared web library
- Auth signals: none
- Related DB objects: if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, … (+7 more)
- Contents summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2

### `src/lib/member-access.ts`
- Ownership: shared web library
- Auth signals: references membership/scope access concepts
- Related DB objects: clients, client_members, client_member_campaigns, if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/entry-accept.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

### `src/lib/supabase.ts`
- Ownership: shared web library
- Auth signals: imports Clerk server auth, calls auth(), calls currentUser()
- Related DB objects: if
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/api/observability/client-error/route.ts, src/app/admin/clients/[id]/page.tsx, … (+11 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+20 more)
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

### `src/proxy.ts`
- Ownership: web source
- Auth signals: imports Clerk server auth
- Related DB objects: if
- Route owners: none
- Related tests: none
- Contents summary: exports: config, default; package imports: 1

## Database objects

### `client_access_invites`
- Kinds: table
- Migrations: supabase/migrations/20260322100000_client_portal_reset.sql
- Routes: src/app/api/admin/invite/route.ts
- Features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/features/invitations/server.ts, src/lib/database.types.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/api/admin/invite/route.test.ts

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
- Features/libs/agents: src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts

### `client_member_events`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql
- Routes: none
- Features/libs/agents: none
- Tests/docs: none

### `client_members`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260307143000_client_member_roster_rls.sql
- Routes: src/app/api/admin/users/[id]/route.ts
- Features/libs/agents: src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.ts, src/lib/database.types.ts, src/lib/member-access.ts
- Tests/docs: docs/context/engineering-principles.md, docs/plans/2026-03-03-client-accounts-design.md, docs/plans/2026-03-03-client-accounts-plan.md, docs/references/database-safety-runbook.md, src/app/admin/clients/data.test.ts, src/app/api/admin/users/[id]/route.test.ts

### `current_clerk_user_id`
- Kinds: function
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260306154500_current_clerk_user_id_search_path.sql
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: none

### `is_current_client_member`
- Kinds: function
- Migrations: supabase/migrations/20260307143000_client_member_roster_rls.sql
- Routes: none
- Features/libs/agents: src/lib/database.types.ts
- Tests/docs: none
