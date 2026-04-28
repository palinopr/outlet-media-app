# Component Tree Map

Generated from the current working tree on 2026-04-28 02:30:43.

This page focuses on admin and client UI surface files and summarizes the component-oriented tree they pull in through direct and transitive imports.

## Admin surfaces

### `/admin`
- Surface file: `src/app/admin/layout.tsx`
- Direct component imports: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Related tests: none

- Route-local modules/components: src/app/admin/actions/search.ts
- Shared admin components: src/components/admin/mobile-sidebar.tsx, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/breadcrumbs.tsx, src/components/admin/collapsible-sidebar.tsx, src/components/admin/sidebar-content.tsx, src/components/admin/nav-config.ts, src/components/admin/nav-links.tsx, src/components/admin/user-avatar.tsx
- UI primitives: src/components/ui/sheet.tsx, src/components/ui/command.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/dialog.tsx, src/components/ui/tooltip.tsx, src/components/ui/button.tsx

### `/admin/campaigns`
- Surface file: `src/app/admin/campaigns/error.tsx`
- Direct component imports: src/components/admin/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared admin components: src/components/admin/error-boundary.tsx
- Shared app components: src/components/shared/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/admin/campaigns`
- Surface file: `src/app/admin/campaigns/loading.tsx`
- Direct component imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- UI primitives: src/components/ui/skeleton.tsx, src/components/ui/card.tsx

### `/admin/campaigns`
- Surface file: `src/app/admin/campaigns/page.tsx`
- Direct component imports: src/components/ui/card.tsx, src/components/admin/stat-card.tsx, src/app/admin/campaigns/data.ts, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/page-header.tsx
- Feature modules touched: invitations, campaigns, system-events
- Shared libs touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/meta-campaigns.ts, src/lib/utils.ts, src/lib/export-csv.ts, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/api-helpers.ts, … (+1 more)
- Related tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

- Route-local modules/components: src/app/admin/campaigns/data.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- Shared admin components: src/components/admin/stat-card.tsx, src/components/admin/campaigns/client-filter.tsx, src/components/admin/campaigns/date-range-filter.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/campaigns/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx, … (+2 more)
- UI primitives: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/dropdown-menu.tsx

### `/admin/campaigns/[campaignId]`
- Surface file: `src/app/admin/campaigns/[campaignId]/page.tsx`
- Direct component imports: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx
- Feature modules touched: campaigns, invitations, system-events
- Shared libs touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-api.ts, src/lib/api-helpers.ts, src/lib/client-slug.ts, src/lib/utils.ts
- Related tests: src/app/admin/campaigns/[campaignId]/page.test.tsx

- Route-local modules/components: src/app/admin/actions/campaigns.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/meta-sync.ts
- Shared admin components: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/components/admin/confirm-dialog.tsx
- UI primitives: src/components/ui/button.tsx

### `/admin/clients`
- Surface file: `src/app/admin/clients/error.tsx`
- Direct component imports: src/components/admin/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared admin components: src/components/admin/error-boundary.tsx
- Shared app components: src/components/shared/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/admin/clients`
- Surface file: `src/app/admin/clients/loading.tsx`
- Direct component imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- UI primitives: src/components/ui/skeleton.tsx, src/components/ui/card.tsx

### `/admin/clients`
- Surface file: `src/app/admin/clients/page.tsx`
- Direct component imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/app/admin/clients/data.ts, src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/page-header.tsx
- Feature modules touched: clients, invitations, settings, access
- Shared libs touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/status.ts, src/lib/to-slug.ts, src/lib/export-csv.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Related tests: src/app/shell-import-smoke.test.ts

- Route-local modules/components: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts
- Shared admin components: src/components/admin/stat-card.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/inline-edit.tsx, src/components/admin/copy-button.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/column-header.tsx
- UI primitives: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx

### `/admin/clients/[id]`
- Surface file: `src/app/admin/clients/[id]/page.tsx`
- Direct component imports: src/app/admin/clients/data.ts, src/components/admin/clients/client-detail.tsx
- Feature modules touched: invitations, settings, access
- Shared libs touched: src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/formatters.tsx, src/lib/client-slug.ts, src/lib/status.ts, src/lib/utils.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Related tests: none

- Route-local modules/components: src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/users.ts
- Shared admin components: src/components/admin/clients/client-detail.tsx, src/components/admin/stat-card.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/clients/saving-select.tsx
- UI primitives: src/components/ui/card.tsx, src/components/ui/table.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx

### `/admin/dashboard`
- Surface file: `src/app/admin/dashboard/error.tsx`
- Direct component imports: src/components/admin/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared admin components: src/components/admin/error-boundary.tsx
- Shared app components: src/components/shared/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/admin/dashboard`
- Surface file: `src/app/admin/dashboard/loading.tsx`
- Direct component imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- UI primitives: src/components/ui/skeleton.tsx, src/components/ui/card.tsx

### `/admin/dashboard`
- Surface file: `src/app/admin/dashboard/page.tsx`
- Direct component imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/components/admin/stat-card.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx, src/components/admin/page-header.tsx
- Feature modules touched: invitations, client-portal
- Shared libs touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts
- Related tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts

- Chart components: src/components/charts/roas-trend-chart.tsx
- Route-local modules/components: src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx, src/app/client/[slug]/lib.ts
- Shared admin components: src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- UI primitives: src/components/ui/card.tsx, src/components/ui/badge.tsx

### `/admin/events`
- Surface file: `src/app/admin/events/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts

- No component imports captured

### `/admin/events/[eventId]`
- Surface file: `src/app/admin/events/[eventId]/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/admin/events/[eventId]/page.test.tsx

- No component imports captured

### `/admin/reports`
- Surface file: `src/app/admin/reports/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

- No component imports captured

### `/admin/settings`
- Surface file: `src/app/admin/settings/page.tsx`
- Direct component imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- Feature modules touched: settings
- Shared libs touched: src/lib/supabase.ts, src/lib/utils.ts
- Related tests: src/app/shell-import-smoke.test.ts

- Shared admin components: src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- UI primitives: src/components/ui/card.tsx, src/components/ui/badge.tsx

### `/admin/users`
- Surface file: `src/app/admin/users/error.tsx`
- Direct component imports: src/components/admin/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared admin components: src/components/admin/error-boundary.tsx
- Shared app components: src/components/shared/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/admin/users`
- Surface file: `src/app/admin/users/loading.tsx`
- Direct component imports: src/components/ui/skeleton.tsx, src/components/ui/card.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- UI primitives: src/components/ui/skeleton.tsx, src/components/ui/card.tsx

### `/admin/users`
- Surface file: `src/app/admin/users/page.tsx`
- Direct component imports: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/admin/page-header.tsx
- Feature modules touched: users, invitations, settings, shared, access
- Shared libs touched: src/lib/formatters.tsx, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/export-csv.ts, src/lib/utils.ts, src/lib/status.ts, src/lib/client-slug.ts, src/lib/api-helpers.ts
- Related tests: src/app/shell-import-smoke.test.ts

- Route-local modules/components: src/app/admin/users/data.ts, src/app/admin/clients/data.ts, src/app/admin/clients/types.ts, src/app/admin/actions/users.ts, src/app/admin/actions/audit.ts
- Shared admin components: src/components/admin/users/user-table.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx, src/components/admin/data-table/data-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/confirm-dialog.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/data-table/data-table-pagination.tsx, src/components/admin/data-table/select-column.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/status-select.tsx
- UI primitives: src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/table.tsx, src/components/ui/dropdown-menu.tsx, src/components/ui/input.tsx

## Client surfaces

### `/client`
- Surface file: `src/app/client/page.tsx`
- Direct component imports: src/components/ui/button.tsx
- Feature modules touched: client-portal
- Shared libs touched: src/lib/utils.ts, src/lib/supabase.ts, src/lib/member-access.ts
- Related tests: none

- UI primitives: src/components/ui/button.tsx

### `/client/[slug]`
- Surface file: `src/app/client/[slug]/error.tsx`
- Direct component imports: src/components/client/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared app components: src/components/shared/error-boundary.tsx
- Shared client components: src/components/client/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/client/[slug]`
- Surface file: `src/app/client/[slug]/layout.tsx`
- Direct component imports: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx
- Feature modules touched: client-portal, invitations
- Shared libs touched: src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/utils.ts
- Related tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts

- Client route-local components: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/[slug]/components/nav-config.ts
- UI primitives: src/components/ui/dialog.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx

### `/client/[slug]`
- Surface file: `src/app/client/[slug]/loading.tsx`
- Direct component imports: src/components/client/loading-skeleton.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- Shared client components: src/components/client/loading-skeleton.tsx
- UI primitives: src/components/ui/skeleton.tsx

### `/client/[slug]`
- Surface file: `src/app/client/[slug]/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/client/[slug]/page.test.tsx

- No component imports captured

### `/client/[slug]/campaign/[campaignId]`
- Surface file: `src/app/client/[slug]/campaign/[campaignId]/error.tsx`
- Direct component imports: src/components/client/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared app components: src/components/shared/error-boundary.tsx
- Shared client components: src/components/client/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/client/[slug]/campaign/[campaignId]`
- Surface file: `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Direct component imports: src/components/client/loading-skeleton.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- Shared client components: src/components/client/loading-skeleton.tsx
- UI primitives: src/components/ui/skeleton.tsx

### `/client/[slug]/campaign/[campaignId]`
- Surface file: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Direct component imports: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/lib.ts
- Feature modules touched: client-portal, invitations
- Shared libs touched: src/lib/constants.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/meta-api.ts, src/lib/client-slug.ts
- Related tests: src/app/shell-import-smoke.test.ts

- Client route-local components: src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/campaign-status-badge.tsx
- Route-local modules/components: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/types.ts
- Shared client components: src/components/client/ads-preview.tsx, src/components/client/charts/index.ts, src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+1 more)

### `/client/[slug]/campaigns`
- Surface file: `src/app/client/[slug]/campaigns/error.tsx`
- Direct component imports: src/components/client/error-boundary.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/client-error-reporting.ts, src/lib/utils.ts
- Related tests: none

- Shared app components: src/components/shared/error-boundary.tsx
- Shared client components: src/components/client/error-boundary.tsx
- UI primitives: src/components/ui/button.tsx

### `/client/[slug]/campaigns`
- Surface file: `src/app/client/[slug]/campaigns/loading.tsx`
- Direct component imports: src/components/client/loading-skeleton.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- Shared client components: src/components/client/loading-skeleton.tsx
- UI primitives: src/components/ui/skeleton.tsx

### `/client/[slug]/campaigns`
- Surface file: `src/app/client/[slug]/campaigns/page.tsx`
- Direct component imports: src/components/charts/roas-trend-chart.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx
- Feature modules touched: client-portal, invitations
- Shared libs touched: src/lib/formatters.tsx, src/lib/constants.ts, src/lib/status.ts, src/lib/meta-campaigns.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/meta-api.ts, src/lib/supabase.ts, src/lib/client-slug.ts
- Related tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

- Chart components: src/components/charts/roas-trend-chart.tsx
- Client route-local components: src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/components/client-portal-footer.tsx
- Route-local modules/components: src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.ts, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/types.ts

### `/client/[slug]/event/[eventId]`
- Surface file: `src/app/client/[slug]/event/[eventId]/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

- No component imports captured

### `/client/[slug]/events`
- Surface file: `src/app/client/[slug]/events/page.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts

- No component imports captured

### `/client/[slug]/reports`
- Surface file: `src/app/client/[slug]/reports/page.tsx`
- Direct component imports: none
- Feature modules touched: invitations
- Shared libs touched: src/lib/formatters.tsx, src/lib/status.ts
- Related tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

- No component imports captured

### `/client/pending`
- Surface file: `src/app/client/pending/layout.tsx`
- Direct component imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: none

- No component imports captured

### `/client/pending`
- Surface file: `src/app/client/pending/page.tsx`
- Direct component imports: src/components/ui/button.tsx
- Feature modules touched: none
- Shared libs touched: src/lib/utils.ts
- Related tests: none

- UI primitives: src/components/ui/button.tsx
