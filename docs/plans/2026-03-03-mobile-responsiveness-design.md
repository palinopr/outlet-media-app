# Mobile Responsiveness Design

Date: 2026-03-03

## Goal

Make every admin and client-facing page fully mobile-friendly. Both the Outlet Media admin team and client promoters use phones equally.

## Current State

The app has a solid responsive foundation:
- Admin sidebar: `hidden lg:flex` with mobile Sheet drawer -- works well
- Client layout: same pattern, fixed mobile header with `lg:hidden` -- works well
- Most grids use breakpoints (`grid-cols-1 lg:grid-cols-3`, etc.)
- Placement charts already have the gold-standard card-stack pattern

Gaps:
- All data tables (5 admin + 1 client) overflow on mobile with no responsive handling
- Some stat grids hardcoded to 3-4 columns regardless of screen size
- Agent chat panel 640px fixed height fills entire phone screen
- Form inputs with fixed widths (`w-48`, `w-52`) don't scale
- Chart containers all use fixed `h-52`
- Inconsistent card padding

## Design

### 1. Data Tables -> Card Stacks on Mobile

**Affected**: Campaigns, Events, Clients, Users, Activity (admin); Campaigns (client)

Pattern: Follow `placement-charts.tsx` -- `hidden md:block` for table, `md:hidden` for cards.

Each card layout:
- Primary identifier bold at top (campaign name, event name, user email)
- 2-column grid of key metrics below
- Actions (if any) at bottom right
- Status badge inline with title

Desktop DataTable component unchanged. Mobile cards are a sibling component per page reading from the same data source.

### 2. Admin Stat Grids

| Page | Current | Fix |
|------|---------|-----|
| Users | `grid-cols-4` | `grid-cols-2 lg:grid-cols-4` |
| Dashboard secondary | `grid-cols-3` | `grid-cols-1 sm:grid-cols-3` |
| Dashboard campaign metrics | 5 inline `flex gap-6` | `flex flex-wrap gap-4` |

### 3. Admin Agents Chat Panel

- Mobile (<lg): Chat opens as full-screen Sheet overlay (`side="bottom"`, `h-[100dvh]`)
- Agent list shows normally as stacked cards
- Tapping an agent opens the chat sheet
- Close button to dismiss
- Desktop (lg+): Current 2-column side-by-side layout preserved

### 4. Admin Forms & Inputs

- Settings inputs: `w-48` -> `w-full sm:w-48`
- Client invite forms: same pattern
- Filter rows: add `flex-wrap` so buttons wrap instead of overflow

### 5. Client Campaigns Table

Same card-stack pattern as admin tables. 7-column table becomes cards with campaign name, spend, revenue, ROAS, impressions, CTR, CPC in a 2-column grid.

### 6. Age-Gender Heatmap

Add horizontal scroll with sticky first column (gender labels). The heatmap already has `overflow-x-auto` but the gender column should stick.

### 7. Chart Heights

All `h-52` chart containers -> `h-40 sm:h-52`. Recharts' ResponsiveContainer handles width automatically.

### 8. Global Polish

- Card padding: standardize to `p-3 sm:p-4` where currently hardcoded `p-5`
- Touch targets: ensure buttons are minimum 44px (h-11 in Tailwind)
- No changes to mobile sidebar/header -- already working well

## Out of Scope

- Native app or PWA
- Gesture navigation
- Offline support
- Landscape-specific layouts
