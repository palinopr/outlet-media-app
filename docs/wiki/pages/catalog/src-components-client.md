# src/components / client

Generated from the current working tree on 2026-04-10 22:12:57.

- Files: 17
- File kinds: React/TSX module (15), TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/client/ads-preview.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 100
- Bytes: 3404
- Imports (internal): src/lib/formatters.tsx
- Imports (packages): next/image
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: AdsPreview, AdPreview
- Symbol details: function AdsPreview (exported), const TH, const TD, interface AdPreview (exported)
- Defines: AdsPreview, TH, TD, sorted, AdPreview
- Contents summary: contains `use client`; exports: AdsPreview, AdPreview; internal imports: 1; package imports: 1

## `src/components/client/charts/age-distribution-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 66
- Bytes: 2301
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: AgeDistributionChart
- Symbol details: function AgeDistributionChart (exported)
- Defines: AgeDistributionChart, maxImp
- Contents summary: contains `use client`; exports: AgeDistributionChart; internal imports: 1; package imports: 1

## `src/components/client/charts/age-gender-heatmap.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 66
- Bytes: 2457
- Imports (internal): src/components/client/charts/types.ts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: AgeGenderHeatmap
- Symbol details: function AgeGenderHeatmap (exported)
- Defines: AgeGenderHeatmap, cellColor, genders, maxPct, opacity, cell, pct
- Contents summary: contains `use client`; exports: AgeGenderHeatmap; internal imports: 1

## `src/components/client/charts/audience-demographics.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 330
- Bytes: 9464
- Imports (internal): src/app/client/[slug]/types.ts, src/components/client/charts/types.ts
- Imports (packages): react, recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/app / client, src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: AudienceDemographics
- Symbol details: function AudienceDemographics (exported), function aggregateByAge, function aggregateByGender, function buildHeatCells, function AgeTab, function GenderTab, function HeatmapTab, const AGE_ORDER, type Tab, interface AgeRow, interface GenderRow, interface HeatCell
- Defines: aggregateByAge, aggregateByGender, buildHeatCells, AudienceDemographics, AgeTab, GenderTab, HeatmapTab, cellBg, AGE_ORDER, map, total, ageSet, … (+15 more)
- Contents summary: contains `use client`; exports: AudienceDemographics; internal imports: 2; package imports: 2

## `src/components/client/charts/daily-sales-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 87
- Bytes: 2775
- Imports (internal): src/components/client/charts/types.ts, src/app/client/[slug]/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client, src/app / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: DailySalesChart
- Symbol details: function DailySalesChart (exported)
- Defines: DailySalesChart, hasRevenue, v
- Contents summary: contains `use client`; exports: DailySalesChart; internal imports: 2; package imports: 1

## `src/components/client/charts/gender-donut-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 67
- Bytes: 2042
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: GenderDonutChart
- Symbol details: function GenderDonutChart (exported)
- Defines: GenderDonutChart
- Contents summary: contains `use client`; exports: GenderDonutChart; internal imports: 1; package imports: 1

## `src/components/client/charts/index.ts`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: TypeScript module
- Construction: code module
- Lines: 23
- Bytes: 874
- Imports (internal): src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx, … (+2 more)
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Depends on groups: src/components / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart, PerformanceTrendTabs, MarketPerformanceTable, AudienceDemographics, PlacementBarChart, … (+3 more)
- Contents summary: exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 12

## `src/components/client/charts/market-charts.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 86
- Bytes: 3933
- Imports (internal): src/components/client/charts/types.ts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: MarketPerformanceTable
- Symbol details: function MarketPerformanceTable (exported)
- Defines: MarketPerformanceTable, sorted, maxPct
- Contents summary: exports: MarketPerformanceTable; internal imports: 1

## `src/components/client/charts/performance-trend-tabs.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 157
- Bytes: 4506
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): react, recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: PerformanceTrendTabs
- Symbol details: function PerformanceTrendTabs (exported), function LegendItem, interface Props
- Defines: PerformanceTrendTabs, LegendItem, v, PerformanceTrendRow, Props
- Contents summary: contains `use client`; exports: PerformanceTrendTabs; internal imports: 1; package imports: 2

## `src/components/client/charts/placement-bar-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 110
- Bytes: 2706
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: PlacementBarChart
- Symbol details: function PlacementBarChart (exported), function CustomTooltip, interface PlacementBarData, interface ChartRow
- Defines: CustomTooltip, PlacementBarChart, row, PlacementBarData, ChartRow
- Contents summary: contains `use client`; exports: PlacementBarChart; internal imports: 1; package imports: 1

## `src/components/client/charts/placement-charts.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 160
- Bytes: 6750
- Imports (internal): src/components/client/charts/types.ts, src/components/client/platform-icons.tsx
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: PlacementTreemap, PlacementTable
- Symbol details: function PlacementTreemap (exported), function PlacementTable (exported)
- Defines: PlacementTreemap, PlacementTable, byPlatform, prev, totalImp, platforms, maxPct, barColor, sorted, pct
- Contents summary: exports: PlacementTreemap, PlacementTable; internal imports: 2

## `src/components/client/charts/ticket-sales-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 107
- Bytes: 3510
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: TicketSalesChart, TicketChartRow
- Symbol details: function TicketSalesChart (exported), interface TicketChartRow (exported)
- Defines: TicketSalesChart, hasGross, v, TicketChartRow
- Contents summary: contains `use client`; exports: TicketSalesChart, TicketChartRow; internal imports: 1; package imports: 1

## `src/components/client/charts/time-charts.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 208
- Bytes: 7621
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart
- Symbol details: function HourlyHeatmap (exported), function DailyTrendChart (exported), function DayOfWeekChart (exported), function formatHourLabel
- Defines: formatHourLabel, HourlyHeatmap, cellOpacity, DailyTrendChart, DayOfWeekChart, maxImp, byHour, hours, row, imp, opacity, chartData, … (+2 more)
- Contents summary: contains `use client`; exports: HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 1; package imports: 1

## `src/components/client/charts/types.ts`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: TypeScript module
- Construction: code module
- Lines: 113
- Bytes: 2235
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/daily-sales-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/placement-bar-chart.tsx, src/components/client/charts/placement-charts.tsx, … (+2 more)
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, … (+2 more)
- Symbol details: function kFormatter (exported), function usdKFormatter (exported), const tooltipStyle (exported), const sharedAxisProps (exported), const gridProps (exported), interface AgeRow (exported), interface GenderRow (exported), interface AgeGenderCell (exported), interface PlacementRow (exported), interface HourlyRow (exported), interface DailyRow (exported), interface DayOfWeekRow (exported), interface PerformanceTrendRow (exported), interface MarketRow (exported)
- Defines: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell, PlacementRow, HourlyRow, DailyRow, DayOfWeekRow, … (+2 more)
- Contents summary: exports: kFormatter, usdKFormatter, tooltipStyle, sharedAxisProps, gridProps, AgeRow, GenderRow, AgeGenderCell

## `src/components/client/error-boundary.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 14
- Bytes: 267
- Imports (internal): src/components/shared/error-boundary.tsx
- Imported by: src/app/client/[slug]/agent/error.tsx, src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx, src/app/client/[slug]/event/[eventId]/error.tsx, src/app/client/[slug]/events/error.tsx
- Depends on groups: src/components / shared
- Used by groups: src/app / client
- Exports: ClientError, default
- Symbol details: default function ClientError (exported)
- Defines: ClientError
- Contents summary: contains `use client`; exports: ClientError, default; internal imports: 1

## `src/components/client/loading-skeleton.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 19
- Bytes: 540
- Imports (internal): src/components/ui/skeleton.tsx
- Imported by: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Routes related (direct): src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/event/[eventId]/loading.tsx, src/app/client/[slug]/events/loading.tsx, src/app/client/[slug]/loading.tsx
- Exports: ClientLoadingSkeleton, default
- Symbol details: default function ClientLoadingSkeleton (exported)
- Defines: ClientLoadingSkeleton
- Contents summary: exports: ClientLoadingSkeleton, default; internal imports: 1

## `src/components/client/platform-icons.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 43
- Bytes: 4425
- Imported by: src/components/client/charts/placement-charts.tsx
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- Exports: PlatformIcon
- Symbol details: function PlatformIcon (exported)
- Defines: PlatformIcon, icon
- Contents summary: exports: PlatformIcon
