# /admin/dashboard

Generated from the current working tree on 2026-04-28 02:57:59.

- Route file: `src/app/admin/dashboard/page.tsx`
- Type: Next.js page
- Ownership: web admin route surface
- Methods: none
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/charts/roas-trend-chart.tsx, src/lib/formatters.tsx, src/components/admin/stat-card.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx, src/components/admin/page-header.tsx
- Feature modules touched: invitations, client-portal
- Shared libs/runtime touched: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts
- Database objects touched: if, meta_campaigns, campaign_snapshots, campaign_client_overrides, leads
- Direct tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- All linked tests: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Contents summary: Next.js page for `/admin/dashboard`; exports: AdminDashboard, default; internal imports: 8; package imports: 1

## Stack by group
- src/app / admin: src/app/admin/dashboard/data.ts, src/app/admin/dashboard/campaign-cards.tsx
- src/app / client: src/app/client/[slug]/lib.ts
- src/components / admin: src/components/admin/stat-card.tsx, src/components/admin/page-header.tsx
- src/components / charts: src/components/charts/roas-trend-chart.tsx
- src/components / ui: src/components/ui/card.tsx, src/components/ui/badge.tsx
- src/features / client-portal: src/features/client-portal/insights.ts, src/features/client-portal/types.ts
- src/features / invitations: src/features/invitations/types.ts
- src/lib: src/lib/formatters.tsx, src/lib/utils.ts, src/lib/status.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/constants.ts
