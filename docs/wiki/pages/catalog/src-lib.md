# src/lib

Generated from the current working tree on 2026-04-28 02:30:43.

- Files: 29
- File kinds: TypeScript module (20), test file (8), React/TSX module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/lib/api-helpers.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 193
- Bytes: 6640
- Imports (internal): src/lib/api-helpers.ts
- Imports (packages): vitest, @clerk/nextjs/server, zod
- Depends on groups: src/lib
- Symbol details: const mockedAuth, const mockedCurrentUser
- Defines: mockedAuth, mockedCurrentUser, res, body, result, originalEnv, request, TestSchema
- Tests / describe labels: apiError, returns JSON response with error message and status, defaults to status 500, authGuard, returns userId when authenticated, returns error response when not authenticated, secretGuard, returns null when secret matches, … (+4 more)
- Contents summary: tests/describes: apiError; returns JSON response with error message and status; defaults to status 500; internal imports: 1; package imports: 3

## `src/lib/api-helpers.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 88
- Bytes: 2900
- Imports (packages): next/server, @clerk/nextjs/server, zod
- Imported by: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/users/[id]/route.ts, … (+7 more)
- Used by groups: src/app / admin, src/app / api, src/lib
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, … (+5 more)
- Routes related (direct): src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts
- Tests related: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/api/contact/route.test.ts, … (+4 more)
- Tests related (direct): src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts
- Exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest
- Symbol details: function apiError (exported), function dbError (exported), function authGuard (exported), function secretGuard (exported), function adminGuard (exported), function parseJsonBody (exported), function validateRequest (exported)
- Defines: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest, caller, meta, role, raw, parsed
- Contents summary: exports: apiError, dbError, authGuard, secretGuard, adminGuard, parseJsonBody, validateRequest; package imports: 3

## `src/lib/api-schemas.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 101
- Bytes: 3634
- Imports (packages): zod
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/route.ts
- Used by groups: Tests / Lib, src/app / admin, src/app / api
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Routes related (direct): src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts
- Tests related: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts
- Exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema, IngestPayload
- Symbol details: const IngestPayloadSchema (exported), const InviteSchema (exported), const CreateClientSchema (exported), const UpdateClientSchema (exported), const AddClientMemberSchema (exported), const RemoveClientMemberSchema (exported), const ChangeClientMemberRoleSchema (exported), const ContactFormSchema (exported), const MetaCampaignSchema, type IngestPayload (exported)
- Defines: MetaCampaignSchema, IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema, IngestPayload
- Contents summary: exports: IngestPayloadSchema, InviteSchema, CreateClientSchema, UpdateClientSchema, AddClientMemberSchema, RemoveClientMemberSchema, ChangeClientMemberRoleSchema, ContactFormSchema; package imports: 1

## `src/lib/campaign-client-assignment.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 175
- Bytes: 4933
- Imports (internal): src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, data, campaigns, row
- Tests / describe labels: campaign client assignment helpers, applies overrides before stored slug and guessed fallback, lists campaigns for a client using effective assignment, checks client ownership against the effective assignment, lists effective campaign ids for a client
- Contents summary: tests/describes: campaign client assignment helpers; applies overrides before stored slug and guessed fallback; lists campaigns for a client using effective assignment; internal imports: 2; package imports: 1

## `src/lib/campaign-client-assignment.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 156
- Bytes: 4816
- Imports (internal): src/lib/client-slug.ts, src/lib/supabase.ts
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/campaigns/server.test.ts, … (+3 more)
- Depends on groups: src/lib
- Used by groups: Tests / App, src/app / admin, src/app / client, src/features / campaigns, src/lib
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, … (+5 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts
- Exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, CampaignClientAssignmentRow
- Symbol details: function getCampaignClientOverrideMap (exported), function resolveEffectiveCampaignClientSlug (exported), function applyEffectiveCampaignClientSlugs (exported), function getEffectiveCampaignRowById (exported), function getEffectiveCampaignClientSlug (exported), function listEffectiveCampaignRowsForClientSlug (exported), function listEffectiveCampaignIdsForClientSlug (exported), function campaignBelongsToClientSlug (exported), function normalizeGuessedClientSlug, interface CampaignClientAssignmentRow (exported)
- Defines: normalizeGuessedClientSlug, getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug, overrides, uniqueCampaignIds, override, … (+8 more)
- Contents summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2

## `src/lib/client-error-reporting.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module, contains `use client`
- Lines: 22
- Bytes: 661
- Imported by: src/app/global-error.tsx, src/components/shared/error-boundary.tsx
- Used by groups: src/app / root routes, src/components / shared
- Exports: reportClientError
- Symbol details: function reportClientError (exported)
- Defines: reportClientError, payload
- Contents summary: contains `use client`; exports: reportClientError

## `src/lib/client-slug.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 19
- Bytes: 689
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts
- Used by groups: Tests / Lib, src/lib
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Tests related: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, … (+6 more)
- Tests related (direct): __tests__/lib/client-slug.test.ts
- Exports: guessClientSlug
- Symbol details: function guessClientSlug (exported)
- Defines: guessClientSlug, lower
- Contents summary: exports: guessClientSlug

## `src/lib/constants.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 96
- Bytes: 2819
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/data.ts, … (+3 more)
- Used by groups: src/app / admin, src/app / client, src/features / client-portal, src/lib
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, … (+5 more)
- Exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS, DateRange, CampaignRangeInput, CampaignRangeSearchParams
- Symbol details: function parseRange (exported), function parseCampaignRange (exported), function parseClientCampaignRange (exported), function getRangeLabel (exported), function getRangeQuery (exported), function isIsoDate, function formatCustomRangeLabel, const META_API_VERSION (exported), const CLIENT_CAMPAIGN_RANGES, type DateRange (exported), type CampaignRangeInput (exported), interface CampaignRangeSearchParams (exported)
- Defines: parseRange, isIsoDate, formatCustomRangeLabel, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, CLIENT_CAMPAIGN_RANGES, start, end, formatter, … (+3 more)
- Contents summary: exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS

## `src/lib/database.types.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 665
- Bytes: 19137
- Exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes
- Symbol details: const Constants (exported), type Json (exported), type Database (exported), type Tables (exported), type TablesInsert (exported), type TablesUpdate (exported), type Enums (exported), type CompositeTypes (exported), type DatabaseWithoutInternals, type DefaultSchema
- Defines: Constants, Json, Database, DatabaseWithoutInternals, DefaultSchema, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes
- Contents summary: exports: Constants, Json, Database, Tables, TablesInsert, TablesUpdate, Enums, CompositeTypes

## `src/lib/env.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 85
- Bytes: 3644
- Imports (packages): zod
- Imported by: src/instrumentation.ts
- Used by groups: src / Root
- Symbol details: function validateEnv, const serverSchema, const publicSchema
- Defines: validateEnv, serverSchema, publicSchema, publicResult, missing, serverResult
- Contents summary: package imports: 1

## `src/lib/export-csv.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 42
- Bytes: 1100
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/user-table.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: exportToCsv, todayFilename
- Symbol details: function exportToCsv (exported), function todayFilename (exported), function sanitize, type CsvColumn
- Defines: sanitize, exportToCsv, todayFilename, headers, csvRows, csv, blob, url, a, d, CsvColumn
- Tests / describe labels: T
- Contents summary: exports: exportToCsv, todayFilename; tests/describes: T

## `src/lib/formatters.tsx`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 189
- Bytes: 7642
- Imports (internal): src/features/invitations/types.ts, src/lib/status.ts
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, … (+24 more)
- Depends on groups: src/features / invitations, src/lib
- Used by groups: Tests / Lib, src/app / admin, src/app / client, src/components / admin, src/components / client, src/features / client-portal, src/lib
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+1 more)
- Tests related: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, … (+9 more)
- Tests related (direct): __tests__/lib/formatters.test.ts
- Exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, … (+3 more)
- Symbol details: function centsToUsd (exported), function fmtUsd (exported), function fmtNum (exported), function fmtDate (exported), function fmtTodayLong (exported), function slugToLabel (exported), function getInvitationStatusCfg (exported), function timeAgo (exported), function roasColor (exported), function fmtObjective (exported), function computeMarginalRoas (exported), function computeBlendedRoas (exported), function statusBadge (exported), function describeCount (exported), const CAMPAIGN_STATUSES, interface MarginalRoasPoint (exported), … (+1 more)
- Defines: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo, roasColor, fmtObjective, computeMarginalRoas, computeBlendedRoas, … (+13 more)
- Tests / describe labels: _
- Contents summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2

## `src/lib/google-ads.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 158
- Bytes: 4976
- Imports (internal): src/lib/google-ads.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result, fetchMock
- Tests / describe labels: normalizeGoogleAdsCustomerId, strips resource prefixes and dashes, googleAdsSearchStreamUrl, builds the searchStream endpoint for a customer, flattenGoogleAdsSearchStream, flattens chunked rows and preserves metadata, refreshGoogleAdsAccessToken, refreshes an access token from OAuth, … (+3 more)
- Contents summary: tests/describes: normalizeGoogleAdsCustomerId; strips resource prefixes and dashes; googleAdsSearchStreamUrl; internal imports: 1; package imports: 1

## `src/lib/google-ads.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 489
- Bytes: 15372
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts
- Used by groups: src/lib, src / scripts
- Tests related: src/lib/google-ads.test.ts
- Tests related (direct): src/lib/google-ads.test.ts
- Exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION, GoogleAdsApiError, GoogleAdsCredentials, GoogleAdsAccessToken, GoogleAdsSearchStreamChunk, … (+6 more)
- Symbol details: function normalizeGoogleAdsCustomerId (exported), function googleAdsSearchStreamUrl (exported), function getGoogleAdsCredentials (exported), function refreshGoogleAdsAccessToken (exported), function flattenGoogleAdsSearchStream (exported), function googleAdsSearchStream (exported), function fetchGoogleAdsFirstReadSnapshot (exported), function mapGoogleAdsCustomer, function mapGoogleAdsChildAccount, function mapGoogleAdsCampaign, function toNumber, function getGoogleAdsErrorMessage, function parseJsonResponse, const GOOGLE_ADS_API_VERSION (exported), class GoogleAdsApiError (exported), interface GoogleAdsCredentials (exported), … (+8 more)
- Defines: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, mapGoogleAdsCustomer, mapGoogleAdsChildAccount, mapGoogleAdsCampaign, toNumber, getGoogleAdsErrorMessage, … (+46 more)
- Contents summary: exports: normalizeGoogleAdsCustomerId, googleAdsSearchStreamUrl, getGoogleAdsCredentials, refreshGoogleAdsAccessToken, flattenGoogleAdsSearchStream, googleAdsSearchStream, fetchGoogleAdsFirstReadSnapshot, GOOGLE_ADS_API_VERSION

## `src/lib/member-access.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 89
- Bytes: 2233
- Imports (internal): src/lib/supabase.ts
- Imports (packages): react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/scope.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/entry-accept.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Tests related (direct): src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- Exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess
- Symbol details: function getMemberships (exported), const getMemberAccessForSlug (exported), interface ScopeFilter (exported), interface MemberAccess (exported), interface ScopedAccess (exported)
- Defines: getMemberships, client, getMemberAccessForSlug, campaignsRes, ScopeFilter, MemberAccess, ScopedAccess
- Contents summary: exports: getMemberships, getMemberAccessForSlug, ScopeFilter, MemberAccess, ScopedAccess; internal imports: 1; package imports: 1

## `src/lib/meta-api.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 125
- Bytes: 3870
- Imports (internal): src/lib/meta-api.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: url, result
- Tests / describe labels: metaInsightsUrl, builds URL with fields and token, includes optional params, prefers explicit time_range over date_preset when provided, metaUrl, builds a URL with path and token, fetchMetaApi, returns parsed JSON on success, … (+4 more)
- Contents summary: tests/describes: metaInsightsUrl; builds URL with fields and token; includes optional params; internal imports: 1; package imports: 1

## `src/lib/meta-api.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 118
- Bytes: 3608
- Imports (internal): src/lib/constants.ts
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts
- Depends on groups: src/lib
- Used by groups: Tests / App, src/app / client, src/lib
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+1 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts
- Exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange
- Symbol details: function fetchMetaApi (exported), function metaGet (exported), function metaInsightsUrl (exported), function metaUrl (exported), class MetaApiError (exported), type MetaInsightsTimeRange (exported)
- Defines: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, parsed, res, err, message, json, url, MetaApiError, MetaInsightsTimeRange
- Contents summary: exports: fetchMetaApi, metaGet, metaInsightsUrl, metaUrl, MetaApiError, MetaInsightsTimeRange; internal imports: 1

## `src/lib/meta-campaigns.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 202
- Bytes: 5454
- Imports (internal): src/lib/meta-campaigns.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: originalEnv, fetchMock, url, result
- Tests / describe labels: fetchAllCampaigns, fetches one live campaign for detail-page fallback, still returns Meta campaigns when optional Supabase enrichment is unavailable
- Contents summary: tests/describes: fetchAllCampaigns; fetches one live campaign for detail-page fallback; still returns Meta campaigns when optional Supabase enrichment is unavailable; internal imports: 2; package imports: 1

## `src/lib/meta-campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 413
- Bytes: 13052
- Imports (internal): src/lib/constants.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/meta-api.ts, src/lib/supabase.ts
- Imported by: src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/lib/meta-campaigns.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / campaigns, src/lib
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx
- Tests related: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Tests related (direct): src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts
- Exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult
- Symbol details: function fetchCampaignById (exported), function fetchAllCampaigns (exported), function getCredentials, function fetchAllPages, function loadCampaignTypes, function loadAllClientSlugs, function readOptionalSupabaseData, function safeParseFloat, function getPurchaseRoas, function toCampaignCard, function fetchMetaJson, function buildCampaignFilter, function buildInsightsUrl, interface MetaCampaignCard (exported), interface DailyInsight (exported), interface MetaCampaignsResult (exported), … (+4 more)
- Defines: getCredentials, fetchAllPages, loadCampaignTypes, loadAllClientSlugs, readOptionalSupabaseData, safeParseFloat, getPurchaseRoas, toCampaignCard, fetchMetaJson, buildCampaignFilter, buildInsightsUrl, fetchCampaignById, … (+40 more)
- Contents summary: exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5

## `src/lib/meta-oauth.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 37
- Bytes: 1219
- Imports (internal): src/lib/meta-oauth.ts
- Imports (packages): vitest, node:crypto
- Depends on groups: src/lib
- Defines: crypto, payload, encodedPayload, sig, encodedSig, signedRequest, result
- Tests / describe labels: meta-oauth, verifySignedRequest validates HMAC signature, verifySignedRequest rejects tampered payload
- Contents summary: tests/describes: meta-oauth; verifySignedRequest validates HMAC signature; verifySignedRequest rejects tampered payload; internal imports: 1; package imports: 2

## `src/lib/meta-oauth.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 30
- Bytes: 924
- Imports (packages): node:crypto
- Imported by: src/app/api/meta/data-deletion/route.ts, src/lib/meta-oauth.test.ts
- Used by groups: src/app / api, src/lib
- Route owners: src/app/api/meta/data-deletion/route.ts
- Routes related (direct): src/app/api/meta/data-deletion/route.ts
- Tests related: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Tests related (direct): src/lib/meta-oauth.test.ts
- Exports: verifySignedRequest
- Symbol details: function verifySignedRequest (exported), function getAppSecret
- Defines: getAppSecret, verifySignedRequest, secret, expectedSig, actualSig
- Tests / describe labels: .
- Contents summary: exports: verifySignedRequest; tests/describes: .; package imports: 1

## `src/lib/shopify-admin.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 89
- Bytes: 2333
- Imports (internal): src/lib/shopify-admin.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Defines: result
- Tests / describe labels: getShopifyAdminCredentials, reads Shopify credentials from env, throws when required env is missing, shopifyAdminGraphql, posts a graphql query and returns the data payload, throws ShopifyAdminApiError when graphql returns top-level errors
- Contents summary: tests/describes: getShopifyAdminCredentials; reads Shopify credentials from env; throws when required env is missing; internal imports: 1; package imports: 1

## `src/lib/shopify-admin.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 268
- Bytes: 7077
- Imported by: src/lib/shopify-admin.test.ts
- Used by groups: src/lib
- Tests related: src/lib/shopify-admin.test.ts
- Tests related (direct): src/lib/shopify-admin.test.ts
- Exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot
- Symbol details: function getShopifyAdminCredentials (exported), function shopifyAdminGraphql (exported), function fetchShopifyFirstReadSnapshot (exported), const SHOPIFY_ADMIN_DEFAULT_API_VERSION (exported), class ShopifyAdminApiError (exported), interface ShopifyAdminCredentials (exported), interface ShopifyFirstReadSnapshot (exported), interface ShopifyGraphqlEnvelope, interface ShopifyFirstReadQueryResult
- Defines: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, storeDomain, accessToken, apiVersion, missing, credentials, response, body, data, … (+5 more)
- Contents summary: exports: getShopifyAdminCredentials, shopifyAdminGraphql, fetchShopifyFirstReadSnapshot, SHOPIFY_ADMIN_DEFAULT_API_VERSION, ShopifyAdminApiError, ShopifyAdminCredentials, ShopifyFirstReadSnapshot

## `src/lib/status.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 33
- Bytes: 1025
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx
- Used by groups: src/app / admin, src/app / client, src/features / client-portal, src/lib
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, … (+9 more)
- Exports: getCampaignStatusCfg, getGenericStatusCfg
- Symbol details: function getCampaignStatusCfg (exported), function getGenericStatusCfg (exported), type CampaignStatus
- Defines: getCampaignStatusCfg, getGenericStatusCfg, key, CampaignStatus
- Contents summary: exports: getCampaignStatusCfg, getGenericStatusCfg

## `src/lib/supabase.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 76
- Bytes: 2467
- Imports (packages): react, @clerk/nextjs/server, @supabase/supabase-js
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/admin/clients/data.test.ts, … (+32 more)
- Used by groups: Tests / App, Tests / Features, Tests / Root, src/app / admin, src/app / api, src/app / client, src/features / campaigns, src/features / client-portal, src/features / invitations, src/features / system-events, … (+1 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, … (+13 more)
- Routes related (direct): src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, … (+1 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, … (+22 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, … (+7 more)
- Exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin
- Symbol details: function createClerkSupabaseClient (exported), function getFeatureReadClient (exported), const supabaseAdmin (exported), const getCachedUser, const url, const anonKey, const serviceKey
- Defines: createClerkSupabaseClient, getFeatureReadClient, getCachedUser, url, anonKey, serviceKey, supabaseAdmin, user, role
- Contents summary: exports: createClerkSupabaseClient, getFeatureReadClient, supabaseAdmin; package imports: 3

## `src/lib/text-utils.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 11
- Bytes: 396
- Exports: excerpt
- Symbol details: function excerpt (exported)
- Defines: excerpt, normalized
- Contents summary: exports: excerpt

## `src/lib/to-slug.test.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: test file
- Construction: test specification
- Lines: 33
- Bytes: 925
- Imports (internal): src/lib/to-slug.ts
- Imports (packages): vitest
- Depends on groups: src/lib
- Tests / describe labels: toSlug, converts a simple name to lowercase underscore slug, handles multiple spaces and special characters, strips leading and trailing underscores, returns empty string for empty input, preserves numbers, handles single word, collapses consecutive separators into one underscore
- Contents summary: tests/describes: toSlug; converts a simple name to lowercase underscore slug; handles multiple spaces and special characters; internal imports: 1; package imports: 1

## `src/lib/to-slug.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 9
- Bytes: 228
- Imported by: src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts
- Used by groups: src/components / admin, src/lib
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/lib/to-slug.test.ts
- Exports: toSlug
- Symbol details: function toSlug (exported)
- Defines: toSlug
- Contents summary: exports: toSlug

## `src/lib/utils.ts`
- Status: tracked-clean
- System: web
- Group: src/lib
- Ownership: shared web library
- Type: TypeScript module
- Construction: code module
- Lines: 7
- Bytes: 166
- Imports (packages): clsx, tailwind-merge
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/landing/sample-metric-card.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/command.tsx, src/components/ui/dialog.tsx, … (+6 more)
- Used by groups: src/components / admin, src/components / landing, src/components / ui
- Route owners: src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/admin/campaigns/loading.tsx, … (+10 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Exports: cn
- Symbol details: function cn (exported)
- Defines: cn
- Contents summary: exports: cn; package imports: 2
