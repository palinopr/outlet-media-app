# Route Stack Map

Generated from the current working tree on 2026-04-10 18:02:26.

This page documents each Next.js special route file and the internal stack it pulls in through direct and transitive imports.

## `/`
- Route file: `src/app/layout.tsx`
- Type: Next.js layout
- Ownership: web root/shared route surface
- Direct internal imports: src/app/globals.css
- Transitive internal stack size: 1
- Groups touched: src/app / root routes
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- src/app / root routes: src/app/globals.css

## `/`
- Route file: `src/app/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: src/features/client-portal/entry.ts
- Transitive internal stack size: 3
- Groups touched: src/features / client-portal, src/lib
- Feature modules touched: client-portal
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/member-access.ts
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+24 more)

### Stack by group
- src/features / client-portal: src/features/client-portal/entry.ts
- src/lib: src/lib/supabase.ts, src/lib/member-access.ts

## `/admin`
- Route file: `src/app/admin/layout.tsx`
- Type: Next.js layout
- Ownership: web admin route surface
- Direct internal imports: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx
- Transitive internal stack size: 22
- Groups touched: src/components / admin, src/components / ui, src/app / admin, src / hooks, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Related tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts, src/app/admin/actions/search.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, … (+29 more)

### Stack by group
- src / hooks: src/hooks/use-sidebar-state.ts
- src/app / admin: src/app/admin/actions/search.ts
- src/components / admin: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/sidebar-content.tsx, src/components/admin/nav-config.ts, src/components/admin/nav-links.tsx, src/components/admin/user-avatar.tsx
- src/components / ui: src/components/ui/sheet.tsx, src/components/ui/command.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/dialog.tsx, src/components/ui/tooltip.tsx, src/components/ui/button.tsx
- src/lib: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts

## `/admin/agents`
- Route file: `src/app/admin/agents/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/agents`
- Route file: `src/app/admin/agents/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/app/admin/agents/data.ts, src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/job-history.tsx, src/components/ui/sheet.tsx, src/components/ui/button.tsx, src/components/admin/page-header.tsx
- Transitive internal stack size: 32
- Groups touched: src/app / admin, src/components / admin, src/components / ui, src/features / agent-outcomes, src/features / agents, src/lib, src/features / assets, src/features / operations-center, src/features / invitations
- Feature modules touched: agent-outcomes, agents, assets, operations-center, invitations
- Shared libs/runtime files touched: src/lib/agent-jobs.ts, src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
- Related tests: src/app/shell-import-smoke.test.ts, src/components/admin/agents/job-history.test.tsx, src/components/admin/agents/command-summary.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/agent-outcomes/server.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, __tests__/features/agents/summary.test.ts, __tests__/api/agents-jobs.test.ts, __tests__/lib/formatters.test.ts, … (+37 more)

### Stack by group
- src/app / admin: src/app/admin/agents/data.ts
- src/components / admin: src/components/admin/agents/chat-panel.tsx, src/components/admin/agents/command-summary.tsx, src/components/admin/agents/agent-sidebar.tsx, src/components/admin/agents/job-history.tsx, src/components/admin/page-header.tsx, src/components/admin/agents/constants.ts, src/components/admin/agents/status-badge.tsx, src/components/admin/run-button.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/data-table/data-table-pagination.tsx
- src/components / ui: src/components/ui/sheet.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / agents: src/features/agents/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / operations-center: src/features/operations-center/summary.ts
- src/lib: src/lib/agent-jobs.ts, src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts

## `/admin/campaigns`
- Route file: `src/app/admin/campaigns/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/campaigns`
- Route file: `src/app/admin/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/admin/stat-card.tsx, src/app/admin/campaigns/data.ts, src/lib/constants.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/components/admin/page-header.tsx
- Transitive internal stack size: 38
- Groups touched: src/components / ui, src/components / admin, src/app / admin, src/lib, src/features / invitations, src/features / workflow, src/features / system-events, src/features / campaigns
- Feature modules touched: invitations, workflow, system-events, campaigns
- Shared libs/runtime files touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, … (+1 more)
- Related tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/events/page.test.tsx, __tests__/lib/formatters.test.ts, __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/approvals/server.test.ts, … (+37 more)

### Stack by group
- src/app / admin: src/app/admin/campaigns/data.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, … (+2 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts

## `/admin/campaigns/[campaignId]`
- Route file: `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Transitive internal stack size: 40
- Groups touched: src/components / admin, src/features / campaigns, src/lib, src/app / admin, src/components / ui, src/features / assets, src/features / campaign-action-items, src/features / campaign-comments, src/features / approvals, src/features / system-events, src/features / events, src/features / invitations, … (+3 more)
- Feature modules touched: campaigns, assets, campaign-action-items, campaign-comments, approvals, system-events, events, invitations, workflow, notifications, event-comments
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, … (+4 more)
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/components/admin/client-requests-panel.test.tsx, __tests__/lib/formatters.test.ts, __tests__/app/client/data.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, … (+45 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / admin: src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/client-requests-panel.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/button.tsx
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/lib.ts, src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/server.ts, src/features/campaigns/ownership-sync.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/utils.ts, src/lib/member-access.ts, … (+2 more)

## `/admin/clients`
- Route file: `src/app/admin/clients/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/clients`
- Route file: `src/app/admin/clients/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/app/admin/clients/data.ts, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/features/clients/summary.ts, src/components/admin/page-header.tsx
- Transitive internal stack size: 38
- Groups touched: src/components / ui, src/app / admin, src/lib, src/components / admin, src/features / clients, src/features / invitations, src/features / settings, src/features / access
- Feature modules touched: clients, invitations, settings, access
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/to-slug.ts, src/lib/export-csv.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/clients/summary.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, … (+36 more)

### Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/inline-edit.tsx, src/components/admin/copy-button.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/column-header.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/to-slug.ts, src/lib/export-csv.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts

## `/admin/clients/[id]`
- Route file: `src/app/admin/clients/[id]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/app/admin/clients/data.ts, src/components/admin/clients/client-detail.tsx
- Transitive internal stack size: 37
- Groups touched: src/app / admin, src/components / admin, src/lib, src/features / clients, src/features / invitations, src/features / settings, src/components / ui, src/features / access
- Feature modules touched: clients, invitations, settings, access
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Related tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, … (+36 more)

### Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/users.ts
- src/components / admin: src/components/admin/clients/client-detail.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/events-section.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/invite-member-form.tsx, … (+1 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/button.tsx, src/components/ui/switch.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/lib: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts

## `/admin/dashboard`
- Route file: `src/app/admin/dashboard/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/dashboard`
- Route file: `src/app/admin/dashboard/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/components/charts/ticket-velocity-chart.tsx, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/components/admin/agents/constants.ts, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/upcoming-shows.tsx, … (+2 more)
- Transitive internal stack size: 25
- Groups touched: src/components / ui, src/components / charts, src/lib, src/components / admin, src/app / admin, src/features / invitations, src/app / client, src/features / client-portal
- Feature modules touched: invitations, client-portal
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/agent-jobs.ts, src/lib/campaign-client-assignment.ts, src/lib/campaign-event-match.ts, src/lib/client-slug.ts, src/lib/constants.ts
- Related tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, src/components/admin/agents/constants.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, … (+29 more)

### Stack by group
- src/app / admin: src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/upcoming-shows.tsx, src/app/admin/dashboard/campaign-cards.tsx
- src/app / client: src/app/client/[slug]/lib.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/agents/constants.ts, src/components/admin/page-header.tsx
- src/components / charts: src/components/charts/roas-trend-chart.tsx, src/components/charts/ticket-velocity-chart.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/table.tsx
- src/features / client-portal: src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/agent-jobs.ts, src/lib/campaign-client-assignment.ts, src/lib/campaign-event-match.ts, src/lib/client-slug.ts, src/lib/constants.ts

## `/admin/events`
- Route file: `src/app/admin/events/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/events`
- Route file: `src/app/admin/events/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/admin/stat-card.tsx, src/app/admin/events/data.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/events/event-table.tsx, src/lib/formatters.tsx, src/components/admin/page-header.tsx
- Transitive internal stack size: 34
- Groups touched: src/components / ui, src/components / admin, src/app / admin, src/lib, src/features / invitations, src/features / workflow, src/features / system-events
- Feature modules touched: invitations, workflow, system-events
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/constants.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/campaign-event-match.ts, src/lib/api-helpers.ts
- Related tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, … (+34 more)

### Stack by group
- src/app / admin: src/app/admin/events/data.ts, src/app/admin/actions/events.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/events/event-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/events/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, src/components/admin/inline-edit.tsx, … (+1 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/dropdown-menu.tsx
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/constants.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/campaign-event-match.ts, src/lib/api-helpers.ts

## `/admin/events/[eventId]`
- Route file: `src/app/admin/events/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/admin/client-requests-panel.tsx, src/components/admin/page-header.tsx, src/components/admin/stat-card.tsx, src/components/admin/events/event-operating-panel.tsx, src/features/events/server.ts, src/lib/formatters.tsx
- Transitive internal stack size: 27
- Groups touched: src/components / admin, src/features / events, src/lib, src/components / ui, src/app / admin, src-features-event-comments, src/features / system-events, src/features / invitations, src/features / workflow
- Feature modules touched: events, event-comments, system-events, invitations, workflow
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts
- Related tests: src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/client-requests-panel.test.tsx, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/api/event-comments/route.test.ts, __tests__/lib/formatters.test.ts, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, … (+38 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / admin: src/app/admin/actions/events.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/client-requests-panel.tsx, src/components/admin/page-header.tsx, src/components/admin/stat-card.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/inline-edit.tsx, src/components/admin/status-select.tsx, src/components/admin/events/event-cells.tsx
- src/components / ui: src/components/ui/button.tsx, src/components/ui/card.tsx
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts

## `/admin/reports`
- Route file: `src/app/admin/reports/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/admin/page-header.tsx, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts
- Transitive internal stack size: 31
- Groups touched: src/components / admin, src/features / reports, src/lib, src/features / client-portal, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / invitations, src/features / assets, src/features / approvals, src/features / conversations, src-features-event-comments, … (+1 more)
- Feature modules touched: reports, client-portal, agent-outcomes, dashboard, events, invitations, assets, approvals, conversations, event-comments, system-events
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/reports/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, … (+46 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/components / admin: src/components/admin/page-header.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-portal: src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/admin/settings`
- Route file: `src/app/admin/settings/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/client-onboard-form.tsx, src/components/admin/agents/constants.ts, src/components/admin/users/revoke-invitation-button.tsx, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/components/admin/stat-card.tsx, src/lib/formatters.tsx, src/features/settings/summary.ts, … (+4 more)
- Transitive internal stack size: 33
- Groups touched: src/components / ui, src/components / admin, src/app / admin, src/lib, src/features / settings, src/features / clients, src/features / invitations, src/features / shared, src/features / access
- Feature modules touched: settings, clients, invitations, shared, access
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/utils.ts, src/lib/to-slug.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/client-slug.ts
- Related tests: src/app/shell-import-smoke.test.ts, src/components/admin/agents/constants.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/clients/data.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/settings/summary.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, … (+40 more)

### Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/admin/clients/types.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/client-onboard-form.tsx, src/components/admin/agents/constants.ts, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/summary.ts, src/features/settings/connected-accounts.ts
- src/features / shared: src/features/shared/admin-summary-types.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/utils.ts, src/lib/to-slug.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/client-slug.ts

## `/admin/users`
- Route file: `src/app/admin/users/loading.tsx`
- Type: Next.js loading UI
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- src/lib: src/lib/utils.ts

## `/admin/users`
- Route file: `src/app/admin/users/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/lib/formatters.tsx, src/features/users/summary.ts, src/components/admin/page-header.tsx
- Transitive internal stack size: 38
- Groups touched: src/app / admin, src/components / admin, src/components / ui, src/lib, src/features / users, src/features / invitations, src/features / clients, src/features / settings, src/features / shared, src/features / access
- Feature modules touched: users, invitations, clients, settings, shared, access
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, __tests__/lib/formatters.test.ts, __tests__/features/users/summary.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, … (+35 more)

### Stack by group
- src/app / admin: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/users.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
- src/features / clients: src/features/clients/summary.ts
- src/features / invitations: src/features/invitations/server.ts, src/features/invitations/types.ts, src/features/invitations/sort.ts
- src/features / settings: src/features/settings/connected-accounts.ts
- src/features / shared: src/features/shared/admin-summary-types.ts
- src/features / users: src/features/users/summary.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts

## `/api/admin/activity`
- Route file: `src/app/api/admin/activity/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Transitive internal stack size: 2
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+26 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## `/api/admin/invite`
- Route file: `src/app/api/admin/invite/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: src/app/api/admin/invite/route.test.ts, __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, … (+28 more)

### Stack by group
- src/lib: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts

## `/api/admin/users/[id]`
- Route file: `src/app/api/admin/users/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Transitive internal stack size: 2
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+26 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## `/api/agent-outcomes/action-item`
- Route file: `src/app/api/agent-outcomes/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/features/system-events/server.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts, src/features/workflow/revalidation.ts
- Transitive internal stack size: 22
- Groups touched: src/lib, src/features / system-events, src/features / agent-outcomes, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items, src/features / workflow, src/features / assets, src/features / notifications, src/features / campaigns
- Feature modules touched: system-events, agent-outcomes, asset-follow-up-items, campaign-action-items, event-follow-up-items, workflow, assets, notifications, campaigns
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, … (+39 more)

### Stack by group
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / asset-follow-up-items: src/features/asset-follow-up-items/server.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / event-follow-up-items: src/features/event-follow-up-items/server.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts

## `/api/agents`
- Route file: `src/app/api/agents/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/features/system-events/server.ts, src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Transitive internal stack size: 5
- Groups touched: src/features / system-events, src/lib
- Feature modules touched: system-events
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Related tests: __tests__/api/agents.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/integration.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/system-events/scope-filter.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, … (+31 more)

### Stack by group
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts

## `/api/agents/email/watch`
- Route file: `src/app/api/agents/email/watch/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/api/agents/heartbeat`
- Route file: `src/app/api/agents/heartbeat/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/agents-heartbeat.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, … (+29 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## `/api/agents/job/[id]`
- Route file: `src/app/api/agents/job/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+26 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts

## `/api/agents/jobs`
- Route file: `src/app/api/agents/jobs/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+26 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts

## `/api/alerts`
- Route file: `src/app/api/alerts/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/alerts.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, … (+29 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## `/api/campaign-comments`
- Route file: `src/app/api/campaign-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-comments/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Transitive internal stack size: 18
- Groups touched: src/lib, src/features / campaign-comments, src/features / notifications, src/features / client-portal, src/features / system-events, src/features / workflow, src/features / assets, src/features / campaigns
- Feature modules touched: campaign-comments, notifications, client-portal, system-events, workflow, assets, campaigns
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/member-access.ts
- Related tests: src/app/api/campaign-comments/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/lib/api-schemas.test.ts, … (+39 more)

### Stack by group
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/scope.ts
- src/features / notifications: src/features/notifications/discussions.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/member-access.ts

## `/api/campaign-comments/action-item`
- Route file: `src/app/api/campaign-comments/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/features/campaign-action-items/server.ts, src/features/workflow/revalidation.ts, src/lib/supabase.ts
- Transitive internal stack size: 18
- Groups touched: src/lib, src/features / campaign-action-items, src/features / workflow, src/features / notifications, src/features / system-events, src/features / assets, src/features / campaigns
- Feature modules touched: campaign-action-items, workflow, notifications, system-events, assets, campaigns
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/member-access.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+36 more)

### Stack by group
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/member-access.ts

## `/api/client/[slug]/agent/threads`
- Route file: `src/app/api/client/[slug]/agent/threads/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/features/client-agent/server.ts
- Transitive internal stack size: 56
- Groups touched: src/features / client-agent, src/features / client-portal, src/features / system-events, src/features / workflow, src/lib, src/features / reports, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / assets, src/features / approvals, src/features / conversations, … (+3 more)
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs/runtime files touched: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, … (+62 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-agent: src/features/client-agent/server.ts, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts, src/features/client-agent/runtime.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/tools/index.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/tools/search.ts, src/features/client-agent/tools/overview.ts, … (+4 more)
- src/features / client-portal: src/features/client-portal/config.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/scope.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/api/client/[slug]/agent/threads/[threadId]`
- Route file: `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/features/client-agent/server.ts
- Transitive internal stack size: 56
- Groups touched: src/features / client-agent, src/features / client-portal, src/features / system-events, src/features / workflow, src/lib, src/features / reports, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / assets, src/features / approvals, src/features / conversations, … (+3 more)
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs/runtime files touched: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, … (+62 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-agent: src/features/client-agent/server.ts, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts, src/features/client-agent/runtime.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/tools/index.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/tools/search.ts, src/features/client-agent/tools/overview.ts, … (+4 more)
- src/features / client-portal: src/features/client-portal/config.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/scope.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/api/client/[slug]/agent/threads/[threadId]/messages`
- Route file: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/features/client-agent/server.ts, src/features/client-agent/types.ts, src/features/client-agent/thread-context.ts
- Transitive internal stack size: 57
- Groups touched: src/lib, src/features / client-agent, src/features / client-portal, src/features / system-events, src/features / workflow, src/features / reports, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / assets, src/features / approvals, src/features / conversations, … (+3 more)
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, … (+1 more)
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, … (+67 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-agent: src/features/client-agent/server.ts, src/features/client-agent/types.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/runtime.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/tools/index.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/tools/search.ts, src/features/client-agent/tools/overview.ts, … (+4 more)
- src/features / client-portal: src/features/client-portal/config.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/scope.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/api/contact`
- Route file: `src/app/api/contact/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/integration.test.ts, … (+28 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## `/api/event-comments`
- Route file: `src/app/api/event-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Transitive internal stack size: 24
- Groups touched: src/lib, src-features-event-comments, src/features / events, src/features / notifications, src/features / client-portal, src/features / system-events, src/features / workflow, src/features / assets, src/features / campaigns, src/features / invitations
- Feature modules touched: event-comments, events, notifications, client-portal, system-events, workflow, assets, campaigns, invitations
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/formatters.tsx, src/lib/workspace-types.ts, … (+1 more)
- Related tests: src/app/api/event-comments/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, __tests__/lib/api-schemas.test.ts, … (+43 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/scope.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/discussions.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/formatters.tsx, src/lib/workspace-types.ts, src/lib/status.ts

## `/api/health`
- Route file: `src/app/api/health/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: package.json
- Transitive internal stack size: 1
- Groups touched: Root Files
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/api/health/route.test.ts

### Stack by group
- Root Files: package.json

## `/api/ingest`
- Route file: `src/app/api/ingest/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-tm-events.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/ingest-tm-demographics.ts
- Transitive internal stack size: 6
- Groups touched: src/lib, src/app / api
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, … (+29 more)

### Stack by group
- src/app / api: src/app/api/ingest/ingest-tm-events.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/ingest-tm-demographics.ts
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## `/api/meta/callback`
- Route file: `src/app/api/meta/callback/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/api/meta/callback/route.test.ts

### Stack by group
- none

## `/api/meta/data-deletion`
- Route file: `src/app/api/meta/data-deletion/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Transitive internal stack size: 2
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Related tests: src/app/api/meta/data-deletion/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/conversations/read-clients.test.ts, … (+22 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/meta-oauth.ts

## `/api/ticketmaster/tm1/move-selection`
- Route file: `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Transitive internal stack size: 2
- Groups touched: src/lib, src/lib / ticketmaster
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, src/lib/ticketmaster/tm1-client.test.ts

### Stack by group
- src/lib: src/lib/api-helpers.ts
- src/lib / ticketmaster: src/lib/ticketmaster/tm1-client.ts

## `/api/ticketmaster/tm1/request-move-selection`
- Route file: `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Transitive internal stack size: 2
- Groups touched: src/lib, src/lib / ticketmaster
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts, src/lib/ticketmaster/tm1-client.test.ts

### Stack by group
- src/lib: src/lib/api-helpers.ts
- src/lib / ticketmaster: src/lib/ticketmaster/tm1-client.ts

## `/api/ticketmaster/tm1/snapshot`
- Route file: `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Transitive internal stack size: 2
- Groups touched: src/lib, src/lib / ticketmaster
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts, __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/lib/api-helpers.test.ts, src/lib/ticketmaster/tm1-client.test.ts

### Stack by group
- src/lib: src/lib/api-helpers.ts
- src/lib / ticketmaster: src/lib/ticketmaster/tm1-client.ts

## `/api/user/profile`
- Route file: `src/app/api/user/profile/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts
- Transitive internal stack size: 1
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts
- Related tests: __tests__/api/agents-jobs.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/app/api/ticketmaster/tm1/move-selection/route.test.ts, src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts, src/app/api/ticketmaster/tm1/snapshot/route.test.ts, src/lib/api-helpers.test.ts

### Stack by group
- src/lib: src/lib/api-helpers.ts

## `/client`
- Route file: `src/app/client/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/components/ui/button.tsx, src/features/client-portal/entry.ts
- Transitive internal stack size: 5
- Groups touched: src/components / ui, src/features / client-portal, src/lib
- Feature modules touched: client-portal
- Shared libs/runtime files touched: src/lib/utils.ts, src/lib/supabase.ts, src/lib/member-access.ts
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, __tests__/app/client/event-detail-data.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, … (+24 more)

### Stack by group
- src/components / ui: src/components/ui/button.tsx
- src/features / client-portal: src/features/client-portal/entry.ts
- src/lib: src/lib/utils.ts, src/lib/supabase.ts, src/lib/member-access.ts

## `/client/[slug]`
- Route file: `src/app/client/[slug]/layout.tsx`
- Type: Next.js layout
- Ownership: web client route surface
- Direct internal imports: src/lib/formatters.tsx, src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- Transitive internal stack size: 16
- Groups touched: src/lib, src/app / client, src/features / client-portal, src/features / invitations, src/components / ui
- Feature modules touched: client-portal, invitations
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/utils.ts
- Related tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/entry.test.ts, … (+30 more)

### Stack by group
- src/app / client: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/[slug]/components/nav-config.ts
- src/components / ui: src/components/ui/dialog.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx
- src/features / client-portal: src/features/client-portal/theme.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/utils.ts

## `/client/[slug]`
- Route file: `src/app/client/[slug]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]`
- Route file: `src/app/client/[slug]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/client/[slug]/page.test.tsx

### Stack by group
- none

## `/client/[slug]/agent`
- Route file: `src/app/client/[slug]/agent/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]/agent`
- Route file: `src/app/client/[slug]/agent/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-agent/server.ts, src/features/client-agent/components/agent-shell.tsx
- Transitive internal stack size: 59
- Groups touched: src/lib, src/features / client-portal, src/features / client-agent, src/features / invitations, src/features / system-events, src/features / workflow, src/features / reports, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / assets, src/features / approvals, … (+3 more)
- Feature modules touched: client-portal, client-agent, invitations, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, … (+1 more)
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/agent/page.test.tsx, __tests__/lib/formatters.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, … (+63 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-agent: src/features/client-agent/server.ts, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx, src/features/client-agent/runtime.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/tools/index.ts, … (+7 more)
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/scope.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/client/[slug]/campaign/[campaignId]`
- Route file: `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]/campaign/[campaignId]`
- Route file: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, … (+3 more)
- Transitive internal stack size: 60
- Groups touched: src/lib, src/app / client, src/components / client, src/features / client-portal, src/features / campaigns, src/features / invitations, src/features / campaign-action-items, src/features / campaign-comments, src/features / approvals, src/features / system-events, src/features / agent-outcomes, src/features / notifications, … (+2 more)
- Feature modules touched: client-portal, campaigns, invitations, campaign-action-items, campaign-comments, approvals, system-events, agent-outcomes, notifications, assets
- Shared libs/runtime files touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, … (+3 more)
- Related tests: src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+49 more)

### Stack by group
- src/app / client: src/app/client/[slug]/types.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/data.ts, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/components/campaign-discussion-form.tsx
- src/components / client: src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+3 more)
- src/components / ui: src/components/ui/button.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/features/client-portal/types.ts, src/features/client-portal/scope.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/meta-campaigns.ts, src/lib/agent-dispatch.ts, … (+1 more)

## `/client/[slug]/campaigns`
- Route file: `src/app/client/[slug]/campaigns/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]/campaigns`
- Route file: `src/app/client/[slug]/campaigns/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts
- Transitive internal stack size: 22
- Groups touched: src/components / charts, src/lib, src/app / client, src/features / client-portal, src/features / invitations
- Feature modules touched: client-portal, invitations
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, … (+35 more)

### Stack by group
- src/app / client: src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/types.ts
- src/components / charts: src/components/charts/roas-trend-chart.tsx
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/insights.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts

## `/client/[slug]/event/[eventId]`
- Route file: `src/app/client/[slug]/event/[eventId]/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]/event/[eventId]`
- Route file: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/lib/formatters.tsx, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, … (+2 more)
- Transitive internal stack size: 56
- Groups touched: src/lib, src/app / client, src/components / client, src/features / client-portal, src/features / events, src/features / invitations, src-features-event-comments, src/features / agent-outcomes, src/features / approvals, src/features / event-follow-up-items, src/features / system-events, src/components / ui, … (+3 more)
- Feature modules touched: client-portal, events, invitations, event-comments, agent-outcomes, approvals, event-follow-up-items, system-events, assets, notifications, campaigns
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/agent-dispatch.ts, … (+1 more)
- Related tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, __tests__/app/client/event-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, … (+46 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/components/progress-bar.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/audience-section.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/event-discussion-form.tsx
- src/components / client: src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, src/components/client/charts/ticket-sales-chart.tsx, … (+2 more)
- src/components / ui: src/components/ui/button.tsx
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/scope.ts, src/features/client-portal/types.ts, src/features/client-portal/insights.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts
- src/features / event-follow-up-items: src/features/event-follow-up-items/server.ts
- src/features / events: src/features/events/client-operating.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/action-item-labels.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts, src/lib/constants.ts, src/lib/agent-dispatch.ts, src/lib/utils.ts

## `/client/[slug]/events`
- Route file: `src/app/client/[slug]/events/loading.tsx`
- Type: Next.js loading UI
- Ownership: web client route surface
- Direct internal imports: src/components/client/loading-skeleton.tsx
- Transitive internal stack size: 3
- Groups touched: src/components / client, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / client: src/components/client/loading-skeleton.tsx
- src/components / ui: src/components/ui/skeleton.tsx
- src/lib: src/lib/utils.ts

## `/client/[slug]/events`
- Route file: `src/app/client/[slug]/events/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/app/client/[slug]/data.ts, src/lib/formatters.tsx, src/app/client/[slug]/events/events-filter.tsx, src/features/client-portal/access.ts
- Transitive internal stack size: 22
- Groups touched: src/app / client, src/lib, src/features / client-portal, src/features / invitations
- Feature modules touched: client-portal, invitations
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, … (+35 more)

### Stack by group
- src/app / client: src/app/client/[slug]/data.ts, src/app/client/[slug]/events/events-filter.tsx, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/event-card.tsx, src/app/client/[slug]/components/event-status-badge.tsx, src/app/client/[slug]/components/progress-bar.tsx
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/types.ts, src/features/client-portal/insights.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/client-slug.ts

## `/client/[slug]/reports`
- Route file: `src/app/client/[slug]/reports/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/lib/formatters.tsx, src/features/client-portal/access.ts, src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts
- Transitive internal stack size: 33
- Groups touched: src/lib, src/features / client-portal, src/features / reports, src/features / invitations, src/features / agent-outcomes, src/features / dashboard, src/features / events, src/features / assets, src/features / approvals, src/features / conversations, src-features-event-comments, src/features / system-events
- Feature modules touched: client-portal, reports, invitations, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, system-events
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/features/client-agent/server.test.ts, src/features/client-portal/access.test.ts, src/app/admin/reports/page.test.tsx, … (+51 more)

### Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/components/reports-surface.tsx, src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/member-access.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## `/client/pending`
- Route file: `src/app/client/pending/layout.tsx`
- Type: Next.js layout
- Ownership: web client route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/client/pending`
- Route file: `src/app/client/pending/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/components/ui/button.tsx
- Transitive internal stack size: 2
- Groups touched: src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / ui: src/components/ui/button.tsx
- src/lib: src/lib/utils.ts

## `/connect-error`
- Route file: `src/app/connect-error/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/deletion-status/[code]`
- Route file: `src/app/deletion-status/[code]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/landing`
- Route file: `src/app/landing/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: src/components/landing/hero.tsx, src/components/landing/credibility.tsx, src/components/landing/features.tsx, src/components/landing/how-it-works.tsx, src/components/landing/faq.tsx, src/components/landing/contact-form.tsx
- Transitive internal stack size: 9
- Groups touched: src/components / landing, src/components / ui, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/utils.ts
- Related tests: none

### Stack by group
- src/components / landing: src/components/landing/hero.tsx, src/components/landing/credibility.tsx, src/components/landing/features.tsx, src/components/landing/how-it-works.tsx, src/components/landing/faq.tsx, src/components/landing/contact-form.tsx
- src/components / ui: src/components/ui/button.tsx, src/components/ui/input.tsx
- src/lib: src/lib/utils.ts

## `/privacy`
- Route file: `src/app/privacy/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/sign-in/[[...sign-in]]`
- Route file: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none

## `/sign-up/[[...sign-up]]`
- Route file: `src/app/sign-up/[[...sign-up]]/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/sign-up/invite-flow.test.tsx

### Stack by group
- none

## `/terms`
- Route file: `src/app/terms/page.tsx`
- Type: Next.js page
- Ownership: web root/shared route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: none

### Stack by group
- none
