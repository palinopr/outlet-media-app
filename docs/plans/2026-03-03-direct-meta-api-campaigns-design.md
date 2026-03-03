# Direct Meta API for Campaigns (Admin + Client)

## Problem
The admin campaigns page reads from Supabase, which is only populated by the agent's periodic sync. Old/paused campaigns that the agent never synced don't appear. The app should connect directly to Meta.

## Solution
Both `/admin/campaigns` and `/client/[slug]` fetch campaign data directly from the Meta Graph API. No Supabase dependency for campaign data.

## New modules

### `src/lib/meta-campaigns.ts`
Single source of truth for fetching campaigns from Meta:
- `fetchAllCampaigns(range)` -- all campaigns + insights + day-by-day sparkline data
- Returns campaigns with derived `clientSlug` on each
- Handles Meta pagination

### `src/lib/client-slug.ts`
- `guessClientSlug(campaignName)` -- keyword matching:
  - "arjona", "alofoke", "camila" -> "zamora"
  - "kybba" -> "kybba"
  - "beamina" -> "beamina"
  - "happy paws" / "happy_paws" -> "happy_paws"
  - default -> "unknown"

## Admin page changes (`/admin/campaigns`)
- Calls `fetchAllCampaigns(range)` -- all campaigns, all statuses
- Date range picker (Today, Yesterday, 7d, 14d, 30d, Lifetime)
- Client filter dropdown from `guessClientSlug()` results
- Sparklines from Meta day-by-day data (not Supabase snapshots)
- Error state if Meta API is down (no silent fallback to stale data)

## Client portal changes (`/client/[slug]`)
- Same `fetchAllCampaigns(range)`, filtered by `clientSlug === slug`
- Removes Supabase `meta_campaigns` lookup
- Events + demographics still from Supabase (TM data)

## Meta API calls (per page load)
1. `act_{id}/campaigns?fields=id,name,status,objective,daily_budget,start_time&limit=500`
2. `act_{id}/insights?level=campaign&fields=...&date_preset={range}&limit=500`
3. `act_{id}/insights?level=campaign&fields=...&date_preset={range}&time_increment=1&limit=5000`

Cached with `revalidate: 300` (5 min).

## Untouched
- Agent's Supabase sync (still runs for agent tasks)
- TM events/demographics (still Supabase)
- Campaign creation/status/budget API routes (already direct to Meta)
- `campaign_snapshots` table (agent can still write)
