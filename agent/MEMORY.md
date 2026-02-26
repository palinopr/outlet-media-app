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
- **Session cache vs Supabase alignment**: Both session cache (`daily_budget_cents`) and Supabase (`daily_budget`) are populated for all campaigns as of 2026-02-19. The ingest maps `daily_budget_cents` → `daily_budget`.
- **Snapshot UPSERT is write-once**: `campaign_snapshots` uses ON CONFLICT DO NOTHING — first sync of the day (by UTC date) creates the snapshot, subsequent syncs only update `meta_campaigns`. First sync fires at 00:00 UTC (6 PM CST previous day), so snapshots capture late-afternoon CST data. Good for consistency (same time daily), but live campaign data may differ from snapshot data within the same day.
- **Meta intraday reporting lag**: Within-day spend deltas from Meta API are unreliable for real-time monitoring. On Feb 23, ACTIVE campaigns showed <3% of expected daily delivery after 12 hours ($0.22-$1.35 on $100/day budgets). This is normal Meta reporting lag — true daily spend finalizes 24-48h after the day ends. Use daily snapshots (midnight-to-midnight) for trend analysis, not intraday deltas.

## Data Pipeline Status (verified 2026-02-26, Cycle #56)
- `daily_budget` ✅ populated for all 18 campaigns in Supabase
- `start_time` ✅ populated for all 18 campaigns in Supabase
- `campaign_snapshots` ✅ **5 snapshot dates** (55 rows): Feb 19 (13), Feb 23 (17), Feb 24 (15), Feb 25 (5), Feb 26 (5). Feb 20-22 gap (unrecoverable). **Caveat: consecutive-day marginal ROAS unreliable** — need 2+ day gaps. **Live vs snapshot divergence:** use live for current picture, snapshots for trends.
- `event_snapshots` ⚠️ **POPULATED BUT STATIC** — rows across 3+ dates, 24 events per date. ALL ticket values identical across dates — zero deltas. **Velocity tracking impossible until TM One per-event API returns live data.**
- **Meta syncs:** ✅ **WORKING** — scheduler cron fires at 00/06/12/18 UTC. **Note:** cron-triggered runs do NOT create `agent_jobs` entries. To verify cron ran, check `campaign_snapshots.created_at` or session file mtime.
- **TM One events:** ✅ 25 events via GraphQL. Missing: ticket counts, sell-through %, pricing (per-event API returns empty data). TM cron fires at even hours UTC.
- **Pacing checks (P4):** ✅ Running — Zamora campaigns pacing at 72-77% (normal ramp-up). Houston excluded (0 ROAS).
- **ROAS trend checks (P4):** ✅ WORKING — 5 snapshot dates available. Feb 19→26 gap (7 days) is the most reliable for marginal ROAS. KYBBA long-term marginal 0.86× (stable). Zamora campaigns all healthy marginals (2.7-23×).

## Known Issues (tracked, ranked by impact — updated Cycle #56)
1. 🔴 **Houston $242+ spent, ZERO purchases, BUDGET ESCALATED to $1,500/day** — Campaign "Zamora - Camila - Houston" (120242223711720525). Was $400/day when detected (Cycle #47), now **$1,500/day** (150000 cents). $242.84 spent, 0.00× ROAS, 42K impressions, 1,211 clicks (CTR 2.84%). Problem is conversion not delivery. **At $1,500/day, could burn $10,500/week with zero return.** No Houston event in TM One. Critical alert posted Feb 25. Jaime is aware (Discord boss channel 23:46 UTC Feb 25).
2. 🟡 **KYBBA ROAS declining — long-term marginal 0.86×, recent marginal 1.67×** — Blended: 2.73× (Feb 19) → 2.43× (Feb 26 snapshot). Long-term marginal (Feb 19→26, 7-day): **0.86×** (unchanged). Recent marginal (Feb 23→26, 3-day): **1.67×** — possible adset swap effect. Budget: $100/day. Projection: crosses 2.0 ~**Mar 7** (conservative 0.86×) or stays above 2.0 through show (optimistic 1.67×). Show Mar 22. **Post-swap evaluation: first reliable marginal Feb 28** (need 2+ day gap from Feb 26 first post-swap snapshot).
3. 🟡 **Campaign snapshots gap Feb 20-22** — 3 days of ROAS history lost (unrecoverable). Now 5 snapshot dates (Feb 19, 23, 24, 25, 26).
4. 🟡 **TM One per-event data incomplete** — 25 events via GraphQL, per-event API returns empty. Sacramento Arjona missing from GraphQL.
5. 🟡 **Cron-triggered runs invisible in agent_jobs** — verify cron health via `campaign_snapshots.created_at` or session file mtimes.
6. 🟢 **`/api/health` returns 404** — not critical.
- ✅ RESOLVED: PAUSED status sync, Scheduler auto-firing, `/api/alerts` Clerk bug, Campaign staleness, Scheduler down

## Current Campaign Landscape (as of 2026-02-26 01:00 UTC, verified Cycle #56)
- **18 total campaigns** in Supabase (5 ACTIVE, 13 PAUSED). `last-campaigns.json` back in session/ (mtime Feb 25 18:01 CST). Supabase is authoritative.
- **🔴 Camila Houston** (Zamora) — ACTIVE, **$1,500/day budget** (was $400, increased 3.75×), **$242.84 spent, 0.00× ROAS** (0 purchases). 42K impressions, 1,211 clicks (CTR 2.84%). Conversion problem. **No Houston event in TM One.** Critical alert posted. Jaime aware via Discord.
- **ACTIVE:** Alofoke (Zamora) — **ROAS 8.52×**, $551 spend, **$250/day budget**. Started Feb 19. Boston show Mar 2 (**4 days out**). Exceptional.
- **ACTIVE:** Camila Anaheim (Zamora) — ROAS 3.11×, $464 spend, $100/day budget. Started Feb 19. Show Mar 13-14. Healthy.
- **ACTIVE:** Camila Sacramento (Zamora) — ROAS 4.85×, $453 spend, $100/day budget. Started Feb 19. Show Mar 14-15. Improving trend.
- **ACTIVE:** KYBBA Miami — ROAS 2.43×, $2,461 spend, **$100/day budget**. Show 03/22 (~24 days). Marginal: **0.86×** (Feb 19→26, 7-day) / **1.67×** (Feb 23→26, 3-day — possible swap effect). Projection: crosses 2.0 ~Mar 7 (conservative) or stays above (optimistic). **Post-swap evaluation Feb 28.**
- **PAUSED (notable):** Arjona Sac V2 (8.91×), Denver V2 (9.82×, show past), Seattle V2 (10.63×, show past), Portland V2 (9.21×, show past).
- **PAUSED:** Denver Retargeting, Boston campaigns (4), Camila Dallas, Happy Paws, Beamina V3.
- **Shows past:** Seattle (Feb 25), Portland (Feb 26), Denver (Feb 18). All campaigns PAUSED — intentional.
- **Clients:** Zamora (14 campaigns), KYBBA (1), Beamina (1), Happy Paws (1).
- **Snapshot dates:** 5 total (55 rows): Feb 19 (13), Feb 23 (17), Feb 24 (15), Feb 25 (5), Feb 26 (5).

## Upcoming Shows (from TM One GraphQL, 25 events)
- **PAST:** Denver Feb 18, Seattle Feb 25, Portland Feb 26. All campaigns PAUSED — intentional.
- **This week:** Inglewood Mar 1, Alofoke Boston Mar 2 (Campaign ACTIVE, **$250/day — 4 days out**)
- **Next week:** San Jose Mar 6, San Diego Mar 7 (Camila), Phoenix Mar 8 (Camila), Salt Lake City Mar 9
- **Mid-March:** Palm Desert Mar 12, Anaheim Mar 14 (Camila, Campaign ACTIVE) + Mar 16 (Arjona), Sacramento Mar 15 (Camila, Campaign ACTIVE) + SF Mar 15, Glendale Mar 21
- **Late March+:** KYBBA Miami Mar 22, San Antonio Mar 26, Austin Mar 30, Miami Apr 3-8 (5 shows), Nashville Apr 11, Atlanta Apr 12, DC Apr 14, Reading Apr 17
- **Artists:** 20 Arjona dates, 4 Camila dates, 1 Alofoke (Boston Mar 2)
- **Campaign-Event alignment:** Alofoke→Boston ✓, Camila Anaheim→Anaheim ✓, Camila Sacramento→Sacramento ✓, Camila Houston→(no TM event), KYBBA Miami→(not in TM One, different promoter)

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
- session/ directory holds: `last-campaigns.json` (inter-run cache, restored post-restructuring), `activity-log.json` (Discord cross-channel coordination for Boss agent). `last-events.json` no longer generated post-restructuring (TM data via Supabase directly).
- session/proposals.md has 9 ranked capability proposals (G-I active, tracked in Proposals Status section below)
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
