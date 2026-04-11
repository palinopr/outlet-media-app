# src/app / client

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 63
- File kinds: React/TSX module (27), test file (13), Next.js page (9), Next.js loading UI (6), TypeScript module (6), Next.js layout (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/app/client/[slug]/agent/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/agent
- Lines: 4
- Bytes: 77
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/agent/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]/agent
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/agent`; exports: default; internal imports: 1

## `src/app/client/[slug]/agent/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/agent
- Lines: 113
- Bytes: 3294
- Imports (internal): src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/app/client/[slug]/agent/page.tsx, src/features/client-agent/server.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/features / client-portal, src/app / client, src/features / client-agent
- Symbol details: const mockedRequireClientAgentAccess, const mockedGetClientPortalConfig
- Defines: mockedRequireClientAgentAccess, mockedGetClientPortalConfig, element, shell
- Tests / describe labels: ClientAgentPage, renders the shared AgentShell for client members, passes preview mode into the shell and skips durable thread loading for admin preview
- Contents summary: tests/describes: ClientAgentPage; renders the shared AgentShell for client members; passes preview mode into the shell and skips durable thread loading for admin preview; internal imports: 4; package imports: 2

## `src/app/client/[slug]/agent/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/agent
- Lines: 47
- Bytes: 1523
- Imports (internal): src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-agent/server.ts, src/features/client-agent/components/agent-shell.tsx
- Imports (packages): next
- Imported by: src/app/client/[slug]/agent/page.test.tsx
- Depends on groups: src/lib, src/features / client-portal, src/features / client-agent
- Used by groups: src/app / client
- Tests related: src/app/client/[slug]/agent/page.test.tsx
- Tests related (direct): src/app/client/[slug]/agent/page.test.tsx
- Exports: ClientAgentPage, generateMetadata, default
- Symbol details: default function ClientAgentPage (exported), function generateMetadata (exported), interface ClientAgentPageProps
- Defines: generateMetadata, ClientAgentPage, clientName, access, portalConfig, initialThreads, result, ClientAgentPageProps
- Contents summary: Next.js page for `/client/[slug]/agent`; exports: ClientAgentPage, generateMetadata, default; internal imports: 5; package imports: 1

## `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]/campaign/[campaignId]
- Lines: 634
- Bytes: 18016
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-api.ts, src/features/client-portal/scope.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/client-portal/campaign-detail.ts
- Depends on groups: src/lib, src/features / client-portal, src/app / client
- Used by groups: Tests / App, src/app / client, src/features / client-portal
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-agent/runtime.test.ts, … (+6 more)
- Tests related (direct): __tests__/app/client/campaign-detail-data.test.ts
- Exports: getCampaignDetail, CampaignDetailRangeInput
- Symbol details: function getCampaignDetail (exported), function getMetaCreds, function isExplicitRange, function toInsightsWindow, function toRangeLabel, function buildAdsInsightsField, function extractPurchaseMetric, function deriveRevenue, function fetchCampaignOverview, function fetchAgeGender, function fetchPlacements, function formatPlatform, function formatPosition, function fetchHourly, function fetchDaily, function fetchGeography, … (+8 more)
- Defines: getMetaCreds, isExplicitRange, toInsightsWindow, toRangeLabel, buildAdsInsightsField, extractPurchaseMetric, deriveRevenue, fetchCampaignOverview, fetchAgeGender, fetchPlacements, formatPlatform, formatPosition, … (+41 more)
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
- Lines: 734
- Bytes: 24056
- Imports (internal): src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, … (+3 more)
- Imports (packages): next/link, lucide-react
- Imported by: src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client, src/components / client, src/features / client-portal, src/features / campaigns
- Used by groups: src/app / root routes
- Tests related: src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/shell-import-smoke.test.ts
- Exports: CampaignDetailPage, default
- Symbol details: default function CampaignDetailPage (exported), function SnapshotCard, function FallbackCard, function OperatingRecommendations, function findTopAge, function findLeadingGender, function getDaysLive, function CampaignIntelligenceBrief, function hasMeaningfulCampaignWindow, function buildCampaignBrief, function formatStatus, function formatHour, function formatDay, interface Props
- Defines: CampaignDetailPage, SnapshotCard, FallbackCard, OperatingRecommendations, findTopAge, findLeadingGender, getDaysLive, CampaignIntelligenceBrief, hasMeaningfulCampaignWindow, buildCampaignBrief, formatStatus, formatHour, … (+35 more)
- Contents summary: Next.js page for `/client/[slug]/campaign/[campaignId]`; exports: CampaignDetailPage, default; internal imports: 13; package imports: 2

## `src/app/client/[slug]/campaigns/campaigns-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/campaigns
- Lines: 186
- Bytes: 8915
- Imports (internal): src/lib/formatters.tsx, src/lib/status.ts, src/app/client/[slug]/types.ts
- Imports (packages): react, next/navigation, next/link, lucide-react
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Depends on groups: src/lib, src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: CampaignsTable
- Symbol details: function CampaignsTable (exported)
- Defines: CampaignsTable, router, queryLower, filtered, statusCfg
- Contents summary: contains `use client`; exports: CampaignsTable; internal imports: 3; package imports: 4

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
- Lines: 55
- Bytes: 1536
- Imports (internal): src/app/client/[slug]/campaigns/page.tsx, src/components/charts/roas-trend-chart.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/components / charts, src/features / client-portal
- Defines: element
- Tests / describe labels: ClientCampaigns, does not render the retired Back to overview link
- Contents summary: tests/describes: ClientCampaigns; does not render the retired Back to overview link; internal imports: 8; package imports: 2

## `src/app/client/[slug]/campaigns/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/campaigns
- Lines: 207
- Bytes: 8366
- Imports (internal): src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts
- Imports (packages): next, lucide-react
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/components / charts, src/lib, src/app / client, src/features / client-portal
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientCampaigns, generateMetadata, default
- Symbol details: default function ClientCampaigns (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientCampaigns, clientName, trendData, totalSpend, totalRevenue, totalImpressions, totalClicks, blendedRoas, hasData, avgCtr, avgCpc, … (+5 more)
- Contents summary: Next.js page for `/client/[slug]/campaigns`; exports: ClientCampaigns, generateMetadata, default; internal imports: 8; package imports: 2

## `src/app/client/[slug]/components/audience-section.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 103
- Bytes: 4708
- Imports (internal): src/app/client/[slug]/types.ts, src/app/client/[slug]/components/progress-bar.tsx
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/event/[eventId]/page.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Routes related (direct): src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: AudienceSection
- Symbol details: function AudienceSection (exported), function DemoBar
- Defines: DemoBar, AudienceSection
- Contents summary: exports: AudienceSection; internal imports: 2; package imports: 1

## `src/app/client/[slug]/components/campaign-card.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 73
- Bytes: 3084
- Imports (internal): src/app/client/[slug]/types.ts, src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/components/progress-bar.tsx
- Imports (packages): next/link, lucide-react
- Imported by: src/app/client/[slug]/components/campaign-section.tsx
- Depends on groups: src/app / client, src/lib
- Used by groups: src/app / client
- Exports: CampaignCard
- Symbol details: function CampaignCard (exported)
- Defines: CampaignCard
- Contents summary: exports: CampaignCard; internal imports: 6; package imports: 2

## `src/app/client/[slug]/components/campaign-detail-header.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 39
- Bytes: 1146
- Imports (internal): src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/theme.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/features / client-portal
- Tests / describe labels: CampaignDetailHeader, links back to campaigns and no longer calls it a dashboard
- Contents summary: tests/describes: CampaignDetailHeader; links back to campaigns and no longer calls it a dashboard; internal imports: 2; package imports: 2

## `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 77
- Bytes: 2938
- Imports (internal): src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/components/campaign-status-badge.tsx, src/features/client-portal/theme.ts
- Imports (packages): next/link, lucide-react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Depends on groups: src/app / client, src/lib, src/features / client-portal
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Exports: CampaignDetailHeader
- Symbol details: function CampaignDetailHeader (exported), interface Props
- Defines: CampaignDetailHeader, Props
- Contents summary: exports: CampaignDetailHeader; internal imports: 6; package imports: 2

## `src/app/client/[slug]/components/campaign-discussion-form.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 69
- Bytes: 2111
- Imports (internal): src/app/client/[slug]/components/campaign-discussion-form.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/app / client
- Symbol details: const refresh
- Defines: refresh
- Tests / describe labels: CampaignDiscussionForm, posts a shared campaign comment and refreshes the page, shows an error when the comment request fails
- Contents summary: tests/describes: CampaignDiscussionForm; posts a shared campaign comment and refreshes the page; shows an error when the comment request fails; internal imports: 1; package imports: 3

## `src/app/client/[slug]/components/campaign-discussion-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 99
- Bytes: 3335
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): react, next/navigation, lucide-react
- Imported by: src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/campaign-discussion-form.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- Exports: CampaignDiscussionForm
- Symbol details: function CampaignDiscussionForm (exported), interface CampaignDiscussionFormProps
- Defines: CampaignDiscussionForm, handleSubmit, router, nextContent, response, body, CampaignDiscussionFormProps
- Contents summary: contains `use client`; exports: CampaignDiscussionForm; internal imports: 1; package imports: 3

## `src/app/client/[slug]/components/campaign-operating-panel.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 185
- Bytes: 6669
- Imports (internal): src/app/client/[slug]/components/campaign-operating-panel.tsx, src/features/campaigns/client-operating.ts, src/app/client/[slug]/components/campaign-discussion-form.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / client, src/features / campaigns
- Symbol details: const data
- Defines: data
- Tests / describe labels: CampaignOperatingPanel, renders a simpler campaign request surface and only shows supporting workflow that exists, keeps the empty state minimal when there is no workflow yet
- Contents summary: tests/describes: CampaignOperatingPanel; renders a simpler campaign request surface and only shows supporting workflow that exists; keeps the empty state minimal when there is no workflow yet; internal imports: 3; package imports: 2

## `src/app/client/[slug]/components/campaign-operating-panel.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 341
- Bytes: 14673
- Imports (internal): src/lib/formatters.tsx, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/features/campaigns/client-operating.ts, src/features/campaign-comments/server.ts, src/app/client/[slug]/components/campaign-discussion-form.tsx
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- Depends on groups: src/lib, src/features / campaigns, src/features / campaign-comments, src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- Exports: CampaignOperatingPanel
- Symbol details: function CampaignOperatingPanel (exported), function toneBadge, function actionItemPriorityTone, function outcomeTone, function outcomeLabel, function compactText, function groupDiscussionThreads, function SectionCard, function ThreadList, interface CampaignOperatingPanelProps
- Defines: toneBadge, actionItemPriorityTone, outcomeTone, outcomeLabel, compactText, groupDiscussionThreads, SectionCard, ThreadList, CampaignOperatingPanel, text, repliesByParent, current, … (+4 more)
- Contents summary: exports: CampaignOperatingPanel; internal imports: 6; package imports: 1

## `src/app/client/[slug]/components/campaign-section.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 113
- Bytes: 4173
- Imports (internal): src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/types.ts, src/lib/constants.ts
- Imports (packages): react, lucide-react
- Depends on groups: src/app / client, src/lib
- Exports: CampaignSection
- Symbol details: function CampaignSection (exported), type StatusFilter
- Defines: CampaignSection, hasActive, searchLower, filtered, sorted, aTime, bTime, activeCt, pausedCt, count, StatusFilter
- Contents summary: contains `use client`; exports: CampaignSection; internal imports: 3; package imports: 2

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
- Imported by: src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx
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
- Lines: 54
- Bytes: 1783
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
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
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

## `src/app/client/[slug]/components/date-range-picker.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 55
- Bytes: 1645
- Imports (internal): src/lib/constants.ts
- Imports (packages): react, next/navigation
- Depends on groups: src/lib
- Exports: DateRangePicker
- Symbol details: function DateRangePicker (exported), const STORAGE_KEY, interface Props
- Defines: DateRangePicker, STORAGE_KEY, router, searchParams, stored, Props
- Contents summary: contains `use client`; exports: DateRangePicker; internal imports: 1; package imports: 2

## `src/app/client/[slug]/components/event-card.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 73
- Bytes: 2925
- Imports (internal): src/app/client/[slug]/types.ts, src/lib/formatters.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/progress-bar.tsx
- Imports (packages): next/link, lucide-react
- Imported by: src/app/client/[slug]/events/events-filter.tsx
- Depends on groups: src/app / client, src/lib
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/events/page.tsx
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: EventCard
- Symbol details: function EventCard (exported)
- Defines: EventCard
- Contents summary: exports: EventCard; internal imports: 4; package imports: 2

## `src/app/client/[slug]/components/event-discussion-form.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 69
- Bytes: 2091
- Imports (internal): src/app/client/[slug]/components/event-discussion-form.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation
- Depends on groups: src/app / client
- Symbol details: const refresh
- Defines: refresh
- Tests / describe labels: EventDiscussionForm, posts a shared event request and refreshes the page, shows an error when the request fails
- Contents summary: tests/describes: EventDiscussionForm; posts a shared event request and refreshes the page; shows an error when the request fails; internal imports: 1; package imports: 3

## `src/app/client/[slug]/components/event-discussion-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/components
- Lines: 96
- Bytes: 3312
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): react, next/navigation, lucide-react
- Imported by: src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/event-discussion-form.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx
- Exports: EventDiscussionForm
- Symbol details: function EventDiscussionForm (exported), interface EventDiscussionFormProps
- Defines: EventDiscussionForm, handleSubmit, router, nextContent, response, body, EventDiscussionFormProps
- Contents summary: contains `use client`; exports: EventDiscussionForm; internal imports: 1; package imports: 3

## `src/app/client/[slug]/components/event-operating-panel.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/components
- Lines: 188
- Bytes: 6636
- Imports (internal): src/app/client/[slug]/components/event-operating-panel.tsx, src/features/events/client-operating.ts, src/app/client/[slug]/components/event-discussion-form.tsx
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/app / client, src/features / events
- Symbol details: const data
- Defines: data
- Tests / describe labels: EventOperatingPanel, renders a simpler event request surface and only shows supporting workflow that exists, keeps the empty state minimal when there is no workflow yet
- Contents summary: tests/describes: EventOperatingPanel; renders a simpler event request surface and only shows supporting workflow that exists; keeps the empty state minimal when there is no workflow yet; internal imports: 3; package imports: 2

## `src/app/client/[slug]/components/event-operating-panel.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 342
- Bytes: 15134
- Imports (internal): src/lib/formatters.tsx, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/features/events/client-operating.ts, src/features/event-comments/server.ts, src/app/client/[slug]/components/event-discussion-form.tsx
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Depends on groups: src/lib, src/features / events, src-features-event-comments, src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx
- Routes related (direct): src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/event-operating-panel.test.tsx
- Exports: EventOperatingPanel
- Symbol details: function EventOperatingPanel (exported), function toneBadge, function followUpPriorityTone, function outcomeTone, function outcomeLabel, function compactText, function groupDiscussionThreads, function SectionCard, function ThreadList, interface EventOperatingPanelProps
- Defines: toneBadge, followUpPriorityTone, outcomeTone, outcomeLabel, compactText, groupDiscussionThreads, SectionCard, ThreadList, EventOperatingPanel, text, repliesByParent, current, … (+4 more)
- Contents summary: exports: EventOperatingPanel; internal imports: 6; package imports: 1

## `src/app/client/[slug]/components/event-status-badge.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 12
- Bytes: 339
- Imports (internal): src/app/client/[slug]/lib.ts
- Imported by: src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx
- Routes related (direct): src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/events/page.test.tsx
- Exports: EventStatusBadge
- Symbol details: function EventStatusBadge (exported)
- Defines: EventStatusBadge, cfg
- Contents summary: exports: EventStatusBadge; internal imports: 1

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
- Lines: 96
- Bytes: 3699
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
- Lines: 56
- Bytes: 1305
- Imports (packages): lucide-react
- Imported by: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getClientNavLinks, isNavActive, ClientNavOptions, NavLink
- Symbol details: function getClientNavLinks (exported), function isNavActive (exported), type ClientNavOptions (exported), interface NavLink (exported)
- Defines: getClientNavLinks, isNavActive, links, ClientNavOptions, NavLink
- Contents summary: exports: getClientNavLinks, isNavActive, ClientNavOptions, NavLink; package imports: 1

## `src/app/client/[slug]/components/progress-bar.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 20
- Bytes: 578
- Imported by: src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/events/page.tsx
- Routes related (direct): src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/events/page.test.tsx
- Exports: ProgressBar, BarColor
- Symbol details: function ProgressBar (exported), type BarColor (exported)
- Defines: ProgressBar, BarColor
- Contents summary: exports: ProgressBar, BarColor

## `src/app/client/[slug]/components/stat-card.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module
- Route context: /client/[slug]/components
- Lines: 6
- Bytes: 216
- Imports (internal): src/components/admin/stat-card.tsx
- Depends on groups: src/components / admin
- Exports: StatCard
- Symbol details: function StatCard (exported)
- Defines: StatCard
- Contents summary: exports: StatCard; internal imports: 1

## `src/app/client/[slug]/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]
- Lines: 277
- Bytes: 7547
- Imports (internal): src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/formatters.tsx, src/lib/member-access.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx
- Depends on groups: src/lib, src/app / client
- Used by groups: Tests / App, src/app / client
- Route owners: src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx
- Tests related: __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Tests related (direct): __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx
- Exports: toCampaignCard, getCampaignsPageData, getEventsPageData, getData, ClientData, EventsPageData
- Symbol details: function toCampaignCard (exported), function getCampaignsPageData (exported), function getEventsPageData (exported), function getData (exported), function getClientPortalReadClient, function buildHeroStats, function buildEventCards, interface ClientData (exported), interface EventsPageData (exported), interface GetClientDataOptions
- Defines: getClientPortalReadClient, toCampaignCard, buildHeroStats, buildEventCards, getCampaignsPageData, getEventsPageData, getData, fetchEvents, user, role, active, result, … (+19 more)
- Contents summary: exports: toCampaignCard, getCampaignsPageData, getEventsPageData, getData, ClientData, EventsPageData; internal imports: 7; package imports: 1

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

## `src/app/client/[slug]/event/[eventId]/data.ts`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: TypeScript module
- Construction: code module
- Route context: /client/[slug]/event/[eventId]
- Lines: 175
- Bytes: 5026
- Imports (internal): src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/formatters.tsx, src/features/client-portal/scope.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/features/client-portal/event-detail.ts
- Depends on groups: src/lib, src/features / client-portal, src/app / client
- Used by groups: Tests / App, src/app / client, src/features / client-portal
- Route owners: src/app/client/[slug]/event/[eventId]/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, … (+7 more)
- Tests related (direct): __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: getEventDetail
- Symbol details: function getEventDetail (exported), function getEventDetailReadContext, interface LinkedCampaignRow
- Defines: getEventDetailReadContext, getEventDetail, user, role, userScopedClient, readContext, tmEvent, event, linkedCampaignRows, channelBreakdown, dailyDeltas, velocity, … (+1 more)
- Contents summary: exports: getEventDetail; internal imports: 7; package imports: 1

## `src/app/client/[slug]/event/[eventId]/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/event/[eventId]
- Lines: 3
- Bytes: 76
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/event/[eventId]/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]/event/[eventId]
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/event/[eventId]`; exports: default; internal imports: 1

## `src/app/client/[slug]/event/[eventId]/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/event/[eventId]
- Lines: 31
- Bytes: 821
- Imports (internal): src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/features/client-portal/access.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/features / client-portal
- Defines: element
- Tests / describe labels: EventDetailPage, links missing events back to the events index
- Contents summary: tests/describes: EventDetailPage; links missing events back to the events index; internal imports: 3; package imports: 2

## `src/app/client/[slug]/event/[eventId]/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/event/[eventId]
- Lines: 619
- Bytes: 26136
- Imports (internal): src/lib/formatters.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, … (+2 more)
- Imports (packages): next/link, lucide-react
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client, src/components / client, src/features / client-portal, src/features / events
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: EventDetailPage, default
- Symbol details: default function EventDetailPage (exported), function PlatformBadge, function MetricCard, function MomentumRow, function TrendIcon, function ChannelCell, function buildEventBrief, interface Props
- Defines: EventDetailPage, PlatformBadge, MetricCard, MomentumRow, TrendIcon, ChannelCell, buildEventBrief, data, operatingView, dt, daysUntilEvent, hasTodayData, … (+8 more)
- Contents summary: Next.js page for `/client/[slug]/event/[eventId]`; exports: EventDetailPage, default; internal imports: 12; package imports: 2

## `src/app/client/[slug]/events/error.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/events
- Lines: 3
- Bytes: 76
- Imports (internal): src/components/client/error-boundary.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: contains `use client`; exports: default; internal imports: 1

## `src/app/client/[slug]/events/events-filter.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Route context: /client/[slug]/events
- Lines: 131
- Bytes: 4488
- Imports (internal): src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/types.ts
- Imports (packages): react, lucide-react
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/events/page.tsx
- Depends on groups: src/app / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/events/page.tsx
- Routes related (direct): src/app/client/[slug]/events/page.tsx
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/events/page.test.tsx
- Exports: EventsFilter
- Symbol details: function EventsFilter (exported), function normalizeStatus, function matchesFilter, function matchesSearch, type StatusFilter
- Defines: normalizeStatus, matchesFilter, matchesSearch, EventsFilter, q, hasOnSale, defaultFilter, filtered, onSaleCt, offSaleCt, count, StatusFilter
- Contents summary: contains `use client`; exports: EventsFilter; internal imports: 2; package imports: 2

## `src/app/client/[slug]/events/loading.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js loading UI
- Construction: App Router loading UI, component/UI-oriented module
- Route: /client/[slug]/events
- Lines: 2
- Bytes: 64
- Imports (internal): src/components/client/loading-skeleton.tsx
- Depends on groups: src/components / client
- Exports: default
- Contents summary: Next.js loading UI for `/client/[slug]/events`; exports: default; internal imports: 1

## `src/app/client/[slug]/events/page.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]/events
- Lines: 41
- Bytes: 1041
- Imports (internal): src/app/client/[slug]/events/page.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/events/events-filter.tsx, src/features/client-portal/access.ts
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/app / client, src/features / client-portal
- Defines: element
- Tests / describe labels: ClientEventsPage, links back to campaigns from the events header
- Contents summary: tests/describes: ClientEventsPage; links back to campaigns from the events header; internal imports: 4; package imports: 2

## `src/app/client/[slug]/events/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/events
- Lines: 136
- Bytes: 5169
- Imports (internal): src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/events/events-filter.tsx, src/features/client-portal/access.ts
- Imports (packages): next, next/link, lucide-react
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/app / client, src/lib, src/features / client-portal
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientEventsPage, generateMetadata, default
- Symbol details: default function ClientEventsPage (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientEventsPage, clientName, Props
- Contents summary: Next.js page for `/client/[slug]/events`; exports: ClientEventsPage, generateMetadata, default; internal imports: 4; package imports: 3

## `src/app/client/[slug]/layout.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: test file
- Construction: test specification
- Route context: /client/[slug]
- Lines: 262
- Bytes: 8193
- Imports (internal): src/app/client/[slug]/layout.tsx, src/features/client-portal/config.ts
- Imports (packages): vitest, @testing-library/react, @clerk/nextjs/server, next/navigation
- Depends on groups: src/app / client, src/features / client-portal
- Symbol details: function renderLayout, function openMobileNav, function getDesktopNav, function getMobileNav, const mockedGetClientPortalConfig
- Defines: renderLayout, openMobileNav, getDesktopNav, getMobileNav, mockedGetClientPortalConfig, element, desktopLink, mobileLink
- Tests / describe labels: ClientLayout navigation links, renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar, does not render Overview links in the desktop sidebar or mobile nav, renders Campaigns link in the mobile header, renders Campaigns links in both desktop and mobile nav for any slug, hides Events links when events are disabled for the client, hides Agent links when agent access is disabled for the client, shows Agent links in desktop and mobile nav when agent access is enabled, … (+4 more)
- Contents summary: tests/describes: ClientLayout navigation links; renders Campaigns link pointing to /client/{slug}/campaigns in the desktop sidebar; does not render Overview links in the desktop sidebar or mobile nav; internal imports: 2; package imports: 4

## `src/app/client/[slug]/layout.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js layout
- Construction: App Router layout, component/UI-oriented module
- Route: /client/[slug]
- Lines: 165
- Bytes: 5895
- Imports (internal): src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- Imports (packages): react, next, next/image, @clerk/nextjs/server, next/navigation
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/app / client, src/features / client-portal
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientLayout, generateMetadata, default
- Symbol details: default function ClientLayout (exported), function generateMetadata (exported), interface Props
- Defines: generateMetadata, ClientLayout, clientName, portalConfig, clerkEnabled, meta, isAdmin, entry, agentEnabled, eventsEnabled, reportsEnabled, theme, … (+1 more)
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
- Imported by: src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/data.ts, … (+3 more)
- Depends on groups: src/features / client-portal
- Used by groups: src/app / admin, src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, … (+14 more)
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
- Lines: 88
- Bytes: 2725
- Imports (internal): src/features/client-portal/access.ts, src/features/reports/server.ts, src/app/client/[slug]/reports/page.tsx, src/features/reports/components/reports-surface.tsx
- Imports (packages): vitest, @testing-library/react
- Depends on groups: src/features / client-portal, src/features / reports, src/app / client
- Symbol details: const mockedRequireClientReportsAccess, const mockedGetReportsData, const mockedGetReportsWorkflowData
- Defines: mockedRequireClientReportsAccess, mockedGetReportsData, mockedGetReportsWorkflowData, element
- Tests / describe labels: ClientReportsPage, renders the shared reports surface for enabled clients
- Contents summary: tests/describes: ClientReportsPage; renders the shared reports surface for enabled clients; internal imports: 4; package imports: 2

## `src/app/client/[slug]/reports/page.tsx`
- Status: tracked-clean
- System: web
- Group: src/app / client
- Ownership: web client route surface
- Type: Next.js page
- Construction: App Router page, component/UI-oriented module
- Route: /client/[slug]/reports
- Lines: 62
- Bytes: 2245
- Imports (internal): src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts
- Imports (packages): next, lucide-react
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Depends on groups: src/lib, src/features / client-portal, src/features / reports
- Used by groups: src/app / client, src/app / root routes
- Tests related: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: ClientReportsPage, generateMetadata, default
- Symbol details: default function ClientReportsPage (exported), function generateMetadata (exported), interface ClientReportsPageProps
- Defines: generateMetadata, ClientReportsPage, clientName, ClientReportsPageProps
- Contents summary: Next.js page for `/client/[slug]/reports`; exports: ClientReportsPage, generateMetadata, default; internal imports: 4; package imports: 2

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
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/campaign-card.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/data.ts, … (+6 more)
- Depends on groups: src/features / client-portal
- Used by groups: src/app / client, src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, __tests__/app/client/event-detail-data.test.ts, … (+13 more)
- Tests related (direct): src/app/client/[slug]/lib.test.ts
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
- Lines: 26
- Bytes: 1033
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): @clerk/nextjs
- Depends on groups: src/components / ui
- Exports: PendingPage, default
- Symbol details: default function PendingPage (exported)
- Defines: PendingPage
- Contents summary: Next.js page for `/client/pending`; exports: PendingPage, default; internal imports: 1; package imports: 1
