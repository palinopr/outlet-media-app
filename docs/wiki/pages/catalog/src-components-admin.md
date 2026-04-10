# src/components / admin

Generated from the current working tree on 2026-04-10 16:52:39.

- Files: 62
- File kinds: React/TSX module (52), test file (8), TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/admin/activity-tracker.test.ts`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 12
- Bytes: 377
- Imports (internal): src/components/admin/nav-config.ts, src/components/admin/activity-tracker.tsx
- Imports (packages): vitest
- Depends on groups: src/components / admin
- Tests / describe labels: getPageLabel, maps every approved admin shell route to its viewed label
- Contents summary: tests/describes: getPageLabel; maps every approved admin shell route to its viewed label; internal imports: 2; package imports: 1

## `src/components/admin/activity-tracker.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 105
- Bytes: 3127
- Imports (internal): src/components/admin/nav-config.ts
- Imports (packages): next/navigation, react
- Imported by: src/app/admin/layout.tsx, src/components/admin/activity-tracker.test.ts
- Depends on groups: src/components / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/layout.tsx
- Routes related (direct): src/app/admin/layout.tsx
- Tests related: src/components/admin/activity-tracker.test.ts
- Tests related (direct): src/components/admin/activity-tracker.test.ts
- Exports: getPageLabel, ActivityTracker
- Symbol details: function getPageLabel (exported), function ActivityTracker (exported), function postActivity, const PAGE_LABELS, interface Props
- Defines: getPageLabel, postActivity, ActivityTracker, handleError, handleRejection, PAGE_LABELS, pathname, lastPathRef, sessionLoggedRef, debounceRef, msg, Props
- Contents summary: contains `use client`; exports: getPageLabel, ActivityTracker; internal imports: 1; package imports: 2

## `src/components/admin/agents/agent-sidebar.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 68
- Bytes: 2322
- Imports (internal): src/components/ui/card.tsx, src/components/admin/run-button.tsx, src/lib/formatters.tsx, src/components/admin/agents/constants.ts
- Imports (packages): lucide-react
- Imported by: src/app/admin/agents/page.tsx
- Depends on groups: src/components / ui, src/components / admin, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: AgentSidebar
- Symbol details: function AgentSidebar (exported), interface AgentSidebarProps
- Defines: AgentSidebar, agent, Icon, AgentSidebarProps
- Contents summary: contains `use client`; exports: AgentSidebar; internal imports: 4; package imports: 1

## `src/components/admin/agents/chat-panel.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 245
- Bytes: 8570
- Imports (internal): src/components/ui/button.tsx, src/lib/formatters.tsx, src/app/admin/agents/data.ts, src/components/admin/agents/constants.ts, src/components/admin/agents/status-badge.tsx
- Imports (packages): react, lucide-react, sonner
- Imported by: src/app/admin/agents/page.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin, src/components / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: ChatPanel
- Symbol details: function ChatPanel (exported), function ResultText, function JobBubble, const POLL_MS, const REFRESH_MS, interface ChatPanelProps
- Defines: ResultText, JobBubble, ChatPanel, send, handleKeyDown, isLong, shown, Icon, label, hasPrompt, POLL_MS, REFRESH_MS, … (+8 more)
- Contents summary: contains `use client`; exports: ChatPanel; internal imports: 5; package imports: 3

## `src/components/admin/agents/command-summary.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 85
- Bytes: 2503
- Imports (internal): src/components/admin/agents/command-summary.tsx, src/features/agents/summary.ts
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/components / admin, src/features / agents
- Defines: assetCard
- Tests / describe labels: AgentCommandSummarySection, does not render an asset link for asset outcomes
- Contents summary: tests/describes: AgentCommandSummarySection; does not render an asset link for asset outcomes; internal imports: 2; package imports: 2

## `src/components/admin/agents/command-summary.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 254
- Bytes: 8991
- Imports (internal): src/components/ui/card.tsx, src/components/ui/badge.tsx, src/lib/utils.ts, src/app/admin/agents/data.ts, src/features/agents/summary.ts, src/features/agent-outcomes/summary.ts, src/lib/formatters.tsx, src/components/admin/agents/constants.ts, src/components/admin/agents/status-badge.tsx
- Imports (packages): next/link, lucide-react
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/command-summary.test.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin, src/features / agents, src/features / agent-outcomes, src/components / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/components/admin/agents/command-summary.test.tsx
- Exports: AgentCommandSummarySection
- Symbol details: function AgentCommandSummarySection (exported), function outcomeContext, function actionableOutcomeNote, function nonZeroBuckets, function metricTone, function attentionIcon, interface AgentCommandSummaryProps
- Defines: outcomeContext, actionableOutcomeNote, nonZeroBuckets, metricTone, attentionIcon, AgentCommandSummarySection, buckets, tone, Icon, context, AgentCommandSummaryProps
- Contents summary: exports: AgentCommandSummarySection; internal imports: 9; package imports: 2

## `src/components/admin/agents/constants.test.ts`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 14
- Bytes: 505
- Imports (internal): src/components/admin/agents/constants.ts
- Imports (packages): vitest
- Depends on groups: src/components / admin
- Tests / describe labels: agent constants, labels the main runtime as a single Outlet Agent, describes manual controls instead of a background scheduler
- Contents summary: tests/describes: agent constants; labels the main runtime as a single Outlet Agent; describes manual controls instead of a background scheduler; internal imports: 1; package imports: 1

## `src/components/admin/agents/constants.ts`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: TypeScript module
- Construction: code module
- Lines: 70
- Bytes: 5270
- Imports (packages): lucide-react
- Imported by: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/constants.test.ts, src/components/admin/agents/job-history.tsx
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Tests related: src/components/admin/agents/constants.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx
- Tests related (direct): src/components/admin/agents/constants.test.ts
- Exports: agentName, AGENT_CONFIG, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo
- Symbol details: function agentName (exported), const AGENT_TYPE_KEYS (exported), const QUICK_RUN_AGENTS (exported), const DASHBOARD_AGENTS (exported), interface AgentInfo (exported)
- Defines: agentName, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo
- Contents summary: exports: agentName, AGENT_CONFIG, AGENT_TYPE_KEYS, QUICK_RUN_AGENTS, DASHBOARD_AGENTS, AgentInfo; package imports: 1

## `src/components/admin/agents/job-history.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 92
- Bytes: 2837
- Imports (internal): src/components/admin/agents/job-history.tsx, src/app/admin/agents/data.ts
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/components / admin, src/app / admin
- Tests / describe labels: JobHistory, filters automated runs by search text, filters automated runs by workflow state, uses single-runtime empty state copy
- Contents summary: tests/describes: JobHistory; filters automated runs by search text; filters automated runs by workflow state; internal imports: 2; package imports: 2

## `src/components/admin/agents/job-history.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 354
- Bytes: 11445
- Imports (internal): src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx, src/app/admin/agents/data.ts, src/lib/formatters.tsx, src/components/admin/agents/constants.ts, src/components/admin/agents/status-badge.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/data-table/data-table-pagination.tsx
- Imports (packages): react, @tanstack/react-table, lucide-react
- Imported by: src/app/admin/agents/page.tsx, src/components/admin/agents/job-history.test.tsx
- Depends on groups: src/components / ui, src/app / admin, src/lib, src/components / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/agents/page.tsx
- Routes related (direct): src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/components/admin/agents/job-history.test.tsx
- Exports: JobHistory
- Symbol details: function JobHistory (exported), function durationMs, function fmtDuration, function outputText, function ExpandableRow, type JobHistoryFilter, interface Props, interface ExpandableRowProps
- Defines: durationMs, fmtDuration, outputText, JobHistory, handleFilterChange, handleQueryChange, toggleRow, ExpandableRow, text, preview, data, normalizedQuery, … (+14 more)
- Contents summary: contains `use client`; exports: JobHistory; internal imports: 10; package imports: 3

## `src/components/admin/agents/status-badge.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 24
- Bytes: 747
- Imports (packages): lucide-react
- Imported by: src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/job-history.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/components/admin/agents/command-summary.test.tsx, src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: StatusBadge
- Symbol details: function StatusBadge (exported), interface StatusBadgeProps
- Defines: StatusBadge, StatusBadgeProps
- Contents summary: contains `use client`; exports: StatusBadge; package imports: 1

## `src/components/admin/breadcrumbs.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 60
- Bytes: 1460
- Imports (internal): src/components/ui/breadcrumb.tsx
- Imports (packages): next/navigation, react
- Imported by: src/app/admin/layout.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / admin
- Route owners: src/app/admin/layout.tsx
- Routes related (direct): src/app/admin/layout.tsx
- Exports: AdminBreadcrumbs
- Symbol details: function AdminBreadcrumbs (exported)
- Defines: AdminBreadcrumbs, pathname, segments, crumbs
- Tests / describe labels: /
- Contents summary: contains `use client`; exports: AdminBreadcrumbs; tests/describes: /; internal imports: 1; package imports: 2

## `src/components/admin/campaigns/campaign-cells.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 118
- Bytes: 4528
- Imports (internal): src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/components/admin/confirm-dialog.tsx, src/app/admin/actions/campaigns.ts
- Imports (packages): sonner, lucide-react
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/columns.tsx
- Depends on groups: src/lib, src/components / admin, src/app / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: BudgetBar, RoasBadge, RoasSparkline, SyncButton
- Symbol details: function BudgetBar (exported), function RoasBadge (exported), function RoasSparkline (exported), function SyncButton (exported)
- Defines: BudgetBar, RoasBadge, RoasSparkline, SyncButton, pct, color, vals, W, min, max, range, coords, … (+8 more)
- Tests / describe labels: ,
- Contents summary: contains `use client`; exports: BudgetBar, RoasBadge, RoasSparkline, SyncButton; tests/describes: ,; internal imports: 4; package imports: 2

## `src/components/admin/campaigns/campaign-detail-dashboard.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 167
- Bytes: 5190
- Imports (internal): src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.ts
- Imports (packages): @testing-library/react, vitest
- Depends on groups: src/components / admin, src/features / campaigns
- Symbol details: const data
- Defines: data
- Tests / describe labels: CampaignDetailDashboard, renders real operating sections and removes the placeholder dashboard copy
- Contents summary: tests/describes: CampaignDetailDashboard; renders real operating sections and removes the placeholder dashboard copy; internal imports: 2; package imports: 2

## `src/components/admin/campaigns/campaign-detail-dashboard.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 267
- Bytes: 11595
- Imports (internal): src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/action-item-labels.ts, src/lib/workspace-types.ts
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Depends on groups: src/features / campaigns, src/lib
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Tests related (direct): src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Exports: CampaignDetailDashboard
- Symbol details: function CampaignDetailDashboard (exported), function SectionCard, function EmptyState, function KpiCard, function badgeClass, interface Props
- Defines: SectionCard, EmptyState, KpiCard, badgeClass, CampaignDetailDashboard, unresolvedComments, openActionItems, Props
- Contents summary: exports: CampaignDetailDashboard; internal imports: 4

## `src/components/admin/campaigns/campaign-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 181
- Bytes: 7206
- Imports (internal): src/components/admin/data-table/data-table.tsx, src/components/admin/campaigns/columns.tsx, src/app/admin/actions/campaigns.ts, src/lib/formatters.tsx, src/lib/export-csv.ts, src/lib/meta-campaigns.ts
- Imports (packages): react, next/navigation, sonner
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx
- Depends on groups: src/components / admin, src/app / admin, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx
- Exports: CampaignTable
- Symbol details: function CampaignTable (exported), function AssignToolbar, const campaignCsvColumns, interface CampaignTableProps
- Defines: AssignToolbar, handleAssign, CampaignTable, router, slug, target, ids, count, campaignCsvColumns, columns, CampaignTableProps
- Contents summary: contains `use client`; exports: CampaignTable; internal imports: 6; package imports: 3

## `src/components/admin/campaigns/client-filter.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 36
- Bytes: 878
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): nuqs
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Exports: ClientFilter
- Symbol details: function ClientFilter (exported), interface Props
- Defines: ClientFilter, value, v, Props
- Contents summary: contains `use client`; exports: ClientFilter; internal imports: 1; package imports: 1

## `src/components/admin/campaigns/columns.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 207
- Bytes: 7373
- Imports (internal): src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, src/lib/formatters.tsx, src/app/admin/actions/campaigns.ts, src/lib/meta-campaigns.ts, src/components/admin/campaigns/campaign-cells.tsx
- Imports (packages): next/link, @tanstack/react-table, lucide-react, sonner
- Imported by: src/components/admin/campaigns/campaign-table.tsx
- Depends on groups: src/components / admin, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getCampaignColumns
- Symbol details: function getCampaignColumns (exported), const STATUS_OPTIONS, const TYPE_OPTIONS, interface CampaignColumnsOptions
- Defines: getCampaignColumns, STATUS_OPTIONS, TYPE_OPTIONS, m, CampaignColumnsOptions
- Contents summary: contains `use client`; exports: getCampaignColumns; internal imports: 7; package imports: 4

## `src/components/admin/campaigns/date-range-filter.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 37
- Bytes: 947
- Imports (packages): nuqs
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx
- Used by groups: src/app / admin
- Route owners: src/app/admin/campaigns/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/campaigns/page.test.tsx
- Exports: DateRangeFilter
- Symbol details: function DateRangeFilter (exported), const DATE_OPTIONS
- Defines: DateRangeFilter, DATE_OPTIONS, v
- Contents summary: contains `use client`; exports: DateRangeFilter; package imports: 1

## `src/components/admin/client-onboard-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 116
- Bytes: 3776
- Imports (internal): src/components/ui/input.tsx, src/components/ui/button.tsx, src/lib/to-slug.ts, src/app/admin/actions/clients.ts
- Imports (packages): react, lucide-react, sonner
- Imported by: src/app/admin/settings/page.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/settings/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: ClientOnboardForm
- Symbol details: function ClientOnboardForm (exported)
- Defines: ClientOnboardForm, handleNameChange, handleSubmit, client, res, data
- Contents summary: contains `use client`; exports: ClientOnboardForm; internal imports: 4; package imports: 3

## `src/components/admin/clients/assignment-manager.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 179
- Bytes: 5355
- Imports (internal): src/components/ui/button.tsx, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Imports (packages): react, lucide-react, sonner
- Imported by: src/components/admin/clients/members-section.tsx
- Depends on groups: src/components / ui, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: AssignmentManager
- Symbol details: function AssignmentManager (exported)
- Defines: AssignmentManager, toggleCampaign, toggleEvent, handleSave, next, totalAssigned
- Contents summary: contains `use client`; exports: AssignmentManager; internal imports: 3; package imports: 3

## `src/components/admin/clients/campaigns-section.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 76
- Bytes: 2587
- Imports (internal): src/components/ui/card.tsx, src/components/ui/table.tsx, src/lib/formatters.tsx, src/app/admin/clients/data.ts
- Imported by: src/components/admin/clients/client-detail.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: CampaignsSection
- Symbol details: function CampaignsSection (exported)
- Defines: CampaignsSection
- Contents summary: contains `use client`; exports: CampaignsSection; internal imports: 4

## `src/components/admin/clients/client-detail.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 169
- Bytes: 4975
- Imports (internal): src/app/admin/actions/clients.ts, src/components/admin/clients/client-detail.tsx
- Imports (packages): @testing-library/react, vitest, next/navigation, sonner
- Depends on groups: src/app / admin, src/components / admin
- Symbol details: const mockedUpdateClient, const client
- Defines: mockedUpdateClient, client
- Tests / describe labels: ClientDetailView, defaults to the overview tab, persists the agent toggle from the overview tab, persists the reports toggle from the overview tab, renders events when the Events tab is selected, renders pending invites on the Members tab
- Contents summary: tests/describes: ClientDetailView; defaults to the overview tab; persists the agent toggle from the overview tab; internal imports: 2; package imports: 4

## `src/components/admin/clients/client-detail.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 154
- Bytes: 4859
- Imports (internal): src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/events-section.tsx, src/app/admin/clients/data.ts
- Imports (packages): react, next/link, lucide-react
- Imported by: src/app/admin/clients/[id]/page.tsx, src/components/admin/clients/client-detail.test.tsx
- Depends on groups: src/lib, src/components / admin, src/app / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Routes related (direct): src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/components/admin/clients/client-detail.test.tsx
- Exports: ClientDetailView
- Symbol details: function ClientDetailView (exported), type Tab, interface Props
- Defines: ClientDetailView, Tab, Props
- Contents summary: contains `use client`; exports: ClientDetailView; internal imports: 7; package imports: 3

## `src/components/admin/clients/client-overview-tab.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 302
- Bytes: 11244
- Imports (internal): src/app/admin/actions/clients.ts, src/components/ui/switch.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx
- Imports (packages): react, lucide-react, sonner
- Imported by: src/components/admin/clients/client-detail.tsx
- Depends on groups: src/app / admin, src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: ClientOverviewTab
- Symbol details: function ClientOverviewTab (exported), type ClientUpdatePatch, interface ClientOverviewTabProps
- Defines: ClientOverviewTab, savePortalSettings, handleEventsToggle, handleReportsToggle, handleAgentToggle, handleBrandingSave, ClientUpdatePatch, ClientOverviewTabProps
- Contents summary: contains `use client`; exports: ClientOverviewTab; internal imports: 4; package imports: 3

## `src/components/admin/clients/client-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 242
- Bytes: 8688
- Imports (internal): src/components/ui/button.tsx, src/components/ui/input.tsx, src/app/admin/actions/clients.ts, src/lib/to-slug.ts, src/components/admin/data-table/data-table.tsx, src/components/admin/clients/columns.tsx, src/lib/formatters.tsx, src/lib/export-csv.ts, src/app/admin/clients/data.ts
- Imports (packages): react, next/navigation, lucide-react, sonner, next/link
- Imported by: src/app/admin/clients/page.tsx
- Depends on groups: src/components / ui, src/app / admin, src/lib, src/components / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/clients/page.tsx
- Routes related (direct): src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: ClientTable
- Symbol details: function ClientTable (exported), function CreateClientForm, function ClientSelectionToolbar, const clientCsvColumns, interface Props
- Defines: CreateClientForm, handleNameChange, submit, ClientSelectionToolbar, handleDeactivate, ClientTable, router, ids, confirmed, clientCsvColumns, createToolbar, Props
- Contents summary: contains `use client`; exports: ClientTable; internal imports: 9; package imports: 5

## `src/components/admin/clients/columns.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 319
- Bytes: 9915
- Imports (internal): src/components/admin/data-table/select-column.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx, src/components/admin/inline-edit.tsx, src/components/admin/copy-button.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/column-header.tsx, src/lib/formatters.tsx, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts
- Imports (packages): @tanstack/react-table, lucide-react, sonner
- Imported by: src/components/admin/clients/client-table.tsx
- Depends on groups: src/components / admin, src/components / ui, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: clientColumns
- Defines: c, joined, client, needsAttention, detail, healthyCount, roas, portalUrl
- Contents summary: contains `use client`; exports: clientColumns; internal imports: 10; package imports: 3

## `src/components/admin/clients/events-section.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 81
- Bytes: 2708
- Imports (internal): src/components/ui/card.tsx, src/components/ui/table.tsx, src/lib/formatters.tsx, src/app/admin/clients/data.ts
- Imports (packages): next/link
- Imported by: src/components/admin/clients/client-detail.tsx
- Depends on groups: src/components / ui, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: EventsSection
- Symbol details: function EventsSection (exported), interface EventsSectionProps
- Defines: EventsSection, EventsSectionProps
- Contents summary: contains `use client`; exports: EventsSection; internal imports: 4; package imports: 1

## `src/components/admin/clients/invite-member-form.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 102
- Bytes: 2965
- Imports (internal): src/components/ui/button.tsx, src/components/ui/input.tsx
- Imports (packages): react, next/navigation, lucide-react, sonner
- Imported by: src/components/admin/clients/members-section.tsx
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: InviteMemberForm
- Symbol details: function InviteMemberForm (exported)
- Defines: InviteMemberForm, submit, router, res, d
- Contents summary: contains `use client`; exports: InviteMemberForm; internal imports: 2; package imports: 4

## `src/components/admin/clients/members-section.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 229
- Bytes: 8862
- Imports (internal): src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/button.tsx, src/components/admin/confirm-dialog.tsx, src/lib/formatters.tsx, src/app/admin/actions/clients.ts, src/app/admin/clients/data.ts, src/components/admin/users/revoke-invitation-button.tsx, src/features/invitations/sort.ts, src/components/admin/clients/role-select.tsx, … (+3 more)
- Imports (packages): react, lucide-react, sonner
- Imported by: src/components/admin/clients/client-detail.tsx
- Depends on groups: src/components / ui, src/components / admin, src/lib, src/app / admin, src/features / invitations
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: MembersSection
- Symbol details: function MembersSection (exported)
- Defines: MembersSection, inviteCounts, inviteStatus
- Contents summary: contains `use client`; exports: MembersSection; internal imports: 13; package imports: 3

## `src/components/admin/clients/role-select.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 28
- Bytes: 617
- Imports (internal): src/app/admin/actions/clients.ts, src/components/admin/clients/saving-select.tsx
- Imported by: src/components/admin/clients/members-section.tsx
- Depends on groups: src/app / admin, src/components / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: RoleSelect
- Symbol details: function RoleSelect (exported), const ROLE_OPTIONS
- Defines: RoleSelect, ROLE_OPTIONS
- Contents summary: contains `use client`; exports: RoleSelect; internal imports: 2

## `src/components/admin/clients/saving-select.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 71
- Bytes: 1772
- Imports (packages): react, lucide-react, sonner
- Imported by: src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: SavingSelect
- Symbol details: function SavingSelect (exported), interface Option, interface SavingSelectProps
- Defines: SavingSelect, handleChange, Option, SavingSelectProps
- Contents summary: contains `use client`; exports: SavingSelect; package imports: 3

## `src/components/admin/clients/scope-select.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 28
- Bytes: 634
- Imports (internal): src/app/admin/actions/clients.ts, src/components/admin/clients/saving-select.tsx
- Imported by: src/components/admin/clients/members-section.tsx
- Depends on groups: src/app / admin, src/components / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx
- Exports: ScopeSelect
- Symbol details: function ScopeSelect (exported), const SCOPE_OPTIONS
- Defines: ScopeSelect, SCOPE_OPTIONS
- Contents summary: contains `use client`; exports: ScopeSelect; internal imports: 2

## `src/components/admin/collapsible-sidebar.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 33
- Bytes: 1064
- Imports (internal): src/hooks/use-sidebar-state.ts, src/components/admin/sidebar-content.tsx, src/lib/utils.ts
- Imported by: src/app/admin/layout.tsx
- Depends on groups: src / hooks, src/components / admin, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/layout.tsx
- Routes related (direct): src/app/admin/layout.tsx
- Exports: CollapsibleSidebar
- Symbol details: function CollapsibleSidebar (exported), interface CollapsibleSidebarProps
- Defines: CollapsibleSidebar, CollapsibleSidebarProps
- Contents summary: contains `use client`; exports: CollapsibleSidebar; internal imports: 3

## `src/components/admin/command-palette.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 174
- Bytes: 4961
- Imports (internal): src/components/admin/nav-config.ts, src/components/ui/command.tsx, src/app/admin/actions/search.ts
- Imports (packages): react, next/navigation, lucide-react
- Imported by: src/app/admin/layout.tsx
- Depends on groups: src/components / admin, src/components / ui, src/app / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/layout.tsx
- Routes related (direct): src/app/admin/layout.tsx
- Exports: CommandPalette
- Symbol details: function CommandPalette (exported)
- Defines: CommandPalette, onKeyDown, router, navigate, campaigns, events, clients, Icon, SearchableRecord
- Contents summary: contains `use client`; exports: CommandPalette; internal imports: 3; package imports: 3

## `src/components/admin/confirm-dialog.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 96
- Bytes: 2934
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): react, lucide-react
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.tsx
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Exports: ConfirmDialog
- Symbol details: function ConfirmDialog (exported), interface Props
- Defines: ConfirmDialog, handleKeyDown, handleConfirm, dialogRef, titleId, dialog, focusable, first, last, Props
- Contents summary: contains `use client`; exports: ConfirmDialog; internal imports: 1; package imports: 2

## `src/components/admin/copy-button.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 46
- Bytes: 1159
- Imports (packages): react, lucide-react
- Imported by: src/components/admin/clients/columns.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: CopyButton
- Symbol details: function CopyButton (exported), interface CopyButtonProps
- Defines: CopyButton, handleCopy, el, CopyButtonProps
- Contents summary: contains `use client`; exports: CopyButton; package imports: 2

## `src/components/admin/data-table/column-header.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 44
- Bytes: 1193
- Imports (internal): src/lib/utils.ts
- Imports (packages): @tanstack/react-table, lucide-react
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Exports: ColumnHeader
- Symbol details: function ColumnHeader (exported), interface ColumnHeaderProps
- Defines: ColumnHeader, sorted, ColumnHeaderProps
- Contents summary: contains `use client`; exports: ColumnHeader; internal imports: 1; package imports: 2

## `src/components/admin/data-table/data-table-pagination.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 55
- Bytes: 1757
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): @tanstack/react-table, lucide-react
- Imported by: src/components/admin/agents/job-history.tsx, src/components/admin/data-table/data-table.tsx
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/agents/job-history.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx
- Exports: DataTablePagination
- Symbol details: function DataTablePagination (exported), interface PaginationProps
- Defines: DataTablePagination, PaginationProps
- Contents summary: contains `use client`; exports: DataTablePagination; internal imports: 1; package imports: 2

## `src/components/admin/data-table/data-table-toolbar.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 83
- Bytes: 2704
- Imports (internal): src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx
- Imports (packages): @tanstack/react-table, lucide-react
- Imported by: src/components/admin/data-table/data-table.tsx
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: DataTableToolbar
- Symbol details: function DataTableToolbar (exported), interface ToolbarProps
- Defines: DataTableToolbar, column, ToolbarProps
- Contents summary: contains `use client`; exports: DataTableToolbar; internal imports: 3; package imports: 2

## `src/components/admin/data-table/data-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 192
- Bytes: 6715
- Imports (internal): src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx
- Imports (packages): @tanstack/react-table, react
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/events/event-table.tsx, src/components/admin/users/user-table.tsx
- Depends on groups: src/components / ui, src/components / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: DataTable
- Symbol details: function DataTable (exported), interface DataTableProps
- Defines: DataTable, table, selectedRows, DataTableProps
- Contents summary: contains `use client`; exports: DataTable; internal imports: 4; package imports: 2

## `src/components/admin/data-table/select-column.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 38
- Bytes: 1127
- Imports (packages): @tanstack/react-table
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/users/columns.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: createSelectColumn
- Symbol details: function createSelectColumn (exported)
- Defines: createSelectColumn, checked, indeterminate
- Contents summary: contains `use client`; exports: createSelectColumn; package imports: 1

## `src/components/admin/error-boundary.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 14
- Bytes: 278
- Imports (internal): src/components/shared/error-boundary.tsx
- Imported by: src/app/admin/agents/error.tsx, src/app/admin/campaigns/error.tsx, src/app/admin/clients/error.tsx, src/app/admin/dashboard/error.tsx, src/app/admin/events/error.tsx, src/app/admin/users/error.tsx
- Depends on groups: src/components / shared
- Used by groups: src/app / admin
- Exports: AdminError, default
- Symbol details: default function AdminError (exported)
- Defines: AdminError
- Contents summary: contains `use client`; exports: AdminError, default; internal imports: 1

## `src/components/admin/events/columns.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 217
- Bytes: 7724
- Imports (internal): src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, src/components/admin/inline-edit.tsx, src/lib/formatters.tsx, src/lib/campaign-event-match.ts, src/app/admin/actions/events.ts, src/app/admin/events/data.ts, src/components/admin/events/event-cells.tsx, src/lib/constants.ts
- Imports (packages): next/link, @tanstack/react-table, lucide-react, sonner
- Imported by: src/components/admin/events/event-table.tsx
- Depends on groups: src/components / admin, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: getEventColumns
- Symbol details: function getEventColumns (exported), interface EventColumnsOptions
- Defines: getEventColumns, parsed, linked, active, avgRoas, totalSpend, fansTotal, EventColumnsOptions
- Contents summary: contains `use client`; exports: getEventColumns; internal imports: 10; package imports: 4

## `src/components/admin/events/event-cells.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 56
- Bytes: 1946
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): lucide-react, react
- Imported by: src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: SellBarVisual, ClientSelect
- Symbol details: function SellBarVisual (exported), function ClientSelect (exported)
- Defines: SellBarVisual, ClientSelect, handleChange, capacity, pct, barColor
- Contents summary: contains `use client`; exports: SellBarVisual, ClientSelect; internal imports: 1; package imports: 2

## `src/components/admin/events/event-operating-panel.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 177
- Bytes: 7544
- Imports (internal): src/app/admin/actions/events.ts, src/components/admin/inline-edit.tsx, src/components/admin/status-select.tsx, src/components/admin/events/event-cells.tsx, src/features/events/server.ts, src/lib/formatters.tsx, src/lib/constants.ts
- Imports (packages): next/link, lucide-react, sonner
- Imported by: src/app/admin/events/[eventId]/page.tsx
- Depends on groups: src/app / admin, src/components / admin, src/features / events, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/events/[eventId]/page.tsx
- Routes related (direct): src/app/admin/events/[eventId]/page.tsx
- Exports: EventOperatingPanel
- Symbol details: function EventOperatingPanel (exported), interface EventOperatingPanelProps
- Defines: EventOperatingPanel, parsed, EventOperatingPanelProps
- Contents summary: contains `use client`; exports: EventOperatingPanel; internal imports: 7; package imports: 3

## `src/components/admin/events/event-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 186
- Bytes: 7293
- Imports (internal): src/components/admin/data-table/data-table.tsx, src/components/admin/events/columns.tsx, src/app/admin/actions/events.ts, src/lib/formatters.tsx, src/lib/export-csv.ts, src/app/admin/events/data.ts, src/lib/constants.ts
- Imports (packages): react, next/navigation, sonner
- Imported by: src/app/admin/events/page.test.tsx, src/app/admin/events/page.tsx
- Depends on groups: src/components / admin, src/app / admin, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/events/page.tsx
- Routes related (direct): src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/admin/events/page.test.tsx
- Exports: EventTable
- Symbol details: function EventTable (exported), function EventSelectionToolbar, const eventCsvColumns, interface EventTableProps
- Defines: EventSelectionToolbar, handleAssignClient, handleUpdateStatus, EventTable, router, ids, eventCsvColumns, columns, soldPct, EventTableProps
- Contents summary: contains `use client`; exports: EventTable; internal imports: 7; package imports: 3

## `src/components/admin/inline-edit.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 63
- Bytes: 1913
- Imports (packages): react, lucide-react
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/page.tsx
- Tests related: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: InlineEdit
- Symbol details: function InlineEdit (exported), interface Props
- Defines: InlineEdit, save, Props
- Contents summary: contains `use client`; exports: InlineEdit; package imports: 2

## `src/components/admin/mobile-sidebar.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 53
- Bytes: 1932
- Imports (internal): src/components/ui/sheet.tsx, src/components/admin/sidebar-content.tsx
- Imports (packages): react, next/image, lucide-react
- Imported by: src/app/admin/layout.tsx
- Depends on groups: src/components / ui, src/components / admin
- Used by groups: src/app / admin
- Route owners: src/app/admin/layout.tsx
- Routes related (direct): src/app/admin/layout.tsx
- Exports: MobileSidebar
- Symbol details: function MobileSidebar (exported), interface MobileSidebarProps
- Defines: MobileSidebar, MobileSidebarProps
- Contents summary: contains `use client`; exports: MobileSidebar; internal imports: 2; package imports: 3

## `src/components/admin/nav-config.test.ts`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 18
- Bytes: 568
- Imports (internal): src/components/admin/nav-config.ts
- Imports (packages): vitest
- Depends on groups: src/components / admin
- Tests / describe labels: adminNavItems, matches the approved admin shell
- Contents summary: tests/describes: adminNavItems; matches the approved admin shell; internal imports: 1; package imports: 1

## `src/components/admin/nav-config.ts`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: TypeScript module
- Construction: code module
- Lines: 29
- Bytes: 798
- Imports (packages): lucide-react
- Imported by: src/components/admin/activity-tracker.test.ts, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/nav-config.test.ts, src/components/admin/nav-links.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Tests related: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- Tests related (direct): src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- Exports: adminNavItems, NavItem
- Symbol details: interface NavItem (exported)
- Defines: LucideIcon, NavItem
- Contents summary: exports: adminNavItems, NavItem; package imports: 1

## `src/components/admin/nav-links.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 86
- Bytes: 2573
- Imports (internal): src/lib/utils.ts, src/components/ui/tooltip.tsx, src/components/admin/nav-config.ts
- Imports (packages): next/link, next/navigation
- Imported by: src/components/admin/sidebar-content.tsx
- Depends on groups: src/lib, src/components / ui, src/components / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: NavLinks
- Symbol details: function NavLinks (exported), interface NavLinksProps
- Defines: NavLinks, pathname, active, NavLinksProps
- Contents summary: contains `use client`; exports: NavLinks; internal imports: 3; package imports: 2

## `src/components/admin/page-header.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 28
- Bytes: 935
- Imports (packages): react
- Imported by: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Used by groups: src/app / admin
- Route owners: src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, … (+1 more)
- Routes related (direct): src/app/admin/agents/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/admin/settings/page.tsx, … (+1 more)
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/admin/reports/page.test.tsx
- Exports: AdminPageHeader
- Symbol details: function AdminPageHeader (exported), interface AdminPageHeaderProps
- Defines: AdminPageHeader, AdminPageHeaderProps
- Contents summary: exports: AdminPageHeader; package imports: 1

## `src/components/admin/run-button.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 76
- Bytes: 1982
- Imports (internal): src/components/ui/button.tsx
- Imports (packages): react, lucide-react
- Imported by: src/components/admin/agents/agent-sidebar.tsx
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/agents/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: RunButton
- Symbol details: function RunButton (exported), type State, interface RunButtonProps
- Defines: RunButton, handleRun, res, body, State, RunButtonProps
- Contents summary: contains `use client`; exports: RunButton; internal imports: 1; package imports: 2

## `src/components/admin/sidebar-content.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 62
- Bytes: 2295
- Imports (internal): src/components/admin/nav-links.tsx, src/components/admin/user-avatar.tsx
- Imports (packages): next/image, lucide-react
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/mobile-sidebar.tsx
- Depends on groups: src/components / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: SidebarContent
- Symbol details: function SidebarContent (exported), interface SidebarContentProps
- Defines: SidebarContent, SidebarContentProps
- Contents summary: exports: SidebarContent; internal imports: 2; package imports: 2

## `src/components/admin/stat-card.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 88
- Bytes: 2822
- Imports (internal): src/components/ui/card.tsx
- Imports (packages): lucide-react
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/components/stat-card.tsx, src/components/admin/clients/client-detail.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / admin, src/app / client, src/components / admin
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Routes related (direct): src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Exports: StatCard, StatCardProps
- Symbol details: function StatCard (exported), interface StatCardProps (exported)
- Defines: StatCard, isLg, StatCardProps
- Contents summary: exports: StatCard, StatCardProps; internal imports: 1; package imports: 1

## `src/components/admin/status-select.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 41
- Bytes: 1071
- Imports (packages): react, lucide-react
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/users/columns.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/events/[eventId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: StatusSelect
- Symbol details: function StatusSelect (exported), interface Props
- Defines: StatusSelect, handleChange, Props
- Contents summary: contains `use client`; exports: StatusSelect; package imports: 2

## `src/components/admin/user-avatar.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 28
- Bytes: 685
- Imports (packages): next/dynamic, @clerk/nextjs
- Imported by: src/components/admin/sidebar-content.tsx
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: UserAvatar
- Symbol details: function UserAvatar (exported), const ClerkUserButton, interface Props
- Defines: UserAvatar, ClerkUserButton, Props
- Contents summary: contains `use client`; exports: UserAvatar; package imports: 2

## `src/components/admin/users/columns.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 247
- Bytes: 8575
- Imports (internal): src/components/admin/data-table/select-column.tsx, src/components/ui/button.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/status-select.tsx, src/components/ui/dropdown-menu.tsx, src/lib/formatters.tsx, src/app/admin/actions/users.ts, src/app/admin/users/data.ts
- Imports (packages): react, @tanstack/react-table, lucide-react, sonner
- Imported by: src/components/admin/users/user-table.tsx
- Depends on groups: src/components / admin, src/components / ui, src/lib, src/app / admin
- Used by groups: src/components / admin
- Route owners: src/app/admin/users/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: getUserColumns, ClientOption
- Symbol details: function getUserColumns (exported), function AssignCell, interface ClientOption (exported), interface UserColumnsOptions
- Defines: AssignCell, toggle, getUserColumns, isAdding, res, next, count, u, inviteStatus, ClientOption, UserColumnsOptions
- Contents summary: contains `use client`; exports: getUserColumns, ClientOption; internal imports: 10; package imports: 4

## `src/components/admin/users/revoke-invitation-button.test.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: test file
- Construction: test specification
- Lines: 51
- Bytes: 1261
- Imports (internal): src/components/admin/users/revoke-invitation-button.tsx, src/app/admin/actions/users.ts
- Imports (packages): vitest, react, @testing-library/react, next/navigation, sonner
- Depends on groups: src/components / admin, src/app / admin
- Symbol details: const refresh
- Defines: refresh
- Tests / describe labels: RevokeInvitationButton, confirms and revokes the pending invite
- Contents summary: tests/describes: RevokeInvitationButton; confirms and revokes the pending invite; internal imports: 2; package imports: 5

## `src/components/admin/users/revoke-invitation-button.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 42
- Bytes: 1050
- Imports (internal): src/components/admin/confirm-dialog.tsx, src/app/admin/actions/users.ts
- Imports (packages): next/navigation, sonner
- Imported by: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Depends on groups: src/components / admin, src/app / admin
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Routes related (direct): src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Tests related (direct): src/components/admin/users/revoke-invitation-button.test.tsx
- Exports: RevokeInvitationButton
- Symbol details: function RevokeInvitationButton (exported), interface RevokeInvitationButtonProps
- Defines: RevokeInvitationButton, router, RevokeInvitationButtonProps
- Contents summary: contains `use client`; exports: RevokeInvitationButton; internal imports: 2; package imports: 2

## `src/components/admin/users/user-table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / admin
- Ownership: shared admin UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 260
- Bytes: 9892
- Imports (internal): src/components/ui/button.tsx, src/app/admin/users/data.ts, src/components/admin/data-table/data-table.tsx, src/components/admin/users/columns.tsx, src/app/admin/actions/users.ts, src/lib/formatters.tsx, src/lib/export-csv.ts
- Imports (packages): react, next/navigation, lucide-react, sonner
- Imported by: src/app/admin/users/page.tsx
- Depends on groups: src/components / ui, src/app / admin, src/components / admin, src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/users/page.tsx
- Routes related (direct): src/app/admin/users/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: UserTable
- Symbol details: function UserTable (exported), function InviteForm, function UserSelectionToolbar, const ROLE_OPTIONS, const userCsvColumns, interface Props
- Defines: InviteForm, submit, UserSelectionToolbar, handleUpdateRole, UserTable, res, text, ROLE_OPTIONS, router, ids, userCsvColumns, columns, … (+1 more)
- Contents summary: contains `use client`; exports: UserTable; internal imports: 7; package imports: 4
