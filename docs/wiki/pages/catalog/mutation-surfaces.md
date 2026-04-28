# Mutation Surface Map

Generated from the current working tree on 2026-04-28 03:23:46.

This page focuses on obvious state-changing surfaces: API mutation routes, admin actions, and exported mutation-oriented helpers/runtime files.

## API mutation routes

### `/api/admin/activity`
- File: `src/app/api/admin/activity/route.ts`
- Methods: POST
- Validation symbols: ActivitySchema
- DB objects touched: admin_activity, if
- Related tests: src/app/api/admin/activity/route.test.ts
- Summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `/api/admin/invite`
- File: `src/app/api/admin/invite/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: clients, client_access_invites, if
- Related tests: src/app/api/admin/invite/route.test.ts
- Summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `/api/admin/users/[id]`
- File: `src/app/api/admin/users/[id]/route.ts`
- Methods: PATCH
- Validation symbols: UpdateUserSchema
- DB objects touched: clients, client_members, if
- Related tests: src/app/api/admin/users/[id]/route.test.ts
- Summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

### `/api/contact`
- File: `src/app/api/contact/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: contact_submissions, if
- Related tests: src/app/api/contact/route.test.ts
- Summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 4; package imports: 1

### `/api/ingest`
- File: `src/app/api/ingest/route.ts`
- Methods: POST, GET
- Validation symbols: none
- DB objects touched: if
- Related tests: __tests__/api/ingest.test.ts
- Summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 1

### `/api/meta/data-deletion`
- File: `src/app/api/meta/data-deletion/route.ts`
- Methods: POST
- Validation symbols: none
- DB objects touched: client_accounts, if
- Related tests: src/app/api/meta/data-deletion/route.test.ts
- Summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

### `/api/observability/client-error`
- File: `src/app/api/observability/client-error/route.ts`
- Methods: POST
- Validation symbols: ClientErrorSchema
- DB objects touched: if, application_errors
- Related tests: src/app/api/observability/client-error/route.test.ts
- Summary: Next.js route handler for `/api/observability/client-error`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

### `/api/user/profile`
- File: `src/app/api/user/profile/route.ts`
- Methods: POST
- Validation symbols: ProfileSchema, parsed
- DB objects touched: if
- Related tests: src/app/api/user/profile/route.test.ts
- Summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3

## Admin actions

### `src/app/admin/actions/audit.ts`
- Mutation symbols: logActivity, logAudit
- DB objects touched: admin_activity, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

### `src/app/admin/actions/campaigns.ts`
- Mutation symbols: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta, upsertCampaignClientOverrides, syncCampaignLinkedClientSlug, updateRes, UpdateStatusSchema, UpdateTypeSchema, UpdateBudgetSchema, AssignClientSchema, BulkAssignSchema
- DB objects touched: meta_campaigns, system_events, clients, campaign_client_overrides, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 8; package imports: 3

### `src/app/admin/actions/clients.ts`
- Mutation symbols: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns, renameClientSlugReferences, RenameClientSchema, DeactivateClientSchema, BulkDeactivateClientsSchema
- DB objects touched: meta_campaigns, client_accounts, system_events, clients, client_members, client_member_campaigns, campaign_client_overrides, if
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

### `src/app/admin/actions/meta-sync.ts`
- Mutation symbols: syncCampaignStatus, syncCampaignBudget
- DB objects touched: if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: syncCampaignStatus, syncCampaignBudget; internal imports: 1

### `src/app/admin/actions/users.ts`
- Mutation symbols: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation, ChangeRoleSchema, BulkUpdateRoleSchema, failed, DeleteUserSchema, RevokeInvitationSchema
- DB objects touched: clients, client_access_invites, if
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

## Other mutation-oriented files

### `src/features/client-portal/theme.ts`
- Mutation symbols: createTheme
- DB objects touched: if
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Related tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Summary: exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1

### `src/features/system-events/server.ts`
- Mutation symbols: logSystemEvent, LogSystemEventInput
- DB objects touched: system_events, if
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Related tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Summary: exports: getCurrentActor, logSystemEvent, listSystemEvents, SystemEventName, SystemEventVisibility, SystemEventActorType, SystemEventSource, SystemEvent; internal imports: 1; package imports: 1

### `src/lib/api-schemas.ts`
- Mutation symbols: CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema
- DB objects touched: if
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Related tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- Summary: exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema; package imports: 1

### `src/lib/constants.ts`
- Mutation symbols: start
- DB objects touched: if
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/page.tsx
- Related tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/client/[slug]/lib.test.ts, … (+3 more)
- Summary: exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS

### `src/lib/supabase.ts`
- Mutation symbols: createClerkSupabaseClient
- DB objects touched: if
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, src/app/api/observability/client-error/route.ts, src/app/admin/clients/[id]/page.tsx, … (+11 more)
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/activity/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, … (+21 more)
- Summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3
