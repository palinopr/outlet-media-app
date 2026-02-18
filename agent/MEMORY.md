# Outlet Media Agent — Shared Memory

## Who Is Jaime
- Jaime Ortiz, founder of Outlet Media
- Manages Meta ad campaigns for music promoters via Outlet Media
- Communicates via Telegram (@Outletmedia_bot) and the Outlet Media web dashboard
- Prefers short, direct answers — answer first, offer details second
- Don't ask too many questions — plan, show the plan, then execute
- Wants fully autonomous AI — only surface decisions that require real money or strategy

## What Outlet Media Does
- Media buying company — buys ads on Facebook/Instagram for music promoters
- Clients are promoters who run concert tours
- Dashboard at outlet-media-app (Next.js + Supabase) shows TM One ticket data + Meta campaign data
- Agent runs locally on Jaime's Mac, pushes data to Supabase, dashboard reads Supabase

## Clients
All campaigns are in one Meta ad account (act_787610255314938). Client is determined by campaign name.

- **Zamora** (slug: "zamora") — music promoter, campaign name contains "arjona" (case-insensitive)
  - Tours sold through Ticketmaster One (one.ticketmaster.com)
  - Client portal: /client/zamora
- **KYBBA** (slug: "kybba") — separate music promoter, not a Zamora sub-campaign
- **Beamina** (slug: "beamina") — music promoter
- **Happy Paws** (slug: "happy_paws") — client
- Unknown campaigns default to slug: "unknown"

## Infrastructure
- **Supabase**: https://dbznwsnteogovicllean.supabase.co
  - Tables: tm_events, meta_campaigns, agent_jobs, campaign_snapshots, event_snapshots, agent_alerts
  - `campaign_snapshots` — daily ROAS/spend snapshot per campaign (UNIQUE campaign_id + snapshot_date)
  - `event_snapshots` — daily ticket sales snapshot per TM event (UNIQUE tm_id + snapshot_date)
  - `agent_alerts` — proactive alerts (level: info/warning/critical, read_at for dismissal)
- **Meta API**: Graph API v21.0, ad account act_787610255314938
  - Pixel ID: 879345548404130
  - Page ID: 175118299508364
  - Instagram ID: 17841402356610735
- **Ingest endpoint**: POST /api/ingest with secret header (`x-ingest-secret` or body `secret`)
- **Alerts endpoint**: POST /api/alerts `{ secret, message, level, client_slug? }` to create an alert visible in dashboard
- **Local agent**: runs on Jaime's Mac, polls Supabase for jobs, pushes data via ingest
- **Telegram bot**: @Outletmedia_bot (token in .env)
- **Dashboard app**: Railway (formerly localhost:3000 for dev)

## Campaign Strategy (from Arjona tour learnings)
- CBO (Campaign Budget Optimization) + broad targeting
- 3-Day Rule: every new creative gets 3 days to prove itself, then kill or scale
- Best performing segment: Female 35-44 (historically 9.8x ROAS)
- Facebook > Instagram for purchases
- Retargeting = 5x ROAS typically
- NEVER kill a city/show entirely — find new strategy (new creative, expand radius, retargeting)
- ROAS below 2.0 = flag for review, not automatic kill
- Urgency creatives in the final week before show date

## Learned Preferences
- Keep Telegram messages short and factual
- Surface only meaningful changes (not routine "nothing changed" checks)
- BE PROACTIVE — if data shows an issue, say so without being asked
- When in doubt about campaign data, pull it live — never cite from memory
- MEMORY.md is the source of truth for context that survives between sessions

## Data Storage Conventions
- **Supabase stores monetary values in CENTS** (bigint): spend=224000 means $2,240.00
- Meta API: `daily_budget` and `lifetime_budget` come in cents natively from Meta
- Meta API: `spend`, `cpm`, `cpc` come as dollar strings — agent multiplies by 100 before storing
- Dashboard and client portal use `centsToUsd(n) = n/100` helper
- ROAS is stored as a float (e.g., 8.4) — NOT in cents, not a percentage
- `start_time` on meta_campaigns is an ISO8601 timestamptz string (used for pacing calculations)

## Things To Remember
- TM One credentials go in .env (TM_EMAIL, TM_PASSWORD) — not yet configured
- Meta credentials are in the app's ../.env.local — agent reads them from the parent directory
- Agent working directory is /Users/jaimeortiz/outlet-media-app/agent — all paths relative to here
- INGEST_URL should point to Railway (or localhost:3000 for dev)
- LEARNINGS.md is the think-loop journal — read it first every cycle
- session/ directory holds last-events.json and last-campaigns.json (inter-run cache)
- session/proposals.md has 6 ranked capability proposals (created Cycle #4)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
