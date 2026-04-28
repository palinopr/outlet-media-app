# src/components / client

Generated from the current working tree on 2026-04-28 02:30:43.

- Files: 15
- File kinds: React/TSX module (13), TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/client/ads-preview.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 123
- Bytes: 4199
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
- Defines: AdsPreview, TH, TD, sorted, showRevenue, AdPreview
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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Lines: 342
- Bytes: 9776
- Imports (internal): src/app/client/[slug]/types.ts, src/components/client/charts/types.ts
- Imports (packages): react, recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/app / client, src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: AudienceDemographics
- Symbol details: function AudienceDemographics (exported), function aggregateByAge, function aggregateByGender, function buildHeatCells, function AgeTab, function GenderTab, function HeatmapTab, const AGE_ORDER, type Tab, interface AgeRow, interface GenderRow, interface HeatCell
- Defines: aggregateByAge, aggregateByGender, buildHeatCells, AudienceDemographics, AgeTab, GenderTab, HeatmapTab, cellBg, AGE_ORDER, map, total, ageSet, … (+15 more)
- Contents summary: contains `use client`; exports: AudienceDemographics; internal imports: 2; package imports: 2

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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Lines: 21
- Bytes: 741
- Imports (internal): src/components/client/charts/types.ts, src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/market-charts.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/placement-bar-chart.tsx
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Depends on groups: src/components / client
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart, PerformanceTrendTabs, MarketPerformanceTable, AudienceDemographics, PlacementBarChart
- Contents summary: exports: AgeDistributionChart, GenderDonutChart, AgeGenderHeatmap, PlacementTreemap, PlacementTable, HourlyHeatmap, DailyTrendChart, DayOfWeekChart; internal imports: 10

## `src/components/client/charts/market-charts.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 93
- Bytes: 4135
- Imports (internal): src/components/client/charts/types.ts, src/lib/formatters.tsx
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client, src/lib
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: MarketPerformanceTable
- Symbol details: function MarketPerformanceTable (exported)
- Defines: MarketPerformanceTable, sorted, maxPct
- Contents summary: exports: MarketPerformanceTable; internal imports: 2

## `src/components/client/charts/performance-trend-tabs.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 232
- Bytes: 6785
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): react, recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: PerformanceTrendTabs
- Symbol details: function PerformanceTrendTabs (exported), function moneyFormatter, function LegendItem, type MetricKey, interface Props
- Defines: moneyFormatter, PerformanceTrendTabs, LegendItem, formatted, chartData, availableMetrics, value, metric, row, numericValue, v, selected, … (+3 more)
- Contents summary: contains `use client`; exports: PerformanceTrendTabs; internal imports: 1; package imports: 2

## `src/components/client/charts/placement-bar-chart.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 110
- Bytes: 3705
- Imported by: src/components/client/charts/index.ts
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: PlacementBarChart
- Symbol details: function PlacementBarChart (exported), function normalizePlacement, function titleCase, interface PlacementBarData, interface ChartRow
- Defines: normalizePlacement, titleCase, PlacementBarChart, platformLower, positionLower, platformName, placementName, badge, badgeClassName, placement, maxPct, PlacementBarData, … (+1 more)
- Tests / describe labels: 
- Contents summary: exports: PlacementBarChart; tests/describes:

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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: PlacementTreemap, PlacementTable
- Symbol details: function PlacementTreemap (exported), function PlacementTable (exported)
- Defines: PlacementTreemap, PlacementTable, byPlatform, prev, totalImp, platforms, maxPct, barColor, sorted, pct
- Contents summary: exports: PlacementTreemap, PlacementTable; internal imports: 2

## `src/components/client/charts/time-charts.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / client
- Ownership: shared client UI components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 214
- Bytes: 7811
- Imports (internal): src/components/client/charts/types.ts
- Imports (packages): recharts
- Imported by: src/components/client/charts/index.ts
- Depends on groups: src/components / client
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Lines: 114
- Bytes: 2258
- Imported by: src/components/client/charts/age-distribution-chart.tsx, src/components/client/charts/age-gender-heatmap.tsx, src/components/client/charts/audience-demographics.tsx, src/components/client/charts/gender-donut-chart.tsx, src/components/client/charts/index.ts, src/components/client/charts/market-charts.tsx, src/components/client/charts/performance-trend-tabs.tsx, src/components/client/charts/placement-charts.tsx, src/components/client/charts/time-charts.tsx
- Used by groups: src/components / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
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
- Imported by: src/app/client/[slug]/campaign/[campaignId]/error.tsx, src/app/client/[slug]/campaigns/error.tsx, src/app/client/[slug]/error.tsx
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
- Imported by: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Depends on groups: src/components / ui
- Used by groups: src/app / client
- Route owners: src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
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
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts
- Exports: PlatformIcon
- Symbol details: function PlatformIcon (exported)
- Defines: PlatformIcon, icon
- Contents summary: exports: PlatformIcon
