# Route Stack Map

Generated from the current working tree on 2026-04-28 02:31:12.

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
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, … (+7 more)

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
- Related tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts, src/app/admin/actions/search.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, … (+9 more)

### Stack by group
- src / hooks: src/hooks/use-sidebar-state.ts
- src/app / admin: src/app/admin/actions/search.ts
- src/components / admin: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/sidebar-content.tsx, src/components/admin/nav-config.ts, src/components/admin/nav-links.tsx, src/components/admin/user-avatar.tsx
- src/components / ui: src/components/ui/sheet.tsx, src/components/ui/command.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/dialog.tsx, src/components/ui/tooltip.tsx, src/components/ui/button.tsx
- src/lib: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts

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
- Transitive internal stack size: 37
- Groups touched: src/components / ui, src/components / admin, src/app / admin, src/lib, src/features / invitations, src/features / campaigns, src/features / system-events
- Feature modules touched: invitations, campaigns, system-events
- Shared libs/runtime files touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, … (+1 more)
- Related tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/lib/campaign-client-assignment.test.ts, src/lib/meta-api.test.ts, … (+13 more)

### Stack by group
- src/app / admin: src/app/admin/campaigns/data.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, … (+2 more)
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx
- src/features / campaigns: src/features/campaigns/revalidation.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts

## `/admin/campaigns/[campaignId]`
- Route file: `src/app/admin/campaigns/[campaignId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.ts, src/lib/formatters.tsx, src/lib/status.ts
- Transitive internal stack size: 21
- Groups touched: src/components / admin, src/features / campaigns, src/lib, src/app / admin, src/features / invitations, src/components / ui, src/features / system-events
- Feature modules touched: campaigns, invitations, system-events
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/utils.ts
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts, __tests__/lib/formatters.test.ts, src/lib/meta-campaigns.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/lib/campaign-client-assignment.test.ts, __tests__/features/system-events/list.test.ts, … (+12 more)

### Stack by group
- src/app / admin: src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- src/components / admin: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/confirm-dialog.tsx
- src/components / ui: src/components/ui/button.tsx
- src/features / campaigns: src/features/campaigns/server.ts, src/features/campaigns/revalidation.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/utils.ts

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
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/clients/summary.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, … (+17 more)

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
- Transitive internal stack size: 34
- Groups touched: src/app / admin, src/components / admin, src/lib, src/features / invitations, src/features / settings, src/components / ui, src/features / access
- Feature modules touched: invitations, settings, access
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Related tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, … (+16 more)

### Stack by group
- src/app / admin: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/users.ts
- src/components / admin: src/components/admin/clients/client-detail.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/clients/saving-select.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
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
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx, src/components/admin/page-header.tsx
- Transitive internal stack size: 18
- Groups touched: src/components / ui, src/components / charts, src/lib, src/components / admin, src/app / admin, src/features / invitations, src/app / client, src/features / client-portal
- Feature modules touched: invitations, client-portal
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts
- Related tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, … (+11 more)

### Stack by group
- src/app / admin: src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx
- src/app / client: src/app/client/[slug]/lib.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- src/components / charts: src/components/charts/roas-trend-chart.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx
- src/features / client-portal: src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts

## `/admin/events`
- Route file: `src/app/admin/events/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### Stack by group
- none

## `/admin/events/[eventId]`
- Route file: `src/app/admin/events/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/admin/events/[eventId]/page.test.tsx

### Stack by group
- none

## `/admin/reports`
- Route file: `src/app/admin/reports/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

### Stack by group
- none

## `/admin/settings`
- Route file: `src/app/admin/settings/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/stat-card.tsx, src/features/settings/connected-accounts.ts, src/lib/supabase.ts, src/components/admin/page-header.tsx
- Transitive internal stack size: 7
- Groups touched: src/components / ui, src/components / admin, src/features / settings, src/lib
- Feature modules touched: settings
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/utils.ts
- Related tests: src/app/shell-import-smoke.test.ts, __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, … (+7 more)

### Stack by group
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx
- src/features / settings: src/features/settings/connected-accounts.ts
- src/lib: src/lib/supabase.ts, src/lib/utils.ts

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
- Transitive internal stack size: 37
- Groups touched: src/app / admin, src/components / admin, src/components / ui, src/lib, src/features / users, src/features / invitations, src/features / settings, src/features / shared, src/features / access
- Feature modules touched: users, invitations, settings, shared, access
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts
- Related tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, __tests__/lib/formatters.test.ts, __tests__/features/users/summary.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/api/admin/invite/route.test.ts, … (+15 more)

### Stack by group
- src/app / admin: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/users.ts, src/app/admin/actions/audit.ts
- src/components / admin: src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx, src/components/ui/input.tsx
- src/features / access: src/features/access/revalidation.ts
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
- Related tests: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/contact/route.test.ts, … (+6 more)

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
- Related tests: src/app/api/admin/invite/route.test.ts, __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, … (+8 more)

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
- Related tests: src/app/api/admin/users/[id]/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/contact/route.test.ts, … (+6 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## `/api/contact`
- Route file: `src/app/api/contact/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Transitive internal stack size: 3
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: src/app/api/contact/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+8 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## `/api/health`
- Route file: `src/app/api/health/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: package.json, src/lib/supabase.ts
- Transitive internal stack size: 2
- Groups touched: Root Files, src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts
- Related tests: src/app/api/health/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, … (+6 more)

### Stack by group
- Root Files: package.json
- src/lib: src/lib/supabase.ts

## `/api/ingest`
- Route file: `src/app/api/ingest/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-meta-campaigns.ts
- Transitive internal stack size: 4
- Groups touched: src/lib, src/app / api
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/ingest.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, … (+9 more)

### Stack by group
- src/app / api: src/app/api/ingest/ingest-meta-campaigns.ts
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
- Related tests: src/app/api/meta/data-deletion/route.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+6 more)

### Stack by group
- src/lib: src/lib/supabase.ts, src/lib/meta-oauth.ts

## `/api/observability/client-error`
- Route file: `src/app/api/observability/client-error/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Transitive internal stack size: 2
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: src/app/api/observability/client-error/route.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/lib/api-helpers.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/contact/route.test.ts, … (+6 more)

### Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## `/api/user/profile`
- Route file: `src/app/api/user/profile/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Direct internal imports: src/lib/api-helpers.ts
- Transitive internal stack size: 1
- Groups touched: src/lib
- Feature modules touched: none
- Shared libs/runtime files touched: src/lib/api-helpers.ts
- Related tests: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts

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
- Related tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, … (+7 more)

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
- Related tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, … (+12 more)

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
- Direct internal imports: src/lib/constants.ts, src/lib/formatters.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/app/client/[slug]/lib.ts
- Transitive internal stack size: 34
- Groups touched: src/lib, src/app / client, src/components / client, src/features / client-portal, src/features / invitations
- Feature modules touched: client-portal, invitations
- Shared libs/runtime files touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Related tests: src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/theme.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, … (+17 more)

### Stack by group
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/lib.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/components/campaign-status-badge.tsx
- src/components / client: src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+1 more)
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/theme.ts, src/features/client-portal/scope.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/client-slug.ts

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
- Direct internal imports: src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/access.ts, src/lib/constants.ts, src/app/client/[slug]/campaigns/campaign-range-filter.tsx
- Transitive internal stack size: 22
- Groups touched: src/components / charts, src/lib, src/app / client, src/features / client-portal, src/features / invitations
- Feature modules touched: client-portal, invitations
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts, src/app/client/[slug]/lib.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/features/client-portal/access.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry-accept.test.ts, … (+14 more)

### Stack by group
- src/app / client: src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/types.ts
- src/components / charts: src/components/charts/roas-trend-chart.tsx
- src/features / client-portal: src/features/client-portal/access.ts, src/features/client-portal/insights.ts, src/features/client-portal/entry.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/client-slug.ts

## `/client/[slug]/event/[eventId]`
- Route file: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

### Stack by group
- none

## `/client/[slug]/events`
- Route file: `src/app/client/[slug]/events/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: none
- Transitive internal stack size: 0
- Groups touched: none
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### Stack by group
- none

## `/client/[slug]/reports`
- Route file: `src/app/client/[slug]/reports/page.tsx`
- Type: Next.js page
- Ownership: web client route surface
- Direct internal imports: src/lib/formatters.tsx
- Transitive internal stack size: 3
- Groups touched: src/lib, src/features / invitations
- Feature modules touched: invitations
- Shared libs/runtime files touched: src/lib/formatters.tsx, src/lib/status.ts
- Related tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/lib/formatters.test.ts

### Stack by group
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/status.ts

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
- Direct internal imports: src/components/landing/contact-form.tsx, src/components/landing/faq.tsx, src/components/landing/hero.tsx, src/components/landing/how-it-works.tsx, src/components/landing/lead-funnel.tsx, src/components/landing/sticky-cta.tsx
- Transitive internal stack size: 6
- Groups touched: src/components / landing
- Feature modules touched: none
- Shared libs/runtime files touched: none
- Related tests: __tests__/lib/contact-form.test.ts

### Stack by group
- src/components / landing: src/components/landing/contact-form.tsx, src/components/landing/faq.tsx, src/components/landing/hero.tsx, src/components/landing/how-it-works.tsx, src/components/landing/lead-funnel.tsx, src/components/landing/sticky-cta.tsx

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
