# Reporting Agent Memory

## Role
Cross-source analytics. Combines Meta campaign data + TM ticket data + Supabase snapshots
to generate reports, trends, and dashboards.

## Supabase Tables
- **meta_campaigns**: campaign_id, name, status, spend (cents bigint), impressions, clicks, roas, cpm, cpc, ctr, daily_budget (cents), start_time
- **campaign_snapshots**: campaign_id, spend (cents), impressions, clicks, roas, cpm, cpc, ctr, snapshot_date (UNIQUE campaign_id + snapshot_date, UPSERT = ON CONFLICT DO NOTHING)
- **tm_events**: TM One event data
- **event_snapshots**: tm_id, tickets_sold, tickets_available, gross, snapshot_date (UNIQUE tm_id + snapshot_date)
- **agent_jobs**: agent_id, status, prompt, result, error, created_at (NOT started_at for ordering)
- **agent_alerts**: level (info/warning/critical), read_at for dismissal

## Column Naming Gotchas
- Campaign name column is `name` (NOT `campaign_name`)
- Spend column is `spend` (NOT `spend_cents`) -- value IS in cents despite the name
- Job type column is `agent_id` (NOT `job_type`)
- Use `created_at` for ordering agent_jobs (NOT `started_at` which can be null)

## Data Storage Conventions
- Supabase: monetary values in CENTS (bigint). spend=224000 = $2,240.00
- Meta API: daily_budget/lifetime_budget = cents natively
- Meta API: spend = dollar string (multiply by 100 for Supabase)
- Meta API: cpm/cpc = dollar strings (stored as-is)
- Meta API: ctr = percentage string (e.g. "1.48" = 1.48%)
- ROAS = float (e.g. 8.4). NOT cents, not percentage.
- Dashboard uses centsToUsd(n) = n/100

## Snapshot Methodology
- Snapshot UPSERT is write-once: ON CONFLICT DO NOTHING. First sync of the day wins.
- First sync fires at 00:00 UTC (6 PM CST previous day).
- Consecutive-day snapshot deltas are UNRELIABLE (Meta reporting lag).
- Need 2+ day gaps for reliable marginal ROAS calculations.
- Snapshot-to-live divergence scales with campaign age. Use snapshots for trends, live for current picture.

## Data Pipeline Status (Feb 25)
- campaign_snapshots: 4 dates (Feb 19, 23, 24, 25). Gap Feb 20-22 (unrecoverable).
- event_snapshots: 72 rows, 3 dates (Feb 23, 24, 25), 24 events/date.
- Meta syncs: working (cron at 00/06/12/18 UTC). NOW DISABLED -- manual only.
- TM scrapes: working (GraphQL captures 25 events).

## Ingest/Alerts Endpoints
- Ingest: POST /api/ingest with x-ingest-secret header
- Alerts: POST /api/alerts { secret, message, level } -- creates visible dashboard alert
- Both return 401 if unauthenticated (expected)

## Infrastructure
- Supabase URL: https://dbznwsnteogovicllean.supabase.co
- Dashboard: Railway (outlet-media-app-production.up.railway.app)
- All mock data removed from dashboard -- all pages read from Supabase
