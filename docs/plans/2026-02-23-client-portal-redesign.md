# Client Portal Redesign — 2026-02-23

## Goal

Redesign the client-facing portal (`/client/[slug]`) to be a clean, high-contrast dark dashboard that gives clients an overall view of their tour campaign — spend, ROAS, show sell-through, and audience demographics — without exposing any agency mechanics (campaign names, ad sets, assets, Meta structure).

## What the Client Sees

Any client (KYBBA, Zamora, etc.) opens their portal and sees:

1. **Date filter** — Last 7 days / Last 14 days toggle (top right)
2. **3 hero numbers** — Total Spend | Blended ROAS | Shows Running
3. **City cards** — one card per show/city, sorted by date
4. **Audience overview** — blended demographics (gender, age, income) across all shows

## What the Client Does NOT See

- Campaign names or IDs
- Ad set structure
- Creative/asset counts or video counts
- Impressions, CTR, CPM, CPC
- Meta platform terminology
- "Active" / "Paused" campaign status
- Any agency tooling or internal structure

## Layout

```
[Header: Client Name]                    [Last 7d | Last 14d]

[Total Spend]    [Blended ROAS]    [Shows Running]

[City Card] [City Card] [City Card]
[City Card] [City Card] [City Card]

[Audience Profile — Gender | Age | Income]

[Footer: Powered by Outlet Media]
```

### City Card Contents
- City name (large, bold)
- Date + venue (small, muted)
- Spend (large number)
- ROAS (large, color-coded)
- Sell-through bar + percentage (only if ticket data exists)

## Color Palette

| Element             | Value      |
|---------------------|------------|
| Page background     | `#09090B`  |
| Card background     | `#18181B`  |
| Card border         | `#27272A`  |
| Primary text        | `#FAFAFA`  |
| Muted text          | `#A1A1AA`  |
| ROAS good (3x+)     | `#4ADE80`  |
| ROAS mid (2–3x)     | `#FCD34D`  |
| ROAS low (<2x)      | `#F87171`  |
| Sell-through bar    | `#818CF8`  |
| Filter toggle active| `#FAFAFA` bg / `#09090B` text |

## Typography

- Hero numbers: 40px+, `#FAFAFA`, bold
- City name on card: 20–22px, `#FAFAFA`, semibold
- Spend + ROAS on card: 28px, bold
- Labels: 11–12px, `#A1A1AA`, uppercase tracking-wide
- Venue/date: 13px, `#A1A1AA`

## Date Filter Behavior

- Toggles between last 7 days and last 14 days
- Filters campaign snapshot data (spend, ROAS) from `campaign_snapshots` table
- Show/event data (date, venue, sell-through) is not date-filtered — always shows all upcoming shows
- Default: last 7 days

## Data Sources

| Data point       | Source                          |
|------------------|---------------------------------|
| Spend, ROAS      | `campaign_snapshots` (filtered by date range, summed per client_slug) |
| City, date, venue| `tm_events` (client_slug filter) |
| Sell-through     | `tm_events.tickets_sold` + `tickets_available` |
| Gender/age/income| `tm_event_demographics` (blended across client's events) |

## Files to Change

- `src/app/client/[slug]/page.tsx` — full rewrite
- `src/app/client/[slug]/layout.tsx` — check if date filter state needs to live here
- `src/app/client/[slug]/campaigns/page.tsx` — remove or simplify (not linked from new design)
