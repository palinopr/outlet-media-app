# src/features / client-portal

Generated from the current working tree on 2026-04-28 02:32:49.

- Files: 13
- File kinds: TypeScript module (8), test file (5)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/client-portal/access.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 96
- Bytes: 3128
- Imports (internal): src/lib/member-access.ts, src/features/client-portal/entry.ts, src/features/client-portal/access.ts
- Imports (packages): vitest, @clerk/nextjs/server, next/navigation
- Depends on groups: src/lib, src/features / client-portal
- Feature module: client-portal
- Symbol details: const mockedAuth, const mockedCurrentUser, const mockedGetMemberAccessForSlug, const mockedResolveClientPortalEntry
- Defines: mockedAuth, mockedCurrentUser, mockedGetMemberAccessForSlug, mockedResolveClientPortalEntry, result
- Tests / describe labels: requireClientAccess, allows admins to preview client portal routes without membership, returns assigned scope for scoped client members, redirects members without a valid invite or membership to the pending page
- Contents summary: tests/describes: requireClientAccess; allows admins to preview client portal routes without membership; returns assigned scope for scoped client members; internal imports: 3; package imports: 3

## `src/features/client-portal/access.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 108
- Bytes: 2835
- Imports (internal): src/lib/member-access.ts, src/features/client-portal/entry.ts
- Imports (packages): @clerk/nextjs/server, next/navigation
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/features/client-portal/access.test.ts
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts
- Exports: resolveClientPortalAccess, requireClientAccess
- Symbol details: function resolveClientPortalAccess (exported), function requireClientAccess (exported), function isAdminPortalViewer, function requireResolvedClientAccess, type Viewer, type PortalAccessAllowed, type PortalAccessRedirect, type PortalAccessResolution
- Defines: isAdminPortalViewer, resolveClientPortalAccess, requireResolvedClientAccess, requireClientAccess, user, meta, entry, access, scope, Viewer, PortalAccessAllowed, PortalAccessRedirect, … (+1 more)
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess; internal imports: 2; package imports: 2

## `src/features/client-portal/campaign-detail.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 5
- Bytes: 120
- Imports (internal): src/app/client/[slug]/campaign/[campaignId]/data.ts
- Depends on groups: src/app / client
- Feature module: client-portal
- Exports: getCampaignDetail, type CampaignDetailRangeInput
- Defines: CampaignDetailRangeInput
- Contents summary: exports: getCampaignDetail, type CampaignDetailRangeInput; internal imports: 1

## `src/features/client-portal/config.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 43
- Bytes: 1035
- Imports (internal): src/features/client-portal/config.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal, src/lib
- Feature module: client-portal
- Symbol details: const maybeSingle, const eq, const select
- Defines: maybeSingle, eq, select, config
- Tests / describe labels: getClientPortalConfig, returns the portal branding config from the clients table
- Contents summary: tests/describes: getClientPortalConfig; returns the portal branding config from the clients table; internal imports: 2; package imports: 1

## `src/features/client-portal/config.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 54
- Bytes: 1461
- Imports (internal): src/lib/supabase.ts
- Imports (packages): react, @clerk/nextjs/server
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/config.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/layout.tsx
- Routes related (direct): src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts
- Exports: getClientPortalConfig, ClientPortalConfig
- Symbol details: const getClientPortalConfig (exported), interface ClientPortalConfig (exported)
- Defines: getClientPortalConfig, user, role, clerkDb, ClientPortalConfig
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

## `src/features/client-portal/entry-accept.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 118
- Bytes: 3224
- Imports (internal): src/features/client-portal/entry.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal, src/lib
- Feature module: client-portal
- Defines: clientAccessInvitesQuery, clientMembersQuery, state, supabaseAdmin, result
- Tests / describe labels: acceptClientAccessInvite, preserves an existing member row so assigned campaigns and events stay attached, creates a member row when the invitee has not been assigned yet
- Contents summary: tests/describes: acceptClientAccessInvite; preserves an existing member row so assigned campaigns and events stay attached; creates a member row when the invitee has not been assigned yet; internal imports: 2; package imports: 1

## `src/features/client-portal/entry.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 102
- Bytes: 2762
- Imports (internal): src/lib/member-access.ts, src/features/client-portal/entry.ts
- Imports (packages): vitest
- Depends on groups: src/lib, src/features / client-portal
- Feature module: client-portal
- Symbol details: const member
- Defines: member, result, acceptClientAccessInvite, getMemberships, pendingInvites
- Tests / describe labels: resolveClientPortalEntry, routes admins into the admin dashboard immediately, accepts an invite id before computing the final portal destination, falls back to the pending state when the user has no memberships but still has an invite
- Contents summary: tests/describes: resolveClientPortalEntry; routes admins into the admin dashboard immediately; accepts an invite id before computing the final portal destination; internal imports: 2; package imports: 1

## `src/features/client-portal/entry.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 285
- Bytes: 7741
- Imports (internal): src/lib/supabase.ts, src/lib/member-access.ts
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/app / root routes, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx
- Tests related (direct): src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts
- Exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- Symbol details: function resolveClientPortalEntry (exported), function listPendingClientAccessInvites (exported), function acceptClientAccessInvite (exported), function getUserEmailAddresses (exported), function normalizeEmails, function normalizeClientSlug, function normalizeClient, type ClientPortalEntry (exported), interface PendingClientAccessInvite (exported), interface ResolveClientPortalEntryInput (exported), interface ResolveClientPortalEntryDeps
- Defines: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, normalizeEmails, normalizeClientSlug, normalizeClient, memberships, preferredMembership, pendingInvites, normalizedEmails, client, … (+9 more)
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

## `src/features/client-portal/insights.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 457
- Bytes: 17510
- Imports (internal): src/lib/formatters.tsx, src/features/client-portal/types.ts, src/lib/constants.ts, src/lib/status.ts
- Imported by: src/app/client/[slug]/lib.ts
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, DATE_OPTIONS, TrendPoint, getCampaignStatusCfg
- Symbol details: function buildTrendData (exported), function roasLabel (exported), function generateCampaignInsights (exported), function findBestHour (exported), function summarizeDayOfWeekPerformance (exported), function findBestDayOfWeek (exported), function findTopMarket (exported), function findTopCreative (exported), function generateRecommendations (exported), function formatHour, function formatWeekday, interface TrendPoint (exported), interface DayOfWeekPerformance
- Defines: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative, generateRecommendations, formatHour, formatWeekday, date, … (+38 more)
- Contents summary: exports: buildTrendData, roasLabel, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, findTopCreative; internal imports: 4

## `src/features/client-portal/scope.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 10
- Bytes: 261
- Imports (internal): src/lib/member-access.ts
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / client
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: __tests__/features/client-portal/scope.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/client-portal/scope.test.ts
- Exports: allowsCampaignInScope
- Symbol details: function allowsCampaignInScope (exported)
- Defines: allowsCampaignInScope
- Contents summary: exports: allowsCampaignInScope; internal imports: 1

## `src/features/client-portal/theme.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 31
- Bytes: 1087
- Imports (internal): src/features/client-portal/theme.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal
- Feature module: client-portal
- Defines: theme
- Tests / describe labels: getClientPortalTheme, returns the homebuyer readiness branding for known aliases, falls back to the default outlet portal theme, lets the database branding override the slug defaults
- Contents summary: tests/describes: getClientPortalTheme; returns the homebuyer readiness branding for known aliases; falls back to the default outlet portal theme; internal imports: 1; package imports: 1

## `src/features/client-portal/theme.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 97
- Bytes: 3138
- Imports (packages): react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/theme.test.ts
- Used by groups: src/app / client, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Tests related (direct): src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts
- Exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides
- Symbol details: function getClientPortalTheme (exported), function createTheme, const DEFAULT_THEME, const HOMEBUYER_ALIASES, const HOMEBUYER_THEME, interface ClientPortalTheme (exported), interface ClientPortalThemeOverrides (exported)
- Defines: getClientPortalTheme, createTheme, DEFAULT_THEME, HOMEBUYER_ALIASES, HOMEBUYER_THEME, normalized, baseTheme, brandBadge, brandLogoSrc, brandLogoAlt, ClientPortalTheme, ClientPortalThemeOverrides
- Contents summary: exports: getClientPortalTheme, ClientPortalTheme, ClientPortalThemeOverrides; package imports: 1

## `src/features/client-portal/types.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 119
- Bytes: 2410
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts
- Used by groups: src/app / client, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Tests related: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, CampaignDetailData
- Symbol details: const DAY_LABELS (exported), interface CampaignCard (exported), interface HeroStats (exported), interface Insight (exported), interface AgeGenderBreakdown (exported), interface PlacementBreakdown (exported), interface AdCard (exported), interface HourlyBreakdown (exported), interface DailyPoint (exported), interface GeographyBreakdown (exported), interface Recommendation (exported), interface CampaignDetailData (exported)
- Defines: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown, DailyPoint, GeographyBreakdown, Recommendation, CampaignDetailData
- Contents summary: exports: DAY_LABELS, CampaignCard, HeroStats, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, HourlyBreakdown
