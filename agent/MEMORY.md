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
- **Snapshot UPSERT is write-once**: `campaign_snapshots` uses ON CONFLICT DO NOTHING — first sync of the day creates the snapshot, subsequent syncs only update `meta_campaigns`. Each daily snapshot reflects the 06:00 UTC (midnight CST) state. Good for consistency (same time daily), but live campaign data may differ from snapshot data within the same day.
- **Meta intraday reporting lag**: Within-day spend deltas from Meta API are unreliable for real-time monitoring. On Feb 23, ACTIVE campaigns showed <3% of expected daily delivery after 12 hours ($0.22-$1.35 on $100/day budgets). This is normal Meta reporting lag — true daily spend finalizes 24-48h after the day ends. Use daily snapshots (midnight-to-midnight) for trend analysis, not intraday deltas.

## Data Pipeline Status (verified 2026-02-23, Cycle #23)
- `daily_budget` ✅ populated for all 17 campaigns in Supabase
- `start_time` ✅ populated for all 17 campaigns in Supabase
- `campaign_snapshots` ✅ 2 snapshot dates: Feb 19 (13 campaigns) + Feb 23 (17 campaigns). Feb 20-22 gap (scheduler downtime, unrecoverable). ROAS trend needs 1+ more consecutive day.
- `event_snapshots` table exists but still EMPTY — TM One scraper captures 25 events, but ingest pipeline for event snapshots not yet wired.
- **Meta syncs:** ✅ **WORKING** — scheduler cron fires at 00/06/12/18 UTC. Confirmed by snapshot `created_at` of 06:04 UTC matching the 06:00 cron slot. Jaime also ran manual sync at 12:04 UTC. **Note:** cron-triggered runs do NOT create `agent_jobs` entries — only the job poller (dashboard-triggered) does. To verify cron ran, check `campaign_snapshots.created_at` or session file mtime.
- **TM One events:** ✅ `last-events.json` populated (25 events, scraped Feb 23 14:04 UTC). Events include 20 Arjona tour dates + 4 Camila + 1 Alofoke. Missing: ticket counts, sell-through %, pricing (per-event API returns empty data). TM cron fires at even hours UTC.
- **Pacing checks (P4):** ✅ RESUMED — fresh data available. New campaigns (Alofoke, Camila) slightly underpacing (64-68%) — normal for 4-day-old ramp-up.
- **ROAS trend checks (P4):** BLOCKED — need 3+ consecutive days of snapshots. Have Feb 19 + Feb 23 (2 dates, 4-day gap). Next snapshot expected Feb 24 at 06:00 UTC.

## Known Issues (tracked, ranked by impact — updated Cycle #27)
1. 🟡 **KYBBA ROAS declining — marginal ROAS 0.61×** — Blended: 2.73× (Feb 19) → 2.46× (Feb 23). Still above 2.0 threshold. BUT marginal ROAS on new $300 spend is only 0.61× (losing money on incremental dollars). Updated projection (Cycle #30): blended crosses 2.0 ~Mar 3 (was ~Feb 28). Show date Mar 22. Needs consecutive daily snapshots to confirm. **WATCH CLOSELY.**
2. 🟡 **PAUSED campaigns don't get status updated in Supabase** — Sync only pushes ACTIVE campaign data. When Jaime pauses a campaign in Meta, Supabase `status` stays "ACTIVE" and `updated_at` stops advancing. Session cache is authoritative for current status. Example: Arjona Sac V2 paused ~18:00 UTC Feb 23 but Supabase still shows ACTIVE. Code fix needed (ingest should update status for all synced campaigns).
3. 🟡 **Campaign snapshots gap Feb 20-22** — 3 days of ROAS history lost (unrecoverable). ROAS trend needs 1+ more consecutive day. Feb 19 + Feb 23 exist but aren't consecutive. Feb 24 snapshot expected automatically at 06:00 UTC.
4. 🟡 **TM One per-event data incomplete** — Scraper v3 captures 25 events via GraphQL. Per-event API returns empty data (percentSold, ticketsSold null). Sacramento Arjona event missing from GraphQL.
5. 🟡 **Cron-triggered runs are invisible in agent_jobs** — scheduler cron calls `runClaude()` directly without agent_jobs entries. To verify cron health, check `campaign_snapshots.created_at` or session file mtimes.
6. 🟢 **`/api/health` returns 404** — endpoint doesn't exist on Railway server. Not critical.
- ✅ **RESOLVED: Scheduler not auto-firing Meta syncs** — MISDIAGNOSIS corrected Cycle #23. The cron WAS firing all along — snapshot `created_at` of 06:04 UTC matches 06:00 cron slot. We only checked `agent_jobs` which doesn't track cron runs.
- ✅ **RESOLVED: `/api/alerts` Clerk auth bug** — Fixed as of Cycle #18 (Feb 22). Returns 401 (correct, wrong secret), no Clerk 307 regression.
- ✅ **RESOLVED: Campaign data staleness** — Auto-sync + manual sync both working. Session cache refreshed regularly.
- ✅ **RESOLVED: Scheduler down** — Restarted Feb 22 ~19:12 CST. Heartbeats + crons alive.

## Current Campaign Landscape (as of 2026-02-23 18:02 UTC)
- **17 total campaigns** in Supabase (4 ACTIVE, 13 PAUSED). Session cache has 16 (Beamina V3 excluded — no last-30d spend).
- **ACTIVE:** Alofoke (Zamora) — ROAS 3.66×, $272 spend, $100/day budget. Started Feb 19. Boston show Mar 2 (7 days out).
- **ACTIVE:** Camila Anaheim (Zamora) — ROAS 3.41×, $269 spend, $100/day budget. Started Feb 19. Show Mar 13-14.
- **ACTIVE:** Camila Sacramento (Zamora) — ROAS 3.65×, $255 spend, $100/day budget. Started Feb 19. Show Mar 14-15.
- **ACTIVE:** KYBBA Miami — ROAS 2.46×, $2,369 spend, $100/day budget. Show date 03/22 (~27 days out). Above 2.0 but declining (was 2.73×). Marginal ROAS 0.61×.
- **NEWLY PAUSED:** Arjona Sacramento V2 — ROAS 8.91×, $339 spend, $100/day. **Was ACTIVE → PAUSED between 12:04-18:02 UTC Feb 23.** Jaime paused intentionally. (Note: Supabase status still shows ACTIVE due to pipeline gap — see Known Issue #2.)
- **PAUSED (notable):** Denver V2 — ROAS 9.82×, $2,240, $750/day. Denver show was Feb 18 (past).
- **PAUSED:** Denver Retargeting, Seattle V2, Portland V2, All Boston campaigns (4), Camila Dallas, Happy Paws, Beamina V3.
- **⚠️ Seattle & Portland shows imminent (Feb 25-26) but campaigns PAUSED** — likely intentional.
- **Clients represented:** Zamora (13 campaigns), KYBBA (1), Beamina (1), Happy Paws (1). Zamora includes Camila + Alofoke sub-brands.
- **TM One status:** ✅ Scraper v3 WORKING — 25 events captured. Per-event ticket metrics still returning empty.

## Upcoming Shows (from last-events.json, scraped Feb 23 14:04 UTC)
- **IMMINENT:** Seattle Feb 25 (2 days! Campaign PAUSED), Portland Feb 26 (3 days! Campaign PAUSED), Inglewood Mar 1
- **Next week:** Alofoke Boston Mar 2 (Campaign ACTIVE), San Jose Mar 6, San Diego Mar 7 (Camila), Phoenix Mar 8 (Camila), Salt Lake City Mar 9
- **Mid-March:** Palm Desert Mar 12, Anaheim Mar 14 (Camila, Campaign ACTIVE) + Mar 16 (Arjona), Sacramento Mar 15 (Camila, Campaign ACTIVE) + SF Mar 15 (Arjona), Glendale Mar 21
- **Late March+:** San Antonio Mar 26, Austin Mar 30, Miami Apr 3-8 (5 shows), Nashville Apr 11, Atlanta Apr 12, DC Apr 14, Reading Apr 17
- **Artists:** 20 Arjona dates, 4 Camila dates, 1 Alofoke (Boston Mar 2)
- **Campaign-Event alignment:** Alofoke→Boston ✓, Camila Anaheim→Anaheim ✓, Camila Sacramento→Sacramento ✓, Arjona Sacramento V2→(no TM event, known missing from GraphQL), KYBBA Miami→(not in TM One, different promoter)
- **Note:** Denver V2 campaign now PAUSED — Denver show was Feb 18 (past)

## Ad Delivery Error — 191x100 Deprecated Crop Key (error_code 2490085)
- Meta deprecated the `191x100` image crop key. Ads using it silently fail with `effective_status=WITH_ISSUES`.
- Detection: `GET /{AD_ID}?fields=issues_info` — look for error_code 2490085
- Fix: rebuild creative WITHOUT the crop entry, create new ad, pause old. See command.txt "Ad Delivery Error Fixing" section.
- Critical: do NOT reuse old adlabel names when creating new creative — use fresh unique names
- Critical: Meta rejects two image entries with the same hash (even with different crops) — drop the duplicate, don't strip the crop

**Affected ads fixed 2026-02-23:**
- Sacramento asset 2: old 120242300765070525 (PAUSED) → new 120242461398060525 (ACTIVE)
- Anaheim-2 asset 2: old 120242300765070525 (PAUSED) → new 120242461665940525 (ACTIVE)
- Anaheim original asset 1: old 120242223986000525 (PAUSED) → new 120242461670630525 (ACTIVE)

## Things To Remember
- TM One credentials in .env (TM_EMAIL, TM_PASSWORD) — ✅ **configured** as of Feb 22 (jaime@outletmedia.net)
- Meta credentials are in the app's ../.env.local — agent reads them from the parent directory
- Agent working directory is /Users/jaimeortiz/outlet-media-app/agent — all paths relative to here
- INGEST_URL should point to Railway (or localhost:3000 for dev)
- LEARNINGS.md is the think-loop journal — read it first every cycle
- session/ directory holds last-events.json (25 TM One events, first populated Feb 22) and last-campaigns.json (inter-run cache)
- session/proposals.md has 6 ranked capability proposals (overhauled Cycle #28, tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min. All cron-based (fixed UTC times, NOT intervals-from-start). Meta fires at 00:00/06:00/12:00/18:00 UTC. TM fires at even hours UTC.
- **Claude CLI:** v2.1.50 at `/Users/jaimeortiz/.local/bin/claude` (upgraded from v2.1.47 between Cycles #17-22)

## Proposals Status (from session/proposals.md, updated Cycle #34)
**Completed (original proposals):** Fix campaigns page ✅, Client slug validation ✅, Daily pacing alerts ✅, Historical snapshots ✅
**Active proposals (ranked by priority):**
- **G (Ad health scan):** ⏳ NEW — Scan ACTIVE ads for `effective_status=WITH_ISSUES` after each sync. Very small effort. Prevents silent budget waste (proven need: 3 ads blocked Feb 23).
- **D (PAUSED status sync fix):** ⏳ Ready — 1-2 line code change to ingest. Fixes Known Issue #2.
- **A (Campaign-event auto-linking):** ⏳ UNBLOCKED — Both TM (25 events) and Meta (17 campaigns) data live. Highest strategic value.
- **C (Marginal ROAS in dashboard):** ⏳ Ready — Needs 2+ snapshots per campaign. KYBBA has them, new campaigns need Feb 24+.
- **B (Show countdown dashboard):** ⏳ Ready — Best with Proposal A for campaign cross-reference.
- **H (Post-show reports):** ⏳ NEW — Auto-generate show summaries after show date passes. Needs Proposal A.
- **E (Creative-level data):** ⏳ Future — Ad-level Meta API, new table.
- **F (Budget recommendations):** ⏳ Future — AI-powered action proposals.
