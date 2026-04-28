# src/app / admin

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 41
- File kinds: TypeScript module (12), Next.js page (10), test file (9), React/TSX module (5), Next.js loading UI (4), Next.js layout (1)

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
- Imported by: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: logActivity, logAudit, ActivityEventType
- Symbol details: function logActivity (exported), function logAudit (exported), type ActivityEventType (exported)
- Defines: logActivity, logAudit, err, user, ActivityEventType
- Contents summary: exports: logActivity, logAudit, ActivityEventType; internal imports: 2; package imports: 1

## `src/app/admin/actions/campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 429
- Bytes: 14410
- Imports (internal): src/features/campaigns/revalidation.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/formatters.tsx, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts, src/features/system-events/server.ts
- Imports (packages): next/cache, zod/v4, @clerk/nextjs/server
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx
- Depends on groups: src/features / campaigns, src/lib, src/app / admin, src/features / system-events
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta
- Symbol details: function updateCampaignStatus (exported), function updateCampaignType (exported), function updateCampaignBudget (exported), function assignCampaignClient (exported), function bulkAssignClient (exported), function syncCampaignToMeta (exported), function eventVisibility, function centsLabel, function revalidateCampaignSurfaces, function revalidateClientAccountPaths, function ensureClientExists, function upsertCampaignClientOverrides, function syncCampaignLinkedClientSlug, const UpdateStatusSchema, const UpdateTypeSchema, const UpdateBudgetSchema, … (+2 more)
- Defines: eventVisibility, centsLabel, revalidateCampaignSurfaces, revalidateClientAccountPaths, ensureClientExists, upsertCampaignClientOverrides, syncCampaignLinkedClientSlug, updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, … (+23 more)
- Tests / describe labels: _, campaign
- Contents summary: exports: updateCampaignStatus, updateCampaignType, updateCampaignBudget, assignCampaignClient, bulkAssignClient, syncCampaignToMeta; tests/describes: _; campaign; internal imports: 8; package imports: 3

## `src/app/admin/actions/clients.revalidation.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 7
- Bytes: 126
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
- Lines: 12
- Bytes: 392
- Imports (internal unresolved): src/app/admin/actions/clients.revalidation
- Imports (packages): vitest
- Tests / describe labels: getClientSlugRevalidationPaths, keeps client rename revalidation on surviving admin surfaces
- Contents summary: tests/describes: getClientSlugRevalidationPaths; keeps client rename revalidation on surviving admin surfaces; internal imports: 1; package imports: 1

## `src/app/admin/actions/clients.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 430
- Bytes: 13974
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/app/admin/actions/audit.ts, src/features/access/revalidation.ts
- Imports (internal unresolved): src/app/admin/actions/clients.revalidation
- Imports (packages): next/cache, zod/v4
- Imported by: src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Depends on groups: src/lib, src/app / admin, src/features / access
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/components/admin/clients/client-detail.test.tsx
- Exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole, changeClientMemberScope, updateMemberCampaigns
- Symbol details: function renameClient (exported), function deactivateClient (exported), function bulkDeactivateClients (exported), function createClient (exported), function updateClient (exported), function addClientMember (exported), function removeClientMember (exported), function changeClientMemberRole (exported), function changeClientMemberScope (exported), function updateMemberCampaigns (exported), function getClientAccessContextById, function getClientAccessContextByMemberId, function revalidateClientSlugSurfaces, function renameClientSlugReferences, function pauseCampaignsForClientSlug, const RenameClientSchema, … (+3 more)
- Defines: getClientAccessContextById, getClientAccessContextByMemberId, revalidateClientSlugSurfaces, renameClientSlugReferences, pauseCampaignsForClientSlug, renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, … (+16 more)
- Tests / describe labels: client, client_member
- Contents summary: exports: renameClient, deactivateClient, bulkDeactivateClients, createClient, updateClient, addClientMember, removeClientMember, changeClientMemberRole; tests/describes: client; client_member; internal imports: 7; package imports: 2

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
- Lines: 90
- Bytes: 2179
- Imports (internal): src/app/admin/actions/search.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/app / admin, src/lib
- Defines: queryResult, query, supabaseAdmin, records
- Tests / describe labels: fetchSearchableRecords, surfaces only campaigns and clients
- Contents summary: tests/describes: fetchSearchableRecords; surfaces only campaigns and clients; internal imports: 3; package imports: 1

## `src/app/admin/actions/search.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/actions
- Lines: 58
- Bytes: 1592
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
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/components/admin/users/revoke-invitation-button.test.tsx
- Exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation
- Symbol details: function changeUserRole (exported), function bulkUpdateUserRole (exported), function deleteUser (exported), function revokeInvitation (exported), const ChangeRoleSchema, const BulkUpdateRoleSchema, const DeleteUserSchema, const RevokeInvitationSchema
- Defines: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation, ChangeRoleSchema, err, parsed, client, user, oldRole, BulkUpdateRoleSchema, clerk, … (+8 more)
- Tests / describe labels: user, invitation
- Contents summary: exports: changeUserRole, bulkUpdateUserRole, deleteUser, revokeInvitation; tests/describes: user; invitation; internal imports: 4; package imports: 2

## `src/app/admin/campaigns/[campaignId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/campaigns/[campaignId]
- Lines: 58
- Bytes: 1524
- Imports (internal): src/features/campaigns/server.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/features / campaigns, src/app / admin, src/components / admin
- Symbol details: const getCampaignOperatingData, const data
- Defines: getCampaignOperatingData, data, element
- Tests / describe labels: AdminCampaignDetailPage, renders the campaign detail dashboard
- Contents summary: tests/describes: AdminCampaignDetailPage; renders the campaign detail dashboard; internal imports: 4; package imports: 3

## `src/app/admin/campaigns/[campaignId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/campaigns/[campaignId]
- Lines: 71
- Bytes: 3030
- Imports (internal): src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Imports (packages): next/link, next/navigation, lucide-react
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Depends on groups: src/components / admin, src/features / campaigns, src/lib
- Used by groups: src/app / admin
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Tests related (direct): src/app/admin/campaigns/[campaignId]/page.test.tsx
- Exports: AdminCampaignDetailPage, default
- Symbol details: default function AdminCampaignDetailPage (exported), interface Props
- Defines: AdminCampaignDetailPage, data, statusCfg, Props
- Contents summary: Next.js page for `/admin/campaigns/[campaignId]`; exports: AdminCampaignDetailPage, default; internal imports: 5; package imports: 3

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
- Lines: 76
- Bytes: 2240
- Imports (internal): src/app/admin/campaigns/page.tsx, src/app/admin/campaigns/data.ts, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / admin, src/components / admin
- Tests / describe labels: CampaignsPage, uses direct sync copy in the empty state, flags campaigns that still need explicit client assignment
- Contents summary: tests/describes: CampaignsPage; uses direct sync copy in the empty state; flags campaigns that still need explicit client assignment; internal imports: 5; package imports: 2

## `src/app/admin/campaigns/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/campaigns
- Lines: 140
- Bytes: 6041
- Imports (internal): src/components/ui/card.tsx, src/components/admin/stat-card.tsx, src/app/admin/campaigns/data.ts, src/lib/constants.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/components/admin/page-header.tsx
- Imports (packages): lucide-react, react
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / admin, src/app / admin, src/lib
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: CampaignsPage, default
- Symbol details: default function CampaignsPage (exported), interface Props
- Defines: CampaignsPage, clientSlug, range, totalSpend, totalImpressions, totalClicks, avgRoas, overallCtr, unassignedCampaignCount, metaAdAccountId, hasData, Props
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
- Lines: 217
- Bytes: 6342
- Imports (internal): src/app/admin/clients/data.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/features/invitations/server.ts, src/features/settings/connected-accounts.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/app / admin, src/lib, src/features / invitations, src/features / settings
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, summaries, detail
- Tests / describe labels: admin clients data, returns campaign-focused client summaries without discussion or show totals, returns campaign-focused client detail without discussion or show totals
- Contents summary: tests/describes: admin clients data; returns campaign-focused client summaries without discussion or show totals; returns campaign-focused client detail without discussion or show totals; internal imports: 5; package imports: 2

## `src/app/admin/clients/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/clients
- Lines: 249
- Bytes: 8463
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/features/invitations/server.ts, src/features/settings/connected-accounts.ts, src/app/admin/clients/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/data.test.ts, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-detail.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, … (+1 more)
- Depends on groups: src/lib, src/features / invitations, src/features / settings, src/app / admin
- Used by groups: src/app / admin, src/app / root routes, src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts
- Exports: getClientSummaries, getClientDetail
- Symbol details: function getClientSummaries (exported), function getClientDetail (exported), function fetchMemberAssignments, function enrichMembersWithClerk
- Defines: getClientSummaries, fetchMemberAssignments, enrichMembersWithClerk, getClientDetail, effectiveCampaignRows, slug, connectedAccountsBySlug, accounts, campaigns, totalSpend, totalRevenue, activeCampaigns, … (+11 more)
- Contents summary: exports: getClientSummaries, getClientDetail; internal imports: 6; package imports: 1

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
- Lines: 150
- Bytes: 6516
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/app/admin/clients/data.ts, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/features/clients/summary.ts, src/components/admin/page-header.tsx
- Imports (packages): lucide-react, next/link
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/app / admin, src/lib, src/components / admin, src/features / clients
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: ClientsPage, default
- Symbol details: default function ClientsPage (exported)
- Defines: ClientsPage, clients, totalSpend, totalCampaigns, activeCampaigns, connectionRiskAccounts, blendedRoas, clientsNeedingAttention, attentionClients, stats
- Contents summary: Next.js page for `/admin/clients`; exports: ClientsPage, default; internal imports: 8; package imports: 2

## `src/app/admin/clients/types.ts`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: TypeScript module
- Construction: code module
- Route context: /admin/clients
- Lines: 52
- Bytes: 1024
- Imported by: src/app/admin/clients/data.ts
- Used by groups: src/app / admin
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Exports: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientCampaign
- Symbol details: interface ClientSummary (exported), interface ClientDetail (exported), interface ClientPendingInvite (exported), interface ClientMember (exported), interface ClientCampaign (exported)
- Defines: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientCampaign
- Contents summary: exports: ClientSummary, ClientDetail, ClientPendingInvite, ClientMember, ClientCampaign

## `src/app/admin/dashboard/campaign-cards.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /admin/dashboard
- Lines: 85
- Bytes: 3985
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
- Lines: 79
- Bytes: 2382
- Imports (internal): src/lib/supabase.ts, src/lib/formatters.tsx, src/app/client/[slug]/lib.ts, src/lib/campaign-client-assignment.ts
- Imports (internal unresolved): src/lib/database.types
- Imported by: src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/dashboard/page.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client
- Used by groups: src/app / admin, src/app / root routes
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getData, MetaCampaign, DashboardData
- Symbol details: function getData (exported), type MetaCampaign (exported), interface DashboardData (exported), interface SnapshotRow
- Defines: getData, thirtyDaysAgo, campaigns, snapshots, points, MetaCampaign, SnapshotRow, DashboardData
- Contents summary: exports: getData, MetaCampaign, DashboardData; internal imports: 5

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
- Lines: 20
- Bytes: 564
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
- Lines: 93
- Bytes: 3148
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx, src/components/admin/page-header.tsx
- Imports (packages): lucide-react
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / charts, src/lib, src/components / admin, src/app / admin
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AdminDashboard, default
- Symbol details: default function AdminDashboard (exported)
- Defines: AdminDashboard, totalSpend, totalImpressions, avgRoas, now, heroStats
- Contents summary: Next.js page for `/admin/dashboard`; exports: AdminDashboard, default; internal imports: 8; package imports: 1

## `src/app/admin/events/[eventId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/events/[eventId]
- Lines: 20
- Bytes: 437
- Imports (internal): src/app/admin/events/[eventId]/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / admin
- Tests / describe labels: AdminEventDetailPage, redirects to the dashboard
- Contents summary: tests/describes: AdminEventDetailPage; redirects to the dashboard; internal imports: 1; package imports: 2

## `src/app/admin/events/[eventId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/events/[eventId]
- Lines: 6
- Bytes: 128
- Imports (packages): next/navigation
- Imported by: src/app/admin/events/[eventId]/page.test.tsx
- Used by groups: src/app / admin
- Tests related: src/app/admin/events/[eventId]/page.test.tsx
- Tests related (direct): src/app/admin/events/[eventId]/page.test.tsx
- Exports: AdminEventDetailPage, default
- Symbol details: default function AdminEventDetailPage (exported)
- Defines: AdminEventDetailPage
- Contents summary: Next.js page for `/admin/events/[eventId]`; exports: AdminEventDetailPage, default; package imports: 1

## `src/app/admin/events/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: test file
- Construction: test specification
- Route context: /admin/events
- Lines: 20
- Bytes: 422
- Imports (internal): src/app/admin/events/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / admin
- Tests / describe labels: AdminEventsPage, redirects to the dashboard
- Contents summary: tests/describes: AdminEventsPage; redirects to the dashboard; internal imports: 1; package imports: 2

## `src/app/admin/events/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/events
- Lines: 6
- Bytes: 123
- Imports (packages): next/navigation
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AdminEventsPage, default
- Symbol details: default function AdminEventsPage (exported)
- Defines: AdminEventsPage
- Contents summary: Next.js page for `/admin/events`; exports: AdminEventsPage, default; package imports: 1

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
- Lines: 20
- Bytes: 425
- Imports (internal): src/app/admin/reports/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / admin
- Tests / describe labels: AdminReportsPage, redirects to the dashboard
- Contents summary: tests/describes: AdminReportsPage; redirects to the dashboard; internal imports: 1; package imports: 2

## `src/app/admin/reports/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/reports
- Lines: 6
- Bytes: 124
- Imports (packages): next/navigation
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Used by groups: src/app / admin, src/app / root routes
- Tests related: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AdminReportsPage, default
- Symbol details: default function AdminReportsPage (exported)
- Defines: AdminReportsPage
- Contents summary: Next.js page for `/admin/reports`; exports: AdminReportsPage, default; package imports: 1

## `src/app/admin/settings/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / admin
- Ownership: web admin route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /admin/settings
- Lines: 256
- Bytes: 11351
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/stat-card.tsx, src/features/settings/connected-accounts.ts, src/lib/supabase.ts, src/components/admin/page-header.tsx
- Imports (packages): lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / ui, src/components / admin, src/features / settings, src/lib
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: SettingsPage, default
- Symbol details: default function SettingsPage (exported), function getApiKeyStatus, function formatErrorDate
- Defines: getApiKeyStatus, formatErrorDate, SettingsPage, keys, value, configured, masked, apiKeys, connectedAccountsRes, connectedAccounts, connectionSummary, configuredIntegrationCount, … (+5 more)
- Contents summary: Next.js page for `/admin/settings`; exports: SettingsPage, default; internal imports: 6; package imports: 1

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
- Imported by: src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx
- Depends on groups: src/lib, src/features / invitations
- Used by groups: src/app / admin, src/app / root routes, src/components / admin
- Route owners: src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/users/page.tsx
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
