# Reporting Agent Memory

## Role
Cross-source analytics. Combines Meta campaign data + TM ticket data + Supabase snapshots
to generate reports, trends, and dashboards.

## Current Campaign Landscape (Mar 9 2026, Cycle #156)
- **29 total campaigns** (8 ACTIVE, 21 PAUSED)
- Data freshness: session cache from Mar 8 18:01 CST (>24h stale as of Mar 9)

### ACTIVE (8)
- KYBBA Miami -- $2,703 spend, 2.47x ROAS, $100/day. Show Mar 22.
- Camila Anaheim -- $1,541 spend, 4.16x ROAS, $100/day. Show Mar 14.
- Camila Sacramento -- $1,539 spend, 4.92x ROAS, $100/day. Show Mar 15.
- Camila Phoenix -- $1,771 spend, 3.02x ROAS, $500/day. Show Mar 8 PAST.
- Arjona Salt Lake City -- $1,131 spend, 17.72x ROAS, $800/day. Show Mar 9.
- Arjona Palm Desert -- $320 spend, 3.35x ROAS, $500/day. Show Mar 12.
- Arjona San Francisco -- $323 spend, 7.51x ROAS, $50/day. Show Mar 15.
- Vaz Vil - Kiko Blade -- $197 spend, 0x ROAS, $50/day.

## Client List
- **Zamora** (slug: "zamora") -- sub-brands: Arjona (tour), Camila (tour), Alofoke (one-off shows)
- **KYBBA** (slug: "kybba") -- separate music promoter
- **Sienna** (slug: "sienna") -- music artist, ViewContent optimization (0x ROAS expected)
- **Vaz Vil** (slug: "vaz_vil") -- new client Mar 3
- **Don Omar BCN** (slug: "don_omar_bcn") -- Barcelona concert Jul 23, tickets via Vivaticket/EATA
- **Beamina** (slug: "beamina") -- music promoter
- **Happy Paws** (slug: "happy_paws")
- Unknown campaigns default to slug: "unknown"

## Snapshot Availability
- `campaign_snapshots`: 9+ dates available. Consecutive data Mar 5-8.
- **Gaps**: Feb 20-22 (scheduler down 76h) + Feb 27-Mar 4 (permanent, unrecoverable).
- Snapshot UPSERT is write-once (ON CONFLICT DO NOTHING). First sync of the day wins at 00:00 UTC (6 PM CST).
- Snapshot-to-live divergence scales with campaign age. Use snapshots for trends, live for current.

## EATA / Don Omar BCN
- Data source: Vivaticket (entradasatualcance.com), NOT Ticketmaster
- Currency: EUR (not USD). Revenue in whole euros. Do not convert -- report as EUR.
- Event: DON OMAR BARCELONA (eata_14948). Venue: Estadio Olimpico Lluis Companys.
- Last known: 30,052 tickets sold, 3,231,949 EUR gross, 442 tickets/day, avg price 107.55 EUR.
- Syncs every 2h via `eata-http-sync.mjs`. Token refreshed every 6h via Playwright.

## Report Formats
- **Daily**: key metrics per ACTIVE campaign (spend, ROAS, budget, pacing). Flag anomalies.
- **Weekly**: trend analysis across snapshot dates. ROAS trajectory, spend velocity, delivery issues.
- **Post-show**: final ROAS, total spend, total purchases/revenue, tickets sold if available. Compare to pre-show projections.

## Data Storage Conventions
- Supabase: monetary values in CENTS (bigint). spend=224000 = $2,240.00
- Display: `centsToUsd(n) = n/100`
- ROAS: stored as float (e.g. 8.4). NOT cents, not percentage.
- Meta API: cpm/cpc = dollar strings (stored as-is). ctr = percentage string.
- Column `name` (NOT `campaign_name`). Column `spend` (NOT `spend_cents`).

## Supabase Tables
- **meta_campaigns**: campaign_id, name, status, spend, impressions, clicks, roas, cpm, cpc, ctr, daily_budget, start_time
- **campaign_snapshots**: campaign_id, spend, impressions, clicks, roas, cpm, cpc, ctr, snapshot_date
- **tm_events**: TM One event data (name, date, venue, tickets_sold, etc.)
- **event_snapshots**: tm_id, tickets_sold, tickets_available, gross, snapshot_date
- **agent_alerts**: level (info/warn/error), read_at for dismissal

## Infrastructure
- Supabase: https://dbznwsnteogovicllean.supabase.co
- Dashboard: Railway (outlet-media-app-production.up.railway.app)
- Ingest: POST /api/ingest with x-ingest-secret header
- Alerts: POST /api/alerts { secret, message, level }
