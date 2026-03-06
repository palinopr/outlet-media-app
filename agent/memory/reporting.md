# Reporting Agent Memory

## Role
Cross-source analytics. Combines Meta campaign data + TM ticket data + Supabase snapshots
to generate reports, trends, and dashboards.

## Supabase Tables
- **meta_campaigns**: campaign_id, name, status, spend (cents bigint), impressions, clicks, roas, cpm, cpc, ctr, daily_budget (cents), start_time
- **campaign_snapshots**: campaign_id, spend (cents), impressions, clicks, roas, cpm, cpc, ctr, snapshot_date (UNIQUE campaign_id + snapshot_date, UPSERT = ON CONFLICT DO NOTHING)
- **tm_events**: TM One event data
- **event_snapshots**: tm_id, tickets_sold, tickets_available, gross, snapshot_date (UNIQUE tm_id + snapshot_date)
- **agent_tasks**: from_agent, to_agent, action, params, status, result, error, created_at
- **agent_runtime_state**: key, value JSON, updated_at
- **agent_alerts**: level (info/warn/error), read_at for dismissal

## Column Naming Gotchas
- Campaign name column is `name` (NOT `campaign_name`)
- Spend column is `spend` (NOT `spend_cents`) -- value IS in cents despite the name
- Use `created_at` for ordering `agent_tasks`
- Runtime status is stored in `agent_runtime_state.value`

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

## Data Pipeline Status (Mar 6)
- campaign_snapshots: resumed after the Feb/Mar gap; use live `meta_campaigns` for current state and snapshots for trend windows.
- event_snapshots: populated, but TM velocity remains limited until TM1 event APIs are stable.
- Gmail ingestion: Pub/Sub push into `/api/agents/email/watch`, with history polling only as a fallback.
- Owner alerts and reviews now live in Discord (`#boss`, `#email`, `#email-log`).

## Ingest/Alerts Endpoints
- Ingest: POST /api/ingest with x-ingest-secret header
- Alerts: POST /api/alerts { secret, message, level } -- creates visible dashboard alert
- Both return 401 if unauthenticated (expected)

## Infrastructure
- Supabase URL: https://dbznwsnteogovicllean.supabase.co
- Dashboard: Railway (outlet-media-app-production.up.railway.app)
- All mock data removed from dashboard -- all pages read from Supabase
