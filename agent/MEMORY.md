# Outlet Media Agent — Shared Memory

## Who Is Jaime
- Jaime Ortiz, founder of Outlet Media
- Manages Meta ad campaigns for music promoters via Outlet Media
- Communicates via Telegram (@Outletmedia_bot), Discord (#boss channel), and the Outlet Media web dashboard
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

- **Zamora** (slug: "zamora") — music promoter, campaign name contains "arjona", "camila", or "alofoke" (case-insensitive)
  - Tours sold through Ticketmaster One (one.ticketmaster.com)
  - Client portal: /client/zamora
  - Sub-brands: Ricardo Arjona (tour), Camila (tour), Alofoke (one-off shows)
- **KYBBA** (slug: "kybba") — separate music promoter, not a Zamora sub-campaign
- **Sienna** (slug: "sienna") — new client as of Feb 27. Campaign: "Sienna - Peace In Mind"
- **Vaz Vil** (slug: TBD) — new client as of Mar 3. Campaign: "Vaz Vil - Kiko Blade - penetrado tour"
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
  - `agent_alerts` — proactive alerts (level: info/warn/error — Zod-validated, read_at for dismissal)
- **Meta API**: Graph API v21.0, ad account act_787610255314938
  - Pixel ID: 879345548404130
  - Page ID: 175118299508364
  - Instagram ID: 17841402356610735
- **Video uploads**: Use `act_787610255314938/advideos` with `-F "source=@\"$FILE_PATH\""` (escaped quotes required). Commas in filenames cause curl exit code 26 without the quotes. Always verify video status is `ready` before using in ads.
- **Ingest endpoint**: POST /api/ingest with secret header (`x-ingest-secret` or body `secret`)
- **Alerts endpoint**: POST /api/alerts `{ secret, message, level }` to create an alert visible in dashboard (no client_slug field)
- **Local agent**: runs on Jaime's Mac, polls Supabase for jobs, pushes data via ingest
- **Discord bot**: Multi-agent architecture (as of Feb 25 2026). Boss orchestrator routes to specialized agents via Discord channels.
  - Agents: boss (orchestrator), media-buyer, client-manager, creative-agent, reporting-agent, tm-agent, discord-agent
  - Activity logged to `session/activity-log.json`
- **Telegram bot**: @Outletmedia_bot (token in .env)
- **Dashboard app**: Railway (formerly localhost:3000 for dev)
- **Prompt files (10 total):** `prompts/boss.txt`, `prompts/media-buyer.txt`, `prompts/client-manager.txt`, `prompts/creative-agent.txt`, `prompts/reporting-agent.txt`, `prompts/tm-agent.txt`, `prompts/discord-agent.txt`, `prompts/command.txt`, `prompts/chat.txt`, `prompts/think.txt`

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
- **Supabase column is `daily_budget`** (NOT `daily_budget_cents`) — value is in cents. Session cache uses `daily_budget_cents`, Supabase uses `daily_budget`. The ingest maps `daily_budget_cents` → `daily_budget`.
- **Snapshot UPSERT is write-once**: `campaign_snapshots` uses ON CONFLICT DO NOTHING — first sync of the day (by UTC date) creates the snapshot, subsequent syncs only update `meta_campaigns`. First sync fires at 00:00 UTC (6 PM CST previous day), so snapshots capture late-afternoon CST data. Good for consistency (same time daily), but live campaign data may differ from snapshot data within the same day.
- **Meta intraday reporting lag**: Within-day spend deltas from Meta API are unreliable for real-time monitoring. On Feb 23, ACTIVE campaigns showed <3% of expected daily delivery after 12 hours ($0.22-$1.35 on $100/day budgets). This is normal Meta reporting lag — true daily spend finalizes 24-48h after the day ends. Use daily snapshots (midnight-to-midnight) for trend analysis, not intraday deltas.

## Data Pipeline Status (verified 2026-03-05, Cycle #73)
- `daily_budget` ✅ populated for all 25 campaigns in Supabase
- `start_time` ✅ populated for all 25 campaigns in Supabase
- `campaign_snapshots` ✅ **RESUMED** — Mar 5 snapshot arrived (10 rows). 6 dates total (65 rows): Feb 19, 23, 24, 25, 26, Mar 5. Gap Feb 27-Mar 4 is permanent (not backfillable).
- `event_snapshots` ⚠️ **POPULATED BUT STATIC** — ticket values identical across dates. Velocity tracking impossible until TM One per-event API returns live data.
- **Meta syncs:** ✅ **RESUMED** — meta_campaigns updated with fresh data (25 campaigns, 10 ACTIVE). Snapshot pipeline working again.
- **TM One events:** Jaime actively developing TM1 scraper. session/ has login flow scripts + screenshots.
- **Pacing checks (P4):** ✅ Can run again with fresh data.
- **ROAS trend checks (P4):** ✅ Can run (Feb 26 → Mar 5 = 7-day gap, good reliability).

## Known Issues (tracked, ranked by impact — updated Cycle #73, Mar 5)
1. 🔴 **San Diego 1.13x ROAS, $300/day budget** — Losing money ($702 spent). Show Mar 7 (2 days!).
2. 🔴 **Phoenix 1.88x ROAS, $300/day budget** — **Dropped below 2.0** ($806 spent). Show Mar 8 (3 days!).
3. 🔴 **Sienna 0x ROAS, $200/day** — $493 spent, 0 purchases. Possible pixel issue. 6+ days in.
4. 🟡 **Palm Desert 0.40x ROAS** — $50/day, low budget. Show Mar 12.
5. 🟡 **Campaign snapshots gap Feb 20-22 + Feb 27-Mar 4** — Two permanent gaps in historical data.
6. 🟡 **TM One per-event data incomplete** — Jaime actively working on TM1 scraper.
7. 🟢 **SF 3.46x ROAS** — Resolved, was 0x, now healthy.
8. 🟢 **`/api/health` returns 404** — not critical.
- ✅ RESOLVED: Meta sync stale (resumed Mar 5), Houston (PAUSED), Alofoke (PAUSED, show past), KYBBA declining (recovered to 4.67x marginal), PAUSED status sync, Scheduler auto-firing, `/api/alerts` Clerk bug, Scheduler down

## Current Campaign Landscape (as of 2026-03-05, verified Cycle #73)
- **25 total campaigns** in Supabase (10 ACTIVE, 15 PAUSED). Supabase is authoritative.
- **Data freshness:** Mar 5 snapshot + live meta_campaigns data. Snapshots resumed after 7-day gap.

### ACTIVE Campaigns (10)
**Zamora — Continuing:**
- KYBBA Miami — $2,709 spend, 2.68x ROAS, $100/day. Show Mar 22. **Marginal 4.67x (Feb 26→Mar 5) — crisis averted, adset swap worked.**
- Camila Anaheim — $1,252 spend, 4.12x ROAS, $100/day. Show Mar 14.
- Camila Sacramento — $1,257 spend, 4.81x ROAS, $100/day. Show Mar 15.

**Zamora — New Camila cities (high budget):**
- 🔴 Camila San Diego — $702 spend, **1.13x ROAS**, $300/day. Show Mar 7 (2 days!). Still losing money.
- 🔴 Camila Phoenix — $806 spend, **1.88x ROAS**, $300/day. Show Mar 8. **Dropped below 2.0!**

**Zamora — New Arjona cities (low budget):**
- Arjona Salt Lake City — $173 spend, **20.29x ROAS**, $100/day. Show Mar 9. Exceptional.
- Arjona Palm Desert — $190 spend, 0.40x ROAS, $50/day. Show Mar 12. Improving but still poor.
- Arjona San Francisco — $194 spend, **3.46x ROAS**, $50/day. Show Mar 15. Now delivering well.

**New Clients:**
- 🔴 Sienna - Peace In Mind — $493 spend, 0x ROAS, $200/day. Started Feb 27. 0 purchases after 6+ days.
- Vaz Vil - Kiko Blade — $52 spend, 0x ROAS, $50/day. Started Mar 3. Still early.

### PAUSED Campaigns (15)
- Houston (Zamora) — $243 spend, 0x ROAS. Was critical, now paused. Good call.
- Alofoke (Zamora) — $552 spend, 8.52x ROAS. Boston show Mar 2 past. Correctly paused.
- Arjona Boston (4 campaigns) — $455K combined, shows past.
- Arjona Denver V2 — $2,240, 9.82x. Show past.
- Arjona Sacramento V2, Seattle V2, Portland V2 — all high ROAS, shows past.
- Camila Dallas — $0.30, killed early.
- Denver Retargeting, Happy Paws, Beamina V3.

### Clients Summary
- **Zamora:** 21 campaigns (8 ACTIVE, 13 PAUSED)
- **KYBBA:** 1 campaign (ACTIVE)
- **Sienna:** 1 campaign (ACTIVE) — NEW
- **Vaz Vil:** 1 campaign (ACTIVE) — NEW
- **Beamina:** 1 campaign (PAUSED)
- **Happy Paws:** 1 campaign (PAUSED)

### Snapshot Dates
6 dates (65 rows): Feb 19 (13), Feb 23 (17), Feb 24 (15), Feb 25 (5), Feb 26 (5), Mar 5 (10). Gap Feb 27-Mar 4 permanent.

## Upcoming Shows (from TM One GraphQL, 25 events — updated Mar 5)
- **PAST:** Denver Feb 18, Seattle Feb 25, Portland Feb 26, Inglewood Mar 1, Boston Mar 2 (Alofoke paused ✅)
- **This week (IMMINENT):** San Jose Mar 6, **San Diego Mar 7** (Camila, 1.13x!), **Phoenix Mar 8** (Camila, 1.88x!), Salt Lake City Mar 9 (Arjona, 20.29x)
- **Next week:** Palm Desert Mar 12 (Arjona, 0x), **Anaheim Mar 14** (Camila, 4.40x ✅), **Sacramento Mar 15** (Camila, 4.72x ✅), SF Mar 15 (Arjona, 0x), Arjona Mar 16
- **Late March:** Glendale Mar 21, **KYBBA Miami Mar 22** (2.65x, 17 days), San Antonio Mar 26, Austin Mar 30
- **April:** Miami Apr 3-8 (5 shows), Nashville Apr 11, Atlanta Apr 12, DC Apr 14, Reading Apr 17
- **Campaign-Event alignment:** Camila SD→San Diego ✓, Camila Phoenix→Phoenix ✓, Camila Anaheim→Anaheim ✓, Camila Sacramento→Sacramento ✓, Arjona SLC→Salt Lake ✓, Arjona Palm Desert→Palm Desert ✓, Arjona SF→SF ✓, KYBBA Miami→(not in TM One)

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
- session/ directory holds: `last-campaigns.json` (inter-run cache, refreshed Mar 4), `activity-log.json` (Discord cross-channel coordination for Boss agent), `last-demographics.json` (TM fan demographics, refreshed Mar 4), `last-events.json` (events with ticket data, refreshed Mar 4). 40+ `tm1-*` debug files (scrapers, screenshots, captured API calls, storage state).
- session/proposals.md has 9 ranked capability proposals (G-I active, tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min. All cron-based (fixed UTC times, NOT intervals-from-start). Meta fires at 00:00/06:00/12:00/18:00 UTC. TM fires at even hours UTC.
- **Claude CLI:** v2.1.69 at `/Users/jaimeortiz/.local/bin/claude` (verified Cycle #68)

## Proposals Status (from session/proposals.md, updated Cycle #62)
**Completed:** Fix campaigns page ✅, Client slug validation ✅, Daily pacing alerts ✅, Historical snapshots ✅, PAUSED status sync ✅
**Active proposals (ranked by priority):**
- **G (Ad health scan):** ⏳ Ready — Scan ACTIVE ads for `effective_status=WITH_ISSUES` after each sync. Relevant to Sienna 0x ROAS diagnosis.
- **I (Client budget cap monitor):** ⏳ Ready — Track cumulative spend vs client caps. Now relevant for new clients Sienna/Vaz Vil.
- **A (Campaign-event auto-linking):** ⏳ UNBLOCKED — Both TM (25 events) and Meta (25 campaigns) data live. Highest strategic value.
- **C (Marginal ROAS in dashboard):** ⏳ Ready — 6 snapshot dates available. Marginal ROAS computed in think loop.
- **J (Campaign change journal):** ⏳ Ready — Record changes + auto-evaluate impact.
- **B (Show countdown dashboard):** ⏳ Ready — Especially urgent with 4 shows this week (Mar 6-9).
- **H (Post-show reports):** ⏳ Ready — Multiple past shows available as test cases.
- **E (Creative-level data):** ⏳ Future — Ad-level Meta API, new table.
- **F (Budget recommendations):** ⏳ Future — AI-powered action proposals.
