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
- **Alerts endpoint**: POST /api/alerts `{ secret, message, level }` to create an alert visible in dashboard (no client_slug field)
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
- **Session cache naming**: `spend` = dollars (float), `daily_budget_cents` = cents (int). The ingest route expects `daily_budget` (in cents).
- **Session cache vs Supabase gap**: session cache has daily_budget_cents for 11/13 campaigns, but Supabase daily_budget is null for ALL (ingest POST wasn't sending it — prompt fixed Cycle #5, awaiting sync)

## Known Data Pipeline Gaps (as of Cycle #7, verified Cycle #7 Supabase query)
- `daily_budget` is null for ALL 13 campaigns **in Supabase** — prompt was fixed (Cycle #5), but no Meta sync has run since to verify the fix works
  - Session cache DOES have `daily_budget_cents` for 11/13 campaigns (null for Beamina V3 and KYBBA Miami)
  - The ingest POST must map `daily_budget_cents` → `daily_budget` for Supabase
- `start_time` is null for ALL 13 campaigns in BOTH session cache AND Supabase — the Meta API fetch does not request this field yet
- `campaign_snapshots` and `event_snapshots` tables exist but are EMPTY — no snapshot insertion logic implemented yet
- **Pacing checks (P4):** BLOCKED — need daily_budget and start_time in Supabase
- **ROAS trend checks (P4):** BLOCKED — need campaign_snapshots to be populated
- **Next Meta sync should verify:** daily_budget flows to Supabase; start_time is fetched from Meta API and stored

## Current Campaign Landscape (as of 2026-02-18)
- **13 total campaigns** in session cache (1 ACTIVE, 12 PAUSED)
- **ACTIVE:** Denver V2 (Zamora) — ROAS 8.40×, $2,240 spend, $750/day budget. Healthy.
- **Recently PAUSED:** KYBBA Miami — was ACTIVE at start of day (Cycle #1), paused by Cycle #5. ROAS 2.79× when paused.
- **Clients represented:** Zamora (9 campaigns), KYBBA (1), Beamina (1), Happy Paws (1), Zamora-Denver Retargeting (1)
- **No TM One data** — credentials still blank, no last-events.json exists

## Things To Remember
- TM One credentials go in .env (TM_EMAIL, TM_PASSWORD) — **not yet configured** (still blank as of Cycle #7)
- Meta credentials are in the app's ../.env.local — agent reads them from the parent directory
- Agent working directory is /Users/jaimeortiz/outlet-media-app/agent — all paths relative to here
- INGEST_URL should point to Railway (or localhost:3000 for dev)
- LEARNINGS.md is the think-loop journal — read it first every cycle
- session/ directory holds last-events.json (not yet created) and last-campaigns.json (inter-run cache)
- session/proposals.md has 6 ranked capability proposals (created Cycle #4, status tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min

## Proposals Status (from session/proposals.md, Cycle #4, last verified Cycle #7)
- **P5 (Fix campaigns page):** ✅ DONE — campaigns page now reads from Supabase
- **P6 (Client slug validation):** ✅ RESOLVED — KYBBA now has correct slug "kybba"
- **P1 (Campaign-event linking):** ⏳ BLOCKED — requires TM One data (no credentials yet)
- **P3 (Daily pacing alerts):** ⏳ BLOCKED — requires daily_budget AND start_time in Supabase
  - daily_budget: prompt fix done (Cycle #5), awaiting Meta sync to verify
  - start_time: NOT being fetched from Meta API at all — needs additional prompt/code work
- **P2 (Historical snapshots):** ⏳ NOT STARTED — tables exist but no insertion logic
- **P4 (Sell-through velocity):** ⏳ BLOCKED — depends on P2 + TM One data
