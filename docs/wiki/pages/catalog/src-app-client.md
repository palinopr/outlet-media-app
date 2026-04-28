# src/app / client

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 39
- File kinds: React/TSX module (12), test file (9), Next.js page (8), TypeScript module (5), Next.js loading UI (3), Next.js layout (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]/campaign/[campaignId]
- Lines: 686
- Bytes: 19612
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-api.ts, src/features/client-portal/scope.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/client-portal/campaign-detail.ts
- Depends on groups: src/lib, src/features / client-portal, src/app / client
- Used by groups: Tests / App, src/app / client, src/features / client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts
- Exports: getCampaignDetail, CampaignDetailRangeInput
- Symbol details: function getCampaignDetail (exported), function getMetaCreds, function isExplicitRange, function toInsightsWindow, function toRangeLabel, function buildAdsInsightsField, function campaignRowFromMetaInfo, function getMetaCampaignFallbackRow, function extractPurchaseMetric, function deriveRevenue, function fetchCampaignOverview, function fetchAgeGender, function fetchPlacements, function formatPlatform, function formatPosition, function fetchHourly, … (+8 more)
- Defines: getMetaCreds, isExplicitRange, toInsightsWindow, toRangeLabel, buildAdsInsightsField, campaignRowFromMetaInfo, getMetaCampaignFallbackRow, extractPurchaseMetric, deriveRevenue, fetchCampaignOverview, fetchAgeGender, fetchPlacements, … (+46 more)
- Contents summary: exports: getCampaignDetail, CampaignDetailRangeInput; internal imports: 9; package imports: 1

## `src/app/client/[slug]/campaign/[campaignId]/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/campaign/[campaignId]
- Lines: 3
- Bytes: 76
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]/campaign/[campaignId]
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/campaign/[campaignId]`; exports: default; internal imports: 1

## `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/campaign/[campaignId]
- Lines: 447
- Bytes: 13338
- Imports (internal): src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/app/client/[slug]/lib.ts
- Imports (packages): next/link, react, lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client, src/components / client, src/features / client-portal
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: CampaignDetailPage, default
- Symbol details: default function CampaignDetailPage (exported), function MetricCard, function SnapshotCard, function FallbackCard, function DashboardSection, function getDaysLive, function formatHour, function formatDay, interface Props
- Defines: CampaignDetailPage, MetricCard, SnapshotCard, FallbackCard, DashboardSection, getDaysLive, formatHour, formatDay, rawSearchParams, range, data, theme, … (+21 more)
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 10; package imports: 3

## `src/app/client/[slug]/campaigns/campaign-range-filter.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/campaigns
- Lines: 102
- Bytes: 3429
- Imports (internal): src/lib/constants.ts
- Imports (packages): react, next/navigation
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: CampaignRangeFilter
- Symbol details: function CampaignRangeFilter (exported), function todayIso, function weekAgoIso
- Defines: todayIso, weekAgoIso, CampaignRangeFilter, date, router, isCustom, activeRange, customHref
- Contents summary: contains `use client`; exports: CampaignRangeFilter; internal imports: 1; package imports: 2

## `src/app/client/[slug]/campaigns/campaigns-table.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/campaigns
- Lines: 62
- Bytes: 1752
- Imports (internal): src/app/client/[slug]/types.ts, src/app/client/[slug]/campaigns/campaigns-table.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/app / client
- Symbol details: const push
- Defines: push
- Tests / describe labels: CampaignsTable, keeps the selected 7-day list range when opening campaign detail, keeps a custom list range when opening campaign detail
- Contents summary: tests/describes: CampaignsTable; keeps the selected 7-day list range when opening campaign detail; keeps a custom list range when opening campaign detail; internal imports: 2; package imports: 3

## `src/app/client/[slug]/campaigns/campaigns-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/campaigns
- Lines: 240
- Bytes: 11356
- Imports (internal): src/lib/formatters.tsx, src/lib/status.ts, src/app/client/[slug]/types.ts, src/lib/constants.ts
- Imports (packages): react, next/navigation, next/link, lucide-react
- Imported by: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/lib, src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx
- Exports: CampaignsTable
- Symbol details: function CampaignsTable (exported)
- Defines: CampaignsTable, router, campaignDetailHref, queryLower, filtered, hasRevenue, statusCfg
- Contents summary: contains `use client`; exports: CampaignsTable; internal imports: 4; package imports: 4

## `src/app/client/[slug]/campaigns/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/campaigns
- Lines: 3
- Bytes: 76
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/campaigns/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]/campaigns
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/campaigns`; exports: default; internal imports: 1

## `src/app/client/[slug]/campaigns/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/campaigns
- Lines: 139
- Bytes: 3831
- Imports (internal): src/app/client/[slug]/campaigns/page.tsx, src/components/charts/roas-trend-chart.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/features/client-portal/access.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/components / charts, src/features / client-portal
- Defines: element
- Tests / describe labels: ClientCampaigns, does not render the retired Back to overview link, defaults the campaigns page to today, treats retired 30-day client campaign URLs as today, passes custom campaign ranges through to the loader and table
- Contents summary: tests/describes: ClientCampaigns; does not render the retired Back to overview link; defaults the campaigns page to today; internal imports: 9; package imports: 2

## `src/app/client/[slug]/campaigns/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/campaigns
- Lines: 222
- Bytes: 9580
- Imports (internal): src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts, src/lib/constants.ts, src/app/client/[slug]/campaigns/campaign-range-filter.tsx
- Imports (packages): next, lucide-react
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / charts, src/lib, src/app / client, src/features / client-portal
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientCampaigns, generateMetadata, default
- Symbol details: default function ClientCampaigns (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientCampaigns, clientName, rawSearchParams, range, rangeLabel, trendData, totalSpend, totalRevenue, hasRevenue, totalImpressions, totalClicks, … (+9 more)
- Contents summary: Next.js page for `/client/[slug]/campaigns`; exports: ClientCampaigns, generateMetadata, default; internal imports: 10; package imports: 2

## `src/app/client/[slug]/components/campaign-detail-header.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 72
- Bytes: 2144
- Imports (internal): src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/theme.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/features / client-portal
- Tests / describe labels: CampaignDetailHeader, links back to campaigns and no longer calls it a dashboard, preserves custom ranges in the back link
- Contents summary: tests/describes: CampaignDetailHeader; links back to campaigns and no longer calls it a dashboard; preserves custom ranges in the back link; internal imports: 2; package imports: 2

## `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 83
- Bytes: 3239
- Imports (internal): src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/components/campaign-status-badge.tsx, src/features/client-portal/theme.ts
- Imports (packages): next/link, lucide-react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Depends on groups: src/lib, src/app / client, src/features / client-portal
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Exports: CampaignDetailHeader
- Symbol details: function CampaignDetailHeader (exported), interface Props
- Defines: CampaignDetailHeader, activeRange, Props
- Contents summary: exports: CampaignDetailHeader; internal imports: 5; package imports: 2

## `src/app/client/[slug]/components/campaign-status-badge.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 12
- Bytes: 348
- Imports (internal): src/app/client/[slug]/lib.ts
- Imported by: src/app/client/[slug]/components/campaign-detail-header.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: CampaignStatusBadge
- Symbol details: function CampaignStatusBadge (exported)
- Defines: CampaignStatusBadge, cfg
- Contents summary: exports: CampaignStatusBadge; internal imports: 1

## `src/app/client/[slug]/components/client-nav.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 51
- Bytes: 1611
- Imports (internal): src/app/client/[slug]/components/nav-config.ts
- Imports (packages): next/link, next/navigation, lucide-react
- Imported by: src/app/client/[slug]/layout.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/layout.tsx
- Routes related (direct): src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientNav
- Symbol details: function ClientNav (exported), interface Props
- Defines: ClientNav, pathname, links, active, Icon, Props
- Contents summary: contains `use client`; exports: ClientNav; internal imports: 1; package imports: 3

## `src/app/client/[slug]/components/client-portal-footer.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 37
- Bytes: 1590
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: ClientPortalFooter
- Symbol details: function ClientPortalFooter (exported), interface Props
- Defines: ClientPortalFooter, SyncIcon, Props
- Contents summary: exports: ClientPortalFooter; internal imports: 1; package imports: 1

## `src/app/client/[slug]/components/complete-profile-modal.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 106
- Bytes: 3027
- Imports (internal): src/components/ui/dialog.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx
- Imports (packages): react, next/navigation
- Imported by: src/app/client/[slug]/layout.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/layout.tsx
- Routes related (direct): src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: CompleteProfileModal
- Symbol details: function CompleteProfileModal (exported)
- Defines: CompleteProfileModal, handleSubmit, router, res, data
- Contents summary: contains `use client`; exports: CompleteProfileModal; internal imports: 3; package imports: 2

## `src/app/client/[slug]/components/insights-panel.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 28
- Bytes: 985
- Imports (internal): src/app/client/[slug]/types.ts
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: InsightsPanel
- Symbol details: function InsightsPanel (exported)
- Defines: InsightsPanel
- Contents summary: exports: InsightsPanel; internal imports: 1; package imports: 1

## `src/app/client/[slug]/components/mobile-nav.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 93
- Bytes: 3527
- Imports (internal): src/app/client/[slug]/components/nav-config.ts
- Imports (packages): react, next/link, next/navigation, next/image, lucide-react
- Imported by: src/app/client/[slug]/layout.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/layout.tsx
- Routes related (direct): src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: MobileNav
- Symbol details: function MobileNav (exported), interface Props
- Defines: MobileNav, onKeyDown, pathname, links, close, active, Icon, Props
- Contents summary: contains `use client`; exports: MobileNav; internal imports: 1; package imports: 5

## `src/app/client/[slug]/components/nav-config.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]/components
- Lines: 25
- Bytes: 635
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getClientNavLinks, isNavActive, NavLink
- Symbol details: function getClientNavLinks (exported), function isNavActive (exported), interface NavLink (exported)
- Defines: getClientNavLinks, isNavActive, NavLink
- Contents summary: exports: getClientNavLinks, isNavActive, NavLink; package imports: 1

## `src/app/client/[slug]/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]
- Lines: 71
- Bytes: 2036
- Imports (internal): src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/app/client/[slug]/types.ts
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/lib, src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: toCampaignCard, getCampaignsPageData
- Symbol details: function toCampaignCard (exported), function getCampaignsPageData (exported)
- Defines: toCampaignCard, getCampaignsPageData, result, aTime, bTime, allowed, campaignIds, snapshots
- Contents summary: exports: toCampaignCard, getCampaignsPageData; internal imports: 4

## `src/app/client/[slug]/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]
- Lines: 3
- Bytes: 76
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/event/[eventId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/event/[eventId]
- Lines: 22
- Bytes: 511
- Imports (internal): src/app/client/[slug]/event/[eventId]/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / client
- Tests / describe labels: EventDetailPage, redirects to client campaigns
- Contents summary: tests/describes: EventDetailPage; redirects to client campaigns; internal imports: 1; package imports: 2

## `src/app/client/[slug]/event/[eventId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/event/[eventId]
- Lines: 11
- Bytes: 293
- Imports (packages): next/navigation
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: EventDetailPage, default
- Symbol details: default function EventDetailPage (exported), interface EventDetailPageProps
- Defines: EventDetailPage, EventDetailPageProps
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; package imports: 1

## `src/app/client/[slug]/events/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/events
- Lines: 20
- Bytes: 485
- Imports (internal): src/app/client/[slug]/events/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / client
- Tests / describe labels: ClientEventsPage, redirects to client campaigns
- Contents summary: tests/describes: ClientEventsPage; redirects to client campaigns; internal imports: 1; package imports: 2

## `src/app/client/[slug]/events/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/events
- Lines: 11
- Bytes: 279
- Imports (packages): next/navigation
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientEventsPage, default
- Symbol details: default function ClientEventsPage (exported), interface ClientEventsPageProps
- Defines: ClientEventsPage, ClientEventsPageProps
- Contents summary: Next.js page for `/client/[slug]/events`; exports: ClientEventsPage, default; package imports: 1

## `src/app/client/[slug]/layout.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]
- Lines: 127
- Bytes: 4046
- Imports (internal): src/app/client/[slug]/layout.tsx, src/features/client-portal/config.ts
- Imports (packages): vitest, @testing-library/react, @clerk/nextjs/server, next/navigation
- Depends on groups: src/app / client, src/features / client-portal
- Symbol details: function config, function renderLayout, function openMobileNav, function getDesktopNav, function getMobileNav, const mockedGetClientPortalConfig
- Defines: config, renderLayout, openMobileNav, getDesktopNav, getMobileNav, mockedGetClientPortalConfig, element, desktopLink, mobileLink
- Tests / describe labels: ClientLayout navigation links, renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar, does not render Overview links in the desktop sidebar or mobile nav, renders Campaigns link in the mobile header, renders Campaigns links in both desktop and mobile nav for any slug, never renders Events or Reports links, renders children inside main content area
- Contents summary: tests/describes: ClientLayout navigation links; renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar; does not render Overview links in the desktop sidebar or mobile nav; internal imports: 2; package imports: 4

## `src/app/client/[slug]/layout.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js layout
- Construction: App Router layout, component/UI-oriented module
- Route: /client/[slug]
- Lines: 151
- Bytes: 5426
- Imports (internal): src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- Imports (packages): react, next, next/image, @clerk/nextjs/server, next/navigation
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client, src/features / client-portal
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientLayout, generateMetadata, default
- Symbol details: default function ClientLayout (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientLayout, clientName, portalConfig, clerkEnabled, meta, isAdmin, entry, theme, Props
- Contents summary: Next.js layout for `/client/[slug]`; exports: ClientLayout, generateMetadata, default; internal imports: 7; package imports: 5

## `src/app/client/[slug]/lib.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]
- Lines: 143
- Bytes: 3639
- Imports (internal): src/app/client/[slug]/lib.ts, src/app/client/[slug]/types.ts
- Imports (packages): vitest
- Depends on groups: src/app / client
- Tests / describe labels: client campaign analytics helpers, prefers the strongest CTR hour once delivery is meaningful, prefers high-performing markets only after clearing a meaningful impression floor, prefers ROAS-leading creatives over raw reach, returns no hour, market, creative, or weekday signal when the range has zero delivery
- Contents summary: tests/describes: client campaign analytics helpers; prefers the strongest CTR hour once delivery is meaningful; prefers high-performing markets only after clearing a meaningful impression floor; internal imports: 2; package imports: 1

## `src/app/client/[slug]/lib.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]
- Lines: 2
- Bytes: 51
- Imports (internal): src/features/client-portal/insights.ts
- Imported by: src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/lib.test.ts
- Depends on groups: src/features / client-portal
- Used by groups: src/app / admin, src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts
- Contents summary: internal imports: 1

## `src/app/client/[slug]/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]`; exports: default; internal imports: 1

## `src/app/client/[slug]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]
- Lines: 23
- Bytes: 634
- Imports (internal): src/app/client/[slug]/page.tsx
- Imports (packages): next/navigation, vitest
- Depends on groups: src/app / client
- Defines: redirectMock
- Tests / describe labels: ClientPortalRootPage, redirects the portal root to campaigns
- Contents summary: tests/describes: ClientPortalRootPage; redirects the portal root to campaigns; internal imports: 1; package imports: 2

## `src/app/client/[slug]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]
- Lines: 14
- Bytes: 295
- Imports (packages): next/navigation
- Imported by: src/app/client/[slug]/page.test.tsx
- Used by groups: src/app / client
- Tests related: src/app/client/[slug]/page.test.tsx
- Tests related (direct): src/app/client/[slug]/page.test.tsx
- Exports: ClientPortalRootPage, default
- Symbol details: default function ClientPortalRootPage (exported), interface ClientPortalRootPageProps
- Defines: ClientPortalRootPage, ClientPortalRootPageProps
- Contents summary: Next.js page for `/client/[slug]`; exports: ClientPortalRootPage, default; package imports: 1

## `src/app/client/[slug]/reports/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/reports
- Lines: 20
- Bytes: 488
- Imports (internal): src/app/client/[slug]/reports/page.tsx
- Imports (packages): vitest, next/navigation
- Depends on groups: src/app / client
- Tests / describe labels: ClientReportsPage, redirects to client campaigns
- Contents summary: tests/describes: ClientReportsPage; redirects to client campaigns; internal imports: 1; package imports: 2

## `src/app/client/[slug]/reports/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/reports
- Lines: 23
- Bytes: 654
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): next, next/navigation
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientReportsPage, generateMetadata, default
- Symbol details: default function ClientReportsPage (exported), function generateMetadata (exported), interface ClientReportsPageProps
- Defines: generateMetadata, ClientReportsPage, clientName, ClientReportsPageProps
- Contents summary: Next.js page for `/client/[slug]/reports`; exports: ClientReportsPage, generateMetadata, default; internal imports: 1; package imports: 2

## `src/app/client/[slug]/types.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]
- Lines: 2
- Bytes: 48
- Imports (internal): src/features/client-portal/types.ts
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.test.ts, src/components/client/charts/audience-demographics.tsx
- Depends on groups: src/features / client-portal
- Used by groups: src/app / client, src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts
- Contents summary: internal imports: 1

## `src/app/client/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client
- Lines: 88
- Bytes: 3147
- Imports (internal): src/components/ui/button.tsx, src/features/client-portal/entry.ts
- Imports (packages): @clerk/nextjs/server, next/navigation, next/link, next/image, @clerk/nextjs, lucide-react
- Depends on groups: src/components / ui, src/features / client-portal
- Exports: ClientPickerPage, default
- Symbol details: default function ClientPickerPage (exported), interface ClientPickerPageProps
- Defines: ClientPickerPage, user, meta, params, entry, memberships, firstName, ClientPickerPageProps
- Contents summary: Next.js page for `/client`; exports: ClientPickerPage, default; internal imports: 2; package imports: 6

## `src/app/client/pending/layout.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js layout
- Construction: App Router layout, component/UI-oriented module
- Route: /client/pending
- Lines: 13
- Bytes: 417
- Imports (packages): react, @clerk/nextjs/server, next/navigation
- Exports: PendingLayout, default
- Symbol details: default function PendingLayout (exported)
- Defines: PendingLayout, clerkEnabled
- Contents summary: Next.js layout for `/client/pending`; exports: PendingLayout, default; package imports: 3

## `src/app/client/pending/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/pending
- Lines: 24
- Bytes: 1003
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): next/link
- Depends on groups: src/components / ui
- Exports: PendingPage, default
- Symbol details: default function PendingPage (exported)
- Defines: PendingPage
- Contents summary: Next.js page for `/client/pending`; exports: PendingPage, default; internal imports: 1; package imports: 1
