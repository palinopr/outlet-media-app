# Test Coverage Map

Generated from the current working tree on 2026-04-28 02:30:43.

This page maps code files to the exact direct and transitive tests currently linked through imports.

## Root Mocks
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `__mocks__/discord-stub.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## Root Files
- Code files: 8
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 8

### `e2e/authenticated-smoke.spec.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `eslint.config.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `next-env.d.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `next.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `playwright.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `postcss.config.mjs`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `vitest.config.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `vitest.setup.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / admin
- Code files: 32
- With direct test links: 16
- With transitive test links: 21
- With no linked tests: 11

### `src/app/admin/actions/audit.ts`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts

### `src/app/admin/actions/campaigns.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx

### `src/app/admin/actions/clients.revalidation.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/actions/clients.ts`
- Direct tests: src/components/admin/clients/client-detail.test.tsx
- All linked tests: src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-detail.test.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx

### `src/app/admin/actions/meta-sync.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts

### `src/app/admin/actions/search.ts`
- Direct tests: src/app/admin/actions/search.test.ts
- All linked tests: src/app/admin/actions/search.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/actions/search.test.ts, src/components/admin/command-palette.tsx

### `src/app/admin/actions/users.ts`
- Direct tests: src/components/admin/users/revoke-invitation-button.test.tsx
- All linked tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/users/revoke-invitation-button.tsx, src/components/admin/users/user-table.tsx

### `src/app/admin/campaigns/[campaignId]/page.tsx`
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- Route owners: none
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx

### `src/app/admin/campaigns/data.ts`
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/campaigns/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/campaigns/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/campaigns/page.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/clients/[id]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/data.ts`
- Direct tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/data.test.ts, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/client-detail.tsx, … (+3 more)

### `src/app/admin/clients/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/clients/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/admin/clients/types.ts`
- Direct tests: none
- All linked tests: src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.ts

### `src/app/admin/dashboard/campaign-cards.tsx`
- Direct tests: none
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx

### `src/app/admin/dashboard/data.ts`
- Direct tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/page.test.tsx, src/app/admin/dashboard/page.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/dashboard/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/dashboard/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/dashboard/page.tsx`
- Direct tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/events/[eventId]/page.tsx`
- Direct tests: src/app/admin/events/[eventId]/page.test.tsx
- All linked tests: src/app/admin/events/[eventId]/page.test.tsx
- Route owners: none
- Imported by: src/app/admin/events/[eventId]/page.test.tsx

### `src/app/admin/events/page.tsx`
- Direct tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/reports/page.tsx`
- Direct tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/admin/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/admin/settings/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/admin/users/data.ts`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: src/app/admin/users/page.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx

### `src/app/admin/users/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/users/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/admin/users/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

## src/app / api
- Code files: 11
- With direct test links: 8
- With transitive test links: 9
- With no linked tests: 2

### `src/app/api/admin/activity/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/api/admin/invite/route.ts`
- Direct tests: src/app/api/admin/invite/route.test.ts
- All linked tests: src/app/api/admin/invite/route.test.ts
- Route owners: none
- Imported by: src/app/api/admin/invite/route.test.ts

### `src/app/api/admin/users/[id]/route.ts`
- Direct tests: src/app/api/admin/users/[id]/route.test.ts
- All linked tests: src/app/api/admin/users/[id]/route.test.ts
- Route owners: none
- Imported by: src/app/api/admin/users/[id]/route.test.ts

### `src/app/api/contact/route.ts`
- Direct tests: src/app/api/contact/route.test.ts
- All linked tests: src/app/api/contact/route.test.ts
- Route owners: none
- Imported by: src/app/api/contact/route.test.ts

### `src/app/api/health/route.ts`
- Direct tests: src/app/api/health/route.test.ts
- All linked tests: src/app/api/health/route.test.ts
- Route owners: none
- Imported by: src/app/api/health/route.test.ts

### `src/app/api/ingest/ingest-meta-campaigns.ts`
- Direct tests: none
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: src/app/api/ingest/route.ts
- Imported by: src/app/api/ingest/route.ts

### `src/app/api/ingest/route.ts`
- Direct tests: __tests__/api/ingest.test.ts
- All linked tests: __tests__/api/ingest.test.ts
- Route owners: none
- Imported by: __tests__/api/ingest.test.ts

### `src/app/api/meta/callback/route.ts`
- Direct tests: src/app/api/meta/callback/route.test.ts
- All linked tests: src/app/api/meta/callback/route.test.ts
- Route owners: none
- Imported by: src/app/api/meta/callback/route.test.ts

### `src/app/api/meta/data-deletion/route.ts`
- Direct tests: src/app/api/meta/data-deletion/route.test.ts
- All linked tests: src/app/api/meta/data-deletion/route.test.ts
- Route owners: none
- Imported by: src/app/api/meta/data-deletion/route.test.ts

### `src/app/api/observability/client-error/route.ts`
- Direct tests: src/app/api/observability/client-error/route.test.ts
- All linked tests: src/app/api/observability/client-error/route.test.ts
- Route owners: none
- Imported by: src/app/api/observability/client-error/route.test.ts

### `src/app/api/user/profile/route.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / client
- Code files: 30
- With direct test links: 16
- With transitive test links: 21
- With no linked tests: 9

### `src/app/client/[slug]/campaign/[campaignId]/data.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/features/client-portal/campaign-detail.ts

### `src/app/client/[slug]/campaign/[campaignId]/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaign/[campaignId]/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaign/[campaignId]/page.tsx`
- Direct tests: src/app/shell-import-smoke.test.ts
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/campaigns/campaign-range-filter.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/campaigns/campaigns-table.tsx`
- Direct tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/campaigns/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaigns/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/campaigns/page.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/components/campaign-detail-header.tsx`
- Direct tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx

### `src/app/client/[slug]/components/campaign-status-badge.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/components/campaign-detail-header.tsx

### `src/app/client/[slug]/components/client-nav.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/client-portal-footer.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/components/complete-profile-modal.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/insights-panel.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/components/mobile-nav.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.tsx

### `src/app/client/[slug]/components/nav-config.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/components/client-nav.tsx, src/app/client/[slug]/components/mobile-nav.tsx

### `src/app/client/[slug]/data.ts`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

### `src/app/client/[slug]/error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/event/[eventId]/page.tsx`
- Direct tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/event/[eventId]/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/events/page.tsx`
- Direct tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/events/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/layout.tsx`
- Direct tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/lib.ts`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-status-badge.tsx, src/app/client/[slug]/lib.test.ts

### `src/app/client/[slug]/loading.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/[slug]/page.tsx`
- Direct tests: src/app/client/[slug]/page.test.tsx
- All linked tests: src/app/client/[slug]/page.test.tsx
- Route owners: none
- Imported by: src/app/client/[slug]/page.test.tsx

### `src/app/client/[slug]/reports/page.tsx`
- Direct tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: none
- Imported by: src/app/client/[slug]/reports/page.test.tsx, src/app/shell-import-smoke.test.ts

### `src/app/client/[slug]/types.ts`
- Direct tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts
- All linked tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/components/insights-panel.tsx, src/app/client/[slug]/data.ts, src/app/client/[slug]/lib.test.ts, src/components/client/charts/audience-demographics.tsx

### `src/app/client/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/pending/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/client/pending/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/app / root routes
- Code files: 11
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 10

### `src/app/connect-error/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/deletion-status/[code]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/global-error.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/landing/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/layout.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/not-found.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/privacy/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/sign-in/[[...sign-in]]/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/app/sign-up/[[...sign-up]]/page.tsx`
- Direct tests: src/app/sign-up/invite-flow.test.tsx
- All linked tests: src/app/sign-up/invite-flow.test.tsx
- Route owners: none
- Imported by: src/app/sign-up/invite-flow.test.tsx

### `src/app/terms/page.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src/components / admin
- Code files: 41
- With direct test links: 9
- With transitive test links: 33
- With no linked tests: 8

### `src/components/admin/activity-tracker.tsx`
- Direct tests: src/components/admin/activity-tracker.test.ts
- All linked tests: src/components/admin/activity-tracker.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx, src/components/admin/activity-tracker.test.ts

### `src/components/admin/breadcrumbs.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/campaigns/campaign-cells.tsx`
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/columns.tsx

### `src/components/admin/campaigns/campaign-detail-dashboard.tsx`
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx

### `src/components/admin/campaigns/campaign-table.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx

### `src/components/admin/campaigns/client-filter.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx

### `src/components/admin/campaigns/columns.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx

### `src/components/admin/campaigns/date-range-filter.tsx`
- Direct tests: src/app/admin/campaigns/page.test.tsx
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/campaigns/page.test.tsx, src/app/admin/campaigns/page.tsx

### `src/components/admin/clients/assignment-manager.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/campaigns-section.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/client-detail.tsx`
- Direct tests: src/components/admin/clients/client-detail.test.tsx
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/clients/[id]/page.tsx, src/components/admin/clients/client-detail.test.tsx

### `src/components/admin/clients/client-overview-tab.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/client-table.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/app/admin/clients/page.tsx

### `src/components/admin/clients/columns.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/client-table.tsx

### `src/components/admin/clients/invite-member-form.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/members-section.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/client-detail.tsx

### `src/components/admin/clients/role-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/clients/saving-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/role-select.tsx, src/components/admin/clients/scope-select.tsx

### `src/components/admin/clients/scope-select.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx

### `src/components/admin/collapsible-sidebar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/command-palette.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/confirm-dialog.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.tsx

### `src/components/admin/copy-button.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/columns.tsx

### `src/components/admin/data-table/column-header.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/data-table/data-table-pagination.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/data-table/data-table.tsx

### `src/components/admin/data-table/data-table-toolbar.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/data-table/data-table.tsx

### `src/components/admin/data-table/data-table.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/user-table.tsx

### `src/components/admin/data-table/select-column.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/clients/columns.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/admin/campaigns/error.tsx, src/app/admin/clients/error.tsx, src/app/admin/dashboard/error.tsx, src/app/admin/users/error.tsx

### `src/components/admin/inline-edit.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/columns.tsx

### `src/components/admin/mobile-sidebar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/app/admin/layout.tsx

### `src/components/admin/nav-config.ts`
- Direct tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- All linked tests: src/components/admin/activity-tracker.test.ts, src/components/admin/nav-config.test.ts
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/activity-tracker.test.ts, src/components/admin/activity-tracker.tsx, src/components/admin/command-palette.tsx, src/components/admin/nav-config.test.ts, src/components/admin/nav-links.tsx

### `src/components/admin/nav-links.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/sidebar-content.tsx

### `src/components/admin/page-header.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx

### `src/components/admin/sidebar-content.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/mobile-sidebar.tsx

### `src/components/admin/stat-card.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/components/admin/clients/client-detail.tsx

### `src/components/admin/status-select.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/columns.tsx, src/components/admin/users/columns.tsx

### `src/components/admin/user-avatar.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/sidebar-content.tsx

### `src/components/admin/users/columns.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: src/components/admin/users/user-table.tsx

### `src/components/admin/users/revoke-invitation-button.tsx`
- Direct tests: src/components/admin/users/revoke-invitation-button.test.tsx
- All linked tests: src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: src/app/admin/users/page.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.test.tsx

### `src/components/admin/users/user-table.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: src/app/admin/users/page.tsx

## src/components / charts
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/components/charts/roas-trend-chart.tsx`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx

## src/components / client
- Code files: 15
- With direct test links: 0
- With transitive test links: 13
- With no linked tests: 2

### `src/components/client/ads-preview.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx

### `src/components/client/charts/age-distribution-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/age-gender-heatmap.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/audience-demographics.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/gender-donut-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/index.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx

### `src/components/client/charts/market-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/performance-trend-tabs.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/placement-bar-chart.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/placement-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/time-charts.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/index.ts

### `src/components/client/charts/types.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/placement-charts.tsx, … (+1 more)

### `src/components/client/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx

### `src/components/client/loading-skeleton.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx

### `src/components/client/platform-icons.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: src/components/client/charts/placement-charts.tsx

## src/components / landing
- Code files: 12
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 11

### `src/components/landing/contact-form.tsx`
- Direct tests: __tests__/lib/contact-form.test.ts
- All linked tests: __tests__/lib/contact-form.test.ts
- Route owners: src/app/landing/page.tsx
- Imported by: __tests__/lib/contact-form.test.ts, src/app/landing/page.tsx

### `src/components/landing/credibility.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/faq.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/features.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/footer.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/hero.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/how-it-works.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/lead-funnel.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

### `src/components/landing/nav.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/sample-metric-card.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/components/landing/credibility.tsx, src/components/landing/features.tsx

### `src/components/landing/stats.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/components/landing/sticky-cta.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/landing/page.tsx
- Imported by: src/app/landing/page.tsx

## src/components / shared
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `src/components/shared/error-boundary.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/components/admin/error-boundary.tsx, src/components/client/error-boundary.tsx

## src/components / ui
- Code files: 12
- With direct test links: 0
- With transitive test links: 7
- With no linked tests: 5

### `src/components/ui/badge.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Imported by: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx

### `src/components/ui/breadcrumb.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/breadcrumbs.tsx

### `src/components/ui/button.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/page.test.tsx
- Route owners: src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, … (+1 more)
- Imported by: src/app/admin/users/page.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, … (+9 more)

### `src/components/ui/card.tsx`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, … (+2 more)
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, … (+6 more)

### `src/components/ui/command.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/command-palette.tsx

### `src/components/ui/dialog.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/layout.tsx
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/ui/command.tsx

### `src/components/ui/dropdown-menu.tsx`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/users/columns.tsx

### `src/components/ui/input.tsx`
- Direct tests: none
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/data-table/data-table-toolbar.tsx

### `src/components/ui/sheet.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/mobile-sidebar.tsx

### `src/components/ui/skeleton.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/components/client/loading-skeleton.tsx

### `src/components/ui/table.tsx`
- Direct tests: none
- All linked tests: src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/data-table/data-table.tsx

### `src/components/ui/tooltip.tsx`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/nav-links.tsx

## src/features / access
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/access/revalidation.ts`
- Direct tests: __tests__/features/access/revalidation.test.ts
- All linked tests: __tests__/features/access/revalidation.test.ts, src/components/admin/clients/client-detail.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/features/access/revalidation.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts

## src/features / campaigns
- Code files: 2
- With direct test links: 2
- With transitive test links: 2
- With no linked tests: 0

### `src/features/campaigns/revalidation.ts`
- Direct tests: src/features/campaigns/revalidation.test.ts
- All linked tests: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/revalidation.test.ts

### `src/features/campaigns/server.ts`
- Direct tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.test.ts

## src/features / client-portal
- Code files: 8
- With direct test links: 5
- With transitive test links: 7
- With no linked tests: 1

### `src/features/client-portal/access.ts`
- Direct tests: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/access.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx, src/features/client-portal/access.test.ts

### `src/features/client-portal/campaign-detail.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/features/client-portal/config.ts`
- Direct tests: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts
- All linked tests: src/app/client/[slug]/layout.test.tsx, src/features/client-portal/config.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/layout.test.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/config.test.ts

### `src/features/client-portal/entry.ts`
- Direct tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts
- All linked tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts, src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx
- Route owners: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry-accept.test.ts, src/features/client-portal/entry.test.ts

### `src/features/client-portal/insights.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/lib.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/components/campaign-detail-header.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/client/[slug]/lib.ts

### `src/features/client-portal/scope.ts`
- Direct tests: __tests__/features/client-portal/scope.test.ts
- All linked tests: __tests__/features/client-portal/scope.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Imported by: __tests__/features/client-portal/scope.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts

### `src/features/client-portal/theme.ts`
- Direct tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts
- All linked tests: src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/features/client-portal/theme.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/layout.tsx, src/features/client-portal/theme.test.ts

### `src/features/client-portal/types.ts`
- Direct tests: none
- All linked tests: src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/lib.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/client/[slug]/types.ts, src/features/client-portal/insights.ts

## src/features / clients
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/clients/summary.ts`
- Direct tests: __tests__/features/clients/summary.test.ts
- All linked tests: __tests__/features/clients/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: __tests__/features/clients/summary.test.ts, src/app/admin/clients/page.tsx

## src/features / invitations
- Code files: 3
- With direct test links: 1
- With transitive test links: 3
- With no linked tests: 0

### `src/features/invitations/server.ts`
- Direct tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts
- All linked tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/users/data.ts, src/features/invitations/server.test.ts

### `src/features/invitations/sort.ts`
- Direct tests: none
- All linked tests: src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/users/summary.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/members-section.tsx, src/features/invitations/server.ts, src/features/users/summary.ts

### `src/features/invitations/types.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/features/invitations/server.test.ts, __tests__/features/shared/admin-summary-types.test.ts, __tests__/lib/formatters.test.ts, __tests__/features/users/summary.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, … (+10 more)
- Route owners: src/app/admin/users/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Imported by: src/app/admin/users/data.ts, src/features/invitations/server.ts, src/features/invitations/sort.ts, src/features/shared/admin-summary-types.ts, src/lib/formatters.tsx

## src/features / settings
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/settings/connected-accounts.ts`
- Direct tests: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts
- All linked tests: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx
- Route owners: src/app/admin/settings/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: __tests__/features/settings/connected-accounts.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/settings/page.tsx

## src/features / shared
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/shared/admin-summary-types.ts`
- Direct tests: __tests__/features/shared/admin-summary-types.test.ts
- All linked tests: __tests__/features/shared/admin-summary-types.test.ts, __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: __tests__/features/shared/admin-summary-types.test.ts, src/features/users/summary.ts

## src/features / system-events
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/system-events/server.ts`
- Direct tests: __tests__/features/system-events/list.test.ts
- All linked tests: __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: __tests__/features/system-events/list.test.ts, src/app/admin/actions/campaigns.ts

## src/features / users
- Code files: 1
- With direct test links: 1
- With transitive test links: 1
- With no linked tests: 0

### `src/features/users/summary.ts`
- Direct tests: __tests__/features/users/summary.test.ts
- All linked tests: __tests__/features/users/summary.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/users/page.tsx
- Imported by: __tests__/features/users/summary.test.ts, src/app/admin/users/page.tsx

## src / hooks
- Code files: 1
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 1

### `src/hooks/use-sidebar-state.ts`
- Direct tests: none
- All linked tests: none
- Route owners: src/app/admin/layout.tsx
- Imported by: src/components/admin/collapsible-sidebar.tsx

## src/lib
- Code files: 21
- With direct test links: 13
- With transitive test links: 17
- With no linked tests: 4

### `src/lib/api-helpers.ts`
- Direct tests: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts
- All linked tests: src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/observability/client-error/route.test.ts, src/lib/api-helpers.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/actions/search.test.ts, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+2 more)
- Route owners: src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/api/observability/client-error/route.ts, src/app/api/user/profile/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, … (+5 more)
- Imported by: src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/invite/route.ts, … (+9 more)

### `src/lib/api-schemas.ts`
- Direct tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts
- All linked tests: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/api/admin/invite/route.test.ts, src/app/api/contact/route.test.ts, __tests__/api/ingest.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/route.ts, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx
- Imported by: __tests__/lib/api-schemas.test.ts, __tests__/lib/contact-form.test.ts, src/app/admin/actions/clients.ts, src/app/api/admin/invite/route.ts, src/app/api/contact/route.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/route.ts

### `src/lib/campaign-client-assignment.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+3 more)
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, … (+5 more)

### `src/lib/client-error-reporting.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/app/global-error.tsx, src/components/shared/error-boundary.tsx

### `src/lib/client-slug.ts`
- Direct tests: __tests__/lib/client-slug.test.ts
- All linked tests: __tests__/lib/client-slug.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+4 more)
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, … (+1 more)
- Imported by: __tests__/lib/client-slug.test.ts, src/lib/campaign-client-assignment.ts

### `src/lib/constants.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/client/[slug]/lib.test.ts, … (+3 more)
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/page.tsx, … (+5 more)

### `src/lib/database.types.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/lib/env.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: src/instrumentation.ts

### `src/lib/export-csv.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Imported by: src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/user-table.tsx

### `src/lib/formatters.tsx`
- Direct tests: __tests__/lib/formatters.test.ts
- All linked tests: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, … (+7 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, … (+26 more)

### `src/lib/google-ads.ts`
- Direct tests: src/lib/google-ads.test.ts
- All linked tests: src/lib/google-ads.test.ts
- Route owners: none
- Imported by: src/lib/google-ads.test.ts, src/scripts/google-ads-discover-accounts.ts

### `src/lib/member-access.ts`
- Direct tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts
- All linked tests: src/features/client-portal/access.test.ts, src/features/client-portal/entry.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/features/client-portal/entry-accept.test.ts, __tests__/features/client-portal/scope.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/layout.tsx, src/app/client/page.tsx, src/app/page.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/data.ts, src/features/client-portal/access.test.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.test.ts, src/features/client-portal/entry.ts, src/features/client-portal/scope.ts

### `src/lib/meta-api.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/lib/meta-api.test.ts, src/lib/meta-campaigns.ts

### `src/lib/meta-campaigns.ts`
- Direct tests: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts
- All linked tests: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, … (+1 more)

### `src/lib/meta-oauth.ts`
- Direct tests: src/lib/meta-oauth.test.ts
- All linked tests: src/lib/meta-oauth.test.ts, src/app/api/meta/data-deletion/route.test.ts
- Route owners: src/app/api/meta/data-deletion/route.ts
- Imported by: src/app/api/meta/data-deletion/route.ts, src/lib/meta-oauth.test.ts

### `src/lib/shopify-admin.ts`
- Direct tests: src/lib/shopify-admin.test.ts
- All linked tests: src/lib/shopify-admin.test.ts
- Route owners: none
- Imported by: src/lib/shopify-admin.test.ts

### `src/lib/status.ts`
- Direct tests: none
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/campaigns/page.test.tsx, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, … (+7 more)
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/layout.tsx, … (+2 more)
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx

### `src/lib/supabase.ts`
- Direct tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+5 more)
- All linked tests: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/app/api/admin/invite/route.test.ts, src/app/api/admin/users/[id]/route.test.ts, src/app/api/contact/route.test.ts, src/app/api/meta/data-deletion/route.test.ts, src/app/api/observability/client-error/route.test.ts, … (+20 more)
- Route owners: src/app/admin/settings/page.tsx, src/app/api/admin/activity/route.ts, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/contact/route.ts, src/app/api/health/route.ts, src/app/api/ingest/route.ts, src/app/api/meta/data-deletion/route.ts, … (+13 more)
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, __tests__/features/system-events/list.test.ts, __tests__/setup.ts, src/app/admin/actions/audit.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, … (+34 more)

### `src/lib/text-utils.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/lib/to-slug.ts`
- Direct tests: src/lib/to-slug.test.ts
- All linked tests: src/lib/to-slug.test.ts, src/app/shell-import-smoke.test.ts
- Route owners: src/app/admin/clients/page.tsx
- Imported by: src/components/admin/clients/client-table.tsx, src/lib/to-slug.test.ts

### `src/lib/utils.ts`
- Direct tests: none
- All linked tests: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx
- Route owners: src/app/admin/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/admin/campaigns/loading.tsx, … (+10 more)
- Imported by: src/components/admin/collapsible-sidebar.tsx, src/components/admin/data-table/column-header.tsx, src/components/admin/nav-links.tsx, src/components/landing/sample-metric-card.tsx, src/components/ui/badge.tsx, src/components/ui/breadcrumb.tsx, src/components/ui/button.tsx, src/components/ui/card.tsx, … (+8 more)

## src / Root
- Code files: 2
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 2

### `src/instrumentation.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/proxy.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

## src / scripts
- Code files: 4
- With direct test links: 0
- With transitive test links: 0
- With no linked tests: 4

### `src/scripts/google-ads-build-ataca-sergio-search.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/google-ads-discover-accounts.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/google-ads-first-read.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none

### `src/scripts/shopify-first-read.ts`
- Direct tests: none
- All linked tests: none
- Route owners: none
- Imported by: none
