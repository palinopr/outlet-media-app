# src/components / charts

Generated from the current working tree on 2026-04-10 21:37:00.

- Files: 2
- File kinds: React/TSX module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/charts/roas-trend-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / charts
- Ownership: shared chart UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 114
- Bytes: 3286
- Imports (packages): recharts
- Imported by: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/page.tsx
- Used by groups: src/app / admin, src/app / client
- Route owners: src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaigns/page.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/campaigns/page.test.tsx
- Exports: SpendTrendChart, RoasTrendChart
- Symbol details: function SpendTrendChart (exported), function RoasTrendChart (exported), function CustomTooltip, interface DataPoint, interface Props
- Defines: CustomTooltip, SpendTrendChart, RoasTrendChart, DataPoint, Props
- Contents summary: contains `use client`; exports: SpendTrendChart, RoasTrendChart; package imports: 1

## `src/components/charts/ticket-velocity-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / charts
- Ownership: shared chart UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 82
- Bytes: 2224
- Imports (packages): recharts
- Imported by: src/app/admin/dashboard/page.tsx
- Used by groups: src/app / admin
- Route owners: src/app/admin/dashboard/page.tsx
- Routes related (direct): src/app/admin/dashboard/page.tsx
- Tests related: src/app/admin/dashboard/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: TicketVelocityChart
- Symbol details: function TicketVelocityChart (exported), function CustomTooltip, interface DataPoint
- Defines: CustomTooltip, TicketVelocityChart, DataPoint
- Contents summary: contains `use client`; exports: TicketVelocityChart; package imports: 1
