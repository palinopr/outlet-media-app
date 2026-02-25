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
- **Meta Business Manager**: 229314527708647 (Outlet Media LLC)
  - 7 people in the portfolio (Jaime, Alexandra, Isabel Leal, Antonella, Cinzia, sofia, EL JD)
  - **User lookup: use `act_{ID}/assigned_users?business=229314527708647` — NOT `/business_users`** (the old endpoint only returns ~2 of 7 users)
  - Isabel Leal's Business User ID: 122193619442532833
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
- **Video uploads**: Use `act_787610255314938/advideos` with `-F "source=@\"$FILE_PATH\""` (escaped quotes required). Commas in filenames cause curl exit code 26 without the quotes. Always verify video status is `ready` before using in ads.
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
- **Snapshot UPSERT is write-once**: `campaign_snapshots` uses ON CONFLICT DO NOTHING — first sync of the day (by UTC date) creates the snapshot, subsequent syncs only update `meta_campaigns`. First sync fires at 00:00 UTC (6 PM CST previous day), so snapshots capture late-afternoon CST data. Good for consistency (same time daily), but live campaign data may differ from snapshot data within the same day.
- **Meta intraday reporting lag**: Within-day spend deltas from Meta API are unreliable for real-time monitoring. On Feb 23, ACTIVE campaigns showed <3% of expected daily delivery after 12 hours ($0.22-$1.35 on $100/day budgets). This is normal Meta reporting lag — true daily spend finalizes 24-48h after the day ends. Use daily snapshots (midnight-to-midnight) for trend analysis, not intraday deltas.

## Data Pipeline Status (verified 2026-02-25, Cycle #51)
- `daily_budget` ✅ populated for all 18 campaigns in Supabase
- `start_time` ✅ populated for all 18 campaigns in Supabase
- `campaign_snapshots` ✅ 4 snapshot dates: Feb 19 (13), Feb 23 (17), Feb 24 (15), Feb 25 (5 ACTIVE only). Feb 20-22 gap (unrecoverable). **Caveat: consecutive-day marginal ROAS unreliable** — need 2+ day gaps. **Live vs snapshot divergence:** use live for current picture, snapshots for trends.
- `event_snapshots` ✅ **NOW POPULATED** — 72 rows across 3 dates (Feb 23, 24, 25), 24 events per date. Has `tickets_sold` (int), `tickets_available` (null), `gross` (null). Pipeline working since ~Feb 23.
- **Meta syncs:** ✅ **WORKING** — scheduler cron fires at 00/06/12/18 UTC. Confirmed by snapshot `created_at` patterns. **Note:** cron-triggered runs do NOT create `agent_jobs` entries — only the job poller (dashboard-triggered) does. To verify cron ran, check `campaign_snapshots.created_at` or session file mtime.
- **TM One events:** ✅ `last-events.json` populated (25 events, last scraped Feb 24 18:02 CST). Events include 20 Arjona tour dates + 4 Camila + 1 Alofoke. Missing: ticket counts, sell-through %, pricing (per-event API returns empty data). TM cron fires at even hours UTC.
- **Pacing checks (P4):** ✅ Running — Zamora campaigns pacing at 72-76% (normal ramp-up for 5-day-old campaigns). Houston excluded (no spend).
- **ROAS trend checks (P4):** ✅ WORKING — 4 snapshot dates available (Feb 19, 23, 24, 25). Feb 19→25 gap (6 days) is reliable for marginal ROAS. KYBBA marginal improved from 0.61× to 0.95×. Zamora campaigns all healthy marginals (4.8-23×).

## Known Issues (tracked, ranked by impact — updated Cycle #49)
1. 🔴 **Houston $400/day $0 spend** — Campaign "Zamora - Camila - Houston" (120242223711720525) is ACTIVE with $400/day budget but $0 spend since detection (Cycle #47, Feb 25 ~00:30 UTC). Start_time Feb 19 (was likely PAUSED until recently). Feb 25 snapshot confirms $0. Possible delivery issue or Meta ramp-up delay. **Next checkpoint:** 06:00 UTC Feb 25 sync — if still $0, likely a delivery problem (check adset/ad effective_status). **No Houston event in TM One.**
2. 🟡 **KYBBA ROAS declining — marginal ROAS 0.95×** — Blended: 2.73× (Feb 19) → 2.47× (Feb 25 snapshot). Still above 2.0. Marginal improved from 0.61× (Feb 19→24) to **0.95×** (Feb 19→25). Feb 24→25 single-day marginal was 2.84× (pre-swap, KYBBA's best day: 5 purchases). **Budget: $50/day**. Projection: blended crosses 2.0 ~**Mar 18**. Show Mar 22 — 4 days buffer. **Post-swap evaluation:** Feb 25 snapshot = pre-swap baseline. First post-swap snapshot = Feb 26. First reliable marginal analysis = Feb 28.
3. 🟡 **Campaign snapshots gap Feb 20-22** — 3 days of ROAS history lost (unrecoverable). Now 4 snapshot dates (Feb 19, 23, 24, 25). Feb 19→25 (6-day gap) is reliable for marginal ROAS.
4. 🟡 **TM One per-event data incomplete** — Scraper v3 captures 25 events via GraphQL. Per-event API returns empty data (percentSold, ticketsSold null). Sacramento Arjona event missing from GraphQL.
5. 🟡 **Cron-triggered runs are invisible in agent_jobs** — scheduler cron calls `runClaude()` directly without agent_jobs entries. To verify cron health, check `campaign_snapshots.created_at` or session file mtimes.
6. 🟢 **`/api/health` returns 404** — endpoint doesn't exist on Railway server. Not critical.
- ✅ **RESOLVED: PAUSED campaigns status sync** — Sync pushes ALL campaigns. PAUSED shows correctly.
- ✅ **RESOLVED: Scheduler not auto-firing Meta syncs** — Cron was firing all along.
- ✅ **RESOLVED: `/api/alerts` Clerk auth bug** — Fixed Feb 22. Returns 401 (correct).
- ✅ **RESOLVED: Campaign data staleness** — Auto-sync + manual sync both working.
- ✅ **RESOLVED: Scheduler down** — Restarted Feb 22. Heartbeats + crons alive.

## Current Campaign Landscape (as of 2026-02-25 01:30 UTC, verified Cycle #49)
- **18 total campaigns** in Supabase (5 ACTIVE, 13 PAUSED). Session cache has 5 (ACTIVE only).
- **⚠️ NEW: Camila Houston** (Zamora) — ACTIVE, **$400/day budget** (highest in portfolio), **$0 spend**. Started Feb 19. **No Houston event in TM One.** Likely just activated from PAUSED — monitor for delivery.
- **ACTIVE:** Alofoke (Zamora) — **ROAS 8.72×**, $365 spend, 6 purchases, **$250/day budget** (bumped from $100, Feb 24 ~19:30 CST). Started Feb 19. Boston show Mar 2 (**5 days out**). Budget strategy: $250/day × 5 days + $365 ≈ $1,615, under $2K cap. Active adsets (6, CBO): De la Ghetto (51×), Chaval (13.8×), Shadow (12.6×), Perversa (12.0×), Eddie Herrera (9.3×), Boston Countdown (reactivated). Marginal ROAS (Feb 23→25): 23.4× (attribution catch-up).
- **ACTIVE:** Camila Anaheim (Zamora) — ROAS 3.81×, $379 spend, 6 purchases, $100/day budget. Started Feb 19. Show Mar 13-14. Marginal ROAS (Feb 23→25): 4.76×. Healthy.
- **ACTIVE:** Camila Sacramento (Zamora) — ROAS 4.42×, $363 spend, 6 purchases, $100/day budget. Started Feb 19. Show Mar 14-15. Marginal ROAS (Feb 23→25): 6.16×. Healthy.
- **ACTIVE:** KYBBA Miami — ROAS 2.47×, $2,423 spend, 54 purchases, **$50/day budget**. Show date 03/22 (~25 days out). Above 2.0 but declining. Marginal ROAS: **0.95×** (Feb 19→25 snapshot, improved from 0.61×). Projection: blended crosses 2.0 ~**Mar 18** at current rate. **Adset swap executed Feb 24:** PAUSED V9+V1, ACTIVATED V5+Asset1. Post-swap evaluation starts Feb 28.
- **PAUSED (notable):** Arjona Sacramento V2 — ROAS 8.91×, $339, $100/day. Paused intentionally by Jaime (Feb 23).
- **PAUSED (notable):** Denver V2 — ROAS 9.82×, $2,240, $750/day. Denver show was Feb 18 (past).
- **PAUSED:** Denver Retargeting, Seattle V2, Portland V2, All Boston campaigns (4), Camila Dallas, Happy Paws, Beamina V3.
- **Seattle (Feb 25, PAST) & Portland (Feb 26, IMMINENT) shows with campaigns PAUSED** — likely intentional.
- **Clients represented:** Zamora (14 campaigns), KYBBA (1), Beamina (1), Happy Paws (1). Zamora includes Camila + Alofoke sub-brands.
- **Snapshot dates:** 4 total: Feb 19 (13), Feb 23 (17), Feb 24 (15), Feb 25 (5 ACTIVE). Houston only on Feb 25 ($0).

## Upcoming Shows (from last-events.json, scraped Feb 24 18:02 CST)
- **PAST:** Seattle Feb 25 (Campaign was PAUSED), Denver Feb 18 (Campaign PAUSED)
- **IMMINENT:** Portland Feb 26 (TODAY/TOMORROW! Campaign PAUSED), Inglewood Mar 1
- **This week:** Alofoke Boston Mar 2 (Campaign ACTIVE, **$250/day, scaling — 5 days out**), San Jose Mar 6, San Diego Mar 7 (Camila), Phoenix Mar 8 (Camila), Salt Lake City Mar 9
- **Mid-March:** Palm Desert Mar 12, Anaheim Mar 14 (Camila, Campaign ACTIVE) + Mar 16 (Arjona), Sacramento Mar 15 (Camila, Campaign ACTIVE) + SF Mar 15 (Arjona), Glendale Mar 21
- **Late March+:** San Antonio Mar 26, Austin Mar 30, Miami Apr 3-8 (5 shows), Nashville Apr 11, Atlanta Apr 12, DC Apr 14, Reading Apr 17
- **Artists:** 20 Arjona dates, 4 Camila dates, 1 Alofoke (Boston Mar 2)
- **Campaign-Event alignment:** Alofoke→Boston ✓, Camila Anaheim→Anaheim ✓, Camila Sacramento→Sacramento ✓, Camila Houston→(no TM event), Arjona Sacramento V2→(no TM event, known missing from GraphQL), KYBBA Miami→(not in TM One, different promoter)

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
- session/proposals.md has 8 ranked capability proposals (overhauled Cycle #28, expanded Cycle #34 with G+H, tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min. All cron-based (fixed UTC times, NOT intervals-from-start). Meta fires at 00:00/06:00/12:00/18:00 UTC. TM fires at even hours UTC.
- **Claude CLI:** v2.1.55 at `/Users/jaimeortiz/.local/bin/claude` (upgraded from v2.1.52 between Cycles #49-51)

## Proposals Status (from session/proposals.md, updated Cycle #49)
**Completed:** Fix campaigns page ✅, Client slug validation ✅, Daily pacing alerts ✅, Historical snapshots ✅, PAUSED status sync ✅
**Active proposals (ranked by priority):**
- **G (Ad health scan):** ⏳ Ready — Scan ACTIVE ads for `effective_status=WITH_ISSUES` after each sync. Very small effort. **Directly relevant to Houston $0 spend diagnosis.**
- **I (Client budget cap monitor):** ⏳ Ready — Track cumulative spend vs client caps (Alofoke $2K). Alert at 80/95/100%. Very small effort.
- **A (Campaign-event auto-linking):** ⏳ UNBLOCKED — Both TM (25 events) and Meta (18 campaigns) data live. Highest strategic value.
- **C (Marginal ROAS in dashboard):** ⏳ Ready — 4 snapshot dates available. KYBBA marginal ROAS already computed in think loop.
- **J (Campaign change journal):** ⏳ Ready — Record changes (adset swaps, budget changes) + auto-evaluate impact. KYBBA swap evaluation starts Feb 28.
- **B (Show countdown dashboard):** ⏳ Ready — Best with Proposal A for campaign cross-reference.
- **H (Post-show reports):** ⏳ Ready — Seattle (Feb 25, past) + Denver (Feb 18, past) = first test cases.
- **E (Creative-level data):** ⏳ Future — Ad-level Meta API, new table.
- **F (Budget recommendations):** ⏳ Future — AI-powered action proposals.
