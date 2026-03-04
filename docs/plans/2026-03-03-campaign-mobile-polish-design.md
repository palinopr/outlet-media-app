# Campaign Detail Mobile Polish Design

Date: 2026-03-03

## Problem

The campaign detail page (`/client/[slug]/campaign/[campaignId]`) has a placement breakdown table that is unreadable on mobile (390px viewport). Columns merge together, values overlap. The rest of the page is functional but could be tighter and more client-friendly on phones.

## Changes

### 1. Platform Icons Component

New file: `src/components/client/platform-icons.tsx`

Inline SVG icons for Facebook (blue), Instagram (pink), Messenger (blue), threads (gray), Audience Network (amber). No new dependencies. Exports a `PlatformIcon` component that takes a platform name and renders the corresponding icon.

### 2. Placement Breakdown -- Cards on Mobile

File: `src/components/client/charts/placement-charts.tsx`

- Desktop (`md:+`): Keep existing table, replace colored dots with `PlatformIcon`
- Mobile (`< md`): Stack of cards, each showing:
  - Header: icon + platform/position name, share % on right
  - Divider line
  - 3-column grid: Impressions, Clicks, CTR
- Sorted by impressions descending

### 3. ROAS Card Full-Width on Mobile

File: `src/app/client/[slug]/campaign/[campaignId]/page.tsx`

ROAS StatCard gets `col-span-2 lg:col-span-1` to span both columns in the mobile 2-col grid, making it the hero metric.

### 4. Tighter Mobile Padding

Files:
- `src/app/client/[slug]/components/stat-card.tsx`: `p-3 sm:p-4`
- `src/app/client/[slug]/layout.tsx`: content wrapper `px-4 sm:px-6`

### 5. Section Reorder on Mobile

File: `src/app/client/[slug]/components/campaign-analytics.tsx`

Use CSS `order` utilities so on mobile:
1. Performance Timeline appears before Audience Demographics
2. Desktop layout unchanged

### 6. Desktop Table Icons

Same `PlacementTable` file -- swap colored dots for `PlatformIcon` in the desktop table view too.
