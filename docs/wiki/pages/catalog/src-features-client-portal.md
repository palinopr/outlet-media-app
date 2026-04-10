# src/features / client-portal

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 13
- File kinds: TypeScript module (9), test file (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/client-portal/access.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: test file
- Construction: test specification
- Lines: 335
- Bytes: 10464
- Imports (internal): src/lib/member-access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/access.ts
- Imports (packages): vitest, @clerk/nextjs/server, next/navigation
- Depends on groups: src/lib, src/features / client-portal
- Feature module: client-portal
- Symbol details: const mockedAuth, const mockedCurrentUser, const mockedGetMemberAccessForSlug, const mockedGetClientPortalConfig, const mockedResolveClientPortalEntry
- Defines: mockedAuth, mockedCurrentUser, mockedGetMemberAccessForSlug, mockedGetClientPortalConfig, mockedResolveClientPortalEntry, result
- Tests / describe labels: requireClientAccess, allows admins to preview client portal routes without membership, returns assigned scope for scoped client members, redirects members without a valid invite or membership to the pending page, allows event routes when the client has events enabled, allows agent routes when the client has agent access enabled, redirects event routes when events are disabled for the client, redirects agent routes when agent access is disabled for the client, … (+2 more)
- Contents summary: tests/describes: requireClientAccess; allows admins to preview client portal routes without membership; returns assigned scope for scoped client members; internal imports: 4; package imports: 3

## `src/features/client-portal/access.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 193
- Bytes: 5125
- Imports (internal): src/lib/member-access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- Imports (packages): @clerk/nextjs/server, next/navigation
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+4 more)
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: src/app / client, src/features / client-agent, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+1 more)
- Routes related (direct): src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/reports/page.tsx
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts, … (+3 more)
- Tests related (direct): src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts
- Exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi
- Symbol details: function resolveClientPortalAccess (exported), function requireClientAccess (exported), function requireClientAgentAccess (exported), function requireClientEventsAccess (exported), function requireClientReportsAccess (exported), function resolveClientAgentAccessForApi (exported), function isAdminPortalViewer, function requireResolvedClientAccess, function resolveClientPortalFeatureAccess, type Viewer, type PortalAccessAllowed, type PortalAccessRedirect, type PortalAccessResolution
- Defines: isAdminPortalViewer, resolveClientPortalAccess, requireResolvedClientAccess, resolveClientPortalFeatureAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi, user, meta, entry, … (+8 more)
- Contents summary: exports: resolveClientPortalAccess, requireClientAccess, requireClientAgentAccess, requireClientEventsAccess, requireClientReportsAccess, resolveClientAgentAccessForApi; internal imports: 3; package imports: 2

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
- Imported by: src/features/client-agent/readers.ts
- Depends on groups: src/app / client
- Used by groups: src/features / client-agent
- Feature module: client-portal
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
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
- Lines: 49
- Bytes: 1212
- Imports (internal): src/features/client-portal/config.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/features / client-portal, src/lib
- Feature module: client-portal
- Symbol details: const maybeSingle, const eq, const select
- Defines: maybeSingle, eq, select, config
- Tests / describe labels: getClientPortalConfig, returns the expanded portal config shape from the clients table
- Contents summary: tests/describes: getClientPortalConfig; returns the expanded portal config shape from the clients table; internal imports: 2; package imports: 1

## `src/features/client-portal/config.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 62
- Bytes: 1756
- Imports (internal): src/lib/supabase.ts
- Imports (packages): react, @clerk/nextjs/server
- Imported by: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/config.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/features / client-agent, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+2 more)
- Routes related (direct): src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, … (+5 more)
- Tests related (direct): src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts
- Exports: getClientPortalConfig, ClientPortalConfig
- Symbol details: const getClientPortalConfig (exported), interface ClientPortalConfig (exported)
- Defines: getClientPortalConfig, user, role, clerkDb, ClientPortalConfig
- Contents summary: exports: getClientPortalConfig, ClientPortalConfig; internal imports: 1; package imports: 2

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
- Lines: 265
- Bytes: 7122
- Imports (internal): src/lib/supabase.ts, src/lib/member-access.ts
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/app / root routes, src/features / client-portal
- Feature module: client-portal
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx, … (+4 more)
- Routes related (direct): src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Tests related: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, … (+5 more)
- Tests related (direct): src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- Exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput
- Symbol details: function resolveClientPortalEntry (exported), function listPendingClientAccessInvites (exported), function acceptClientAccessInvite (exported), function getUserEmailAddresses (exported), function normalizeEmails, function normalizeClientSlug, function normalizeClient, type ClientPortalEntry (exported), interface PendingClientAccessInvite (exported), interface ResolveClientPortalEntryInput (exported), interface ResolveClientPortalEntryDeps
- Defines: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, normalizeEmails, normalizeClientSlug, normalizeClient, memberships, preferredMembership, pendingInvites, normalizedEmails, client, … (+7 more)
- Contents summary: exports: resolveClientPortalEntry, listPendingClientAccessInvites, acceptClientAccessInvite, getUserEmailAddresses, ClientPortalEntry, PendingClientAccessInvite, ResolveClientPortalEntryInput; internal imports: 2

## `src/features/client-portal/event-detail.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 2
- Bytes: 75
- Imports (internal): src/app/client/[slug]/event/[eventId]/data.ts
- Imported by: src/features/client-agent/readers.ts
- Depends on groups: src/app / client
- Used by groups: src/features / client-agent
- Feature module: client-portal
- Route owners: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Tests related: src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/model.test.ts, src/features/client-agent/server.test.ts, … (+4 more)
- Exports: getEventDetail
- Contents summary: exports: getEventDetail; internal imports: 1

## `src/features/client-portal/insights.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 614
- Bytes: 23531
- Imports (internal): src/lib/formatters.tsx, src/features/client-portal/types.ts, src/lib/constants.ts, src/lib/status.ts
- Imported by: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/lib.ts, src/features/reports/server.ts
- Depends on groups: src/lib, src/features / client-portal
- Used by groups: Tests / Features, src/app / client, src/features / reports
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: __tests__/features/reports/integration.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, … (+19 more)
- Tests related (direct): __tests__/features/reports/integration.test.ts
- Exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights, findBestHour, summarizeDayOfWeekPerformance, findBestDayOfWeek, findTopMarket, … (+6 more)
- Symbol details: function buildTrendData (exported), function buildEventCard (exported), function computeDailyDeltas (exported), function getDaysUntilEvent (exported), function computeVelocity (exported), function roasLabel (exported), function buildAudienceProfile (exported), function generateCampaignInsights (exported), function findBestHour (exported), function summarizeDayOfWeekPerformance (exported), function findBestDayOfWeek (exported), function findTopMarket (exported), function findTopCreative (exported), function generateRecommendations (exported), function detectPlatform, function sliceRate, … (+6 more)
- Defines: buildTrendData, detectPlatform, buildEventCard, computeDailyDeltas, sliceRate, computeTrendRate, getDaysUntilEvent, computeVelocity, roasLabel, weightedAvg, buildAudienceProfile, generateCampaignInsights, … (+66 more)
- Contents summary: exports: buildTrendData, buildEventCard, computeDailyDeltas, getDaysUntilEvent, computeVelocity, roasLabel, buildAudienceProfile, generateCampaignInsights; internal imports: 4

## `src/features/client-portal/scope.ts`
- Status: tracked-clean
- System: web
- Group: src/features / client-portal
- Ownership: feature module: client-portal
- Type: TypeScript module
- Construction: code module
- Lines: 18
- Bytes: 451
- Imports (internal): src/lib/member-access.ts
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/features/campaigns/client-operating.ts
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / api, src/app / client, src/features / campaigns
- Feature module: client-portal
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/api/campaign-comments/route.ts
- Tests related: __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, … (+11 more)
- Tests related (direct): __tests__/features/client-portal/scope.test.ts, src/app/api/campaign-comments/route.test.ts
- Exports: allowsCampaignInScope, allowsEventInScope
- Symbol details: function allowsCampaignInScope (exported), function allowsEventInScope (exported)
- Defines: allowsCampaignInScope, allowsEventInScope
- Contents summary: exports: allowsCampaignInScope, allowsEventInScope; internal imports: 1

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
- Lines: 221
- Bytes: 5008
- Imports (internal unresolved): src/lib/database.types
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts, src/features/reports/server.ts
- Used by groups: src/app / client, src/features / client-portal, src/features / reports
- Feature module: client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/dashboard/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Tests related: src/app/client/[slug]/lib.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, … (+19 more)
- Exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, … (+10 more)
- Symbol details: const DAY_LABELS (exported), type TmEvent (exported), type DemographicsRow (exported), type TicketPlatform (exported), interface CampaignCard (exported), interface HeroStats (exported), interface EventCard (exported), interface AudienceProfile (exported), interface Insight (exported), interface AgeGenderBreakdown (exported), interface PlacementBreakdown (exported), interface AdCard (exported), interface HourlyBreakdown (exported), interface DailyPoint (exported), interface GeographyBreakdown (exported), interface Recommendation (exported), … (+6 more)
- Defines: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile, Insight, AgeGenderBreakdown, PlacementBreakdown, AdCard, … (+10 more)
- Contents summary: exports: DAY_LABELS, TmEvent, DemographicsRow, TicketPlatform, CampaignCard, HeroStats, EventCard, AudienceProfile; internal imports: 1
