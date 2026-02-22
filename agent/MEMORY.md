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
    - Columns: id, campaign_id, spend (cents bigint), impressions, clicks, roas, cpm, cpc, ctr, snapshot_date, created_at
    - Note: column is `spend` NOT `spend_cents` — value is in cents despite the name
  - `event_snapshots` — daily ticket sales snapshot per TM event (UNIQUE tm_id + snapshot_date)
  - `agent_jobs` — scheduler heartbeats and job tracking
    - Columns: id, agent_id (e.g. "heartbeat"), status, prompt, result, error, created_at, updated_at, started_at, finished_at
    - Note: column is `agent_id` NOT `job_type`. Use `created_at` for ordering (not `started_at` which can be null)
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
- **Supabase column naming**: campaign name column is `name` (NOT `campaign_name`). Query with `select=campaign_id,name,status,...`
- **Supabase stores monetary values in CENTS** (bigint): spend=224000 means $2,240.00
- Meta API: `daily_budget` and `lifetime_budget` come in cents natively from Meta
- Meta API: `spend` comes as a dollar string — agent multiplies by 100 before storing as cents
- Meta API: `cpm`, `cpc` come as dollar strings — stored as-is in dollars (NOT multiplied by 100)
- Meta API: `ctr` comes as a percentage string (e.g. "1.48" = 1.48%) — stored as-is (NOT a monetary value)
- Dashboard and client portal use `centsToUsd(n) = n/100` helper
- ROAS is stored as a float (e.g., 8.4) — NOT in cents, not a percentage
- `start_time` on meta_campaigns is an ISO8601 timestamptz string (used for pacing calculations)
- **Session cache naming**: `spend` = dollars (float), `daily_budget_cents` = cents (int). The ingest route expects `daily_budget` (in cents).
- **Session cache vs Supabase alignment**: Both session cache (`daily_budget_cents`) and Supabase (`daily_budget`) are populated for all campaigns as of 2026-02-19. The ingest maps `daily_budget_cents` → `daily_budget`.

## Data Pipeline Status (verified 2026-02-19, Cycle #14)
- `daily_budget` ✅ populated for all 13 campaigns in Supabase
- `start_time` ✅ populated for all 13 campaigns in Supabase
- `campaign_snapshots` ✅ 13 rows exist — ALL dated 2026-02-19 (only 1 day of data so far)
- `event_snapshots` table exists but still EMPTY — no TM One data yet
- **Pacing checks (P4):** UNBLOCKED — daily_budget and start_time in Supabase. First pacing check ran Cycle #10.
- **ROAS trend checks (P4):** Still waiting for 3+ days of snapshot data (available ~Feb 22). Only 1 snapshot date exists so far.

## Known Issues (tracked, ranked by impact — updated Cycle #15)
1. 🔴 **Agent scheduler is NOT running** — No `outlet-media-app/agent` process in ps aux. Last heartbeat in Supabase: Feb 18 15:11 CST (~23h ago). Session cache last updated Feb 19 06:03 (likely from desktop app, not agent scheduler). No Meta syncs, think cycles, or heartbeats firing. **Fix: `npm start` in a persistent terminal (tmux/screen/nohup) from the agent directory.** (Discovered Cycle #15)
2. 🔴 **`/api/alerts` blocked by Clerk auth** — POST returns 307 redirect to /sign-in. Root cause: `/api/alerts` not in Clerk `publicRoutes` in `middleware.ts` (Next.js app). Agent cannot post dashboard alerts. **Needs Jaime to fix.** (Discovered Cycle #10, confirmed Cycles #11-15)
3. 🔴 **Spend freeze on both ACTIVE campaigns** — Denver V2 ($2,240) and KYBBA ($2,069) unchanged since at least Feb 18 (36+ hours). Cannot diagnose further without fresh syncs (blocked by #1). Flagged to Jaime via Telegram draft in Cycle #10.
4. 🟡 **TM One credentials blank** — blocks event data, sell-through analysis, campaign-event linking.
5. 🟢 **`/api/health` returns 404** — endpoint doesn't exist on Railway server. Not critical.

## Current Campaign Landscape (as of 2026-02-19 13:30 CST)
- **13 total campaigns** in session cache (2 ACTIVE, 11 PAUSED)
- **ACTIVE:** Denver V2 (Zamora) — ROAS 9.82×, $2,240 spend, $750/day budget. Star performer but spend frozen.
- **ACTIVE:** KYBBA Miami — ROAS 2.73×, $2,069 spend, $100/day budget. Back to ACTIVE (was PAUSED on 2026-02-18). Above 2.0 threshold but trending down. Show date 03/22 (~1 month out).
- **⚠️ SPEND FREEZE (tracked since Cycle #10, persistent through Cycle #15):** Both ACTIVE campaigns show zero spend increase for 36+ hours. Denver V2 stuck at $2,240, KYBBA at $2,069. Session cache last refreshed 06:03 Feb 19 — but scheduler is confirmed DOWN since ~15:11 CST Feb 18, so no new syncs are firing. Cannot determine if spend is truly frozen or if we're just not getting fresh data.
- **⚠️ Denver Retargeting** — ROAS 0.39× (PAUSED). Below 2.0 threshold. Low spend ($126). Not urgent since paused.
- **Clients represented:** Zamora (10 campaigns), KYBBA (1), Beamina (1), Happy Paws (1)
- **No TM One data** — credentials still blank, no last-events.json exists

## Things To Remember
- TM One credentials go in .env (TM_EMAIL, TM_PASSWORD) — **not yet configured** (still blank as of Cycle #14)
- Meta credentials are in the app's ../.env.local — agent reads them from the parent directory
- Agent working directory is /Users/jaimeortiz/outlet-media-app/agent — all paths relative to here
- INGEST_URL should point to Railway (or localhost:3000 for dev)
- LEARNINGS.md is the think-loop journal — read it first every cycle
- session/ directory holds last-events.json (not yet created) and last-campaigns.json (inter-run cache)
- session/proposals.md has 6 ranked capability proposals (created Cycle #4, status tracked in Proposals Status section above)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min
- **Claude CLI:** v2.1.47 at `/Users/jaimeortiz/.local/bin/claude`

## Proposals Status (from session/proposals.md, last verified Cycle #14)
- **P5 (Fix campaigns page):** ✅ DONE
- **P6 (Client slug validation):** ✅ RESOLVED
- **P1 (Campaign-event linking):** ⏳ BLOCKED — requires TM One credentials (still blank)
- **P3 (Daily pacing alerts):** ✅ ACTIVE — first pacing check ran Cycle #10. Denver V2 flagged at 37% pacing. Methodology needs improvement for campaigns with pause history.
- **P2 (Historical snapshots):** ✅ ACTIVE — 13 snapshots exist (all 2026-02-19). Need 3+ days for ROAS trend analysis (~Feb 22).
- **P4 (Sell-through velocity):** ⏳ BLOCKED — depends on TM One credentials + multi-day snapshot data
