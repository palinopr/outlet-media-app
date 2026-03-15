# Outlet Media Agent — Shared Memory

## Who Is Jaime
- Jaime Ortiz, founder of Outlet Media
- Manages Meta ad campaigns for music promoters via Outlet Media
- Communicates via Discord (#boss, #email) and the Outlet Media web dashboard
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
- **Sienna** (slug: "sienna") — new client as of Feb 27. Campaign: "Sienna - Peace In Mind". **Music artist — optimized for ViewContent, NOT conversions/purchases.** 0x ROAS is expected (no purchase pixel).
- **Vaz Vil** (slug: "vaz_vil") — new client as of Mar 3. Campaign: "Vaz Vil - Kiko Blade - penetrado tour"
- **Beamina** (slug: "beamina") — music promoter
- **Happy Paws** (slug: "happy_paws") — client
- **Don Omar BCN** (slug: "don_omar_bcn") — Don Omar concert in Barcelona. Tickets sold through Vivaticket/EATA (entradasatualcance.com), NOT Ticketmaster. Uses `eata_<id>` prefix for tm_id to avoid TM ID collisions.
- Unknown campaigns default to slug: "unknown"

## Infrastructure
- **Meta Business Manager**: 229314527708647 (Outlet Media LLC)
  - 7 people in the portfolio (Jaime, Alexandra, Isabel Leal, Antonella, Cinzia, sofia, EL JD)
  - **User lookup: use `act_{ID}/assigned_users?business=229314527708647` — NOT `/business_users`** (the old endpoint only returns ~2 of 7 users)
  - Isabel Leal's Business User ID: 122193619442532833
- **Supabase**: https://dbznwsnteogovicllean.supabase.co
  - Tables: tm_events, meta_campaigns, campaign_snapshots, event_snapshots, agent_alerts, tm_event_demographics, agent_tasks, agent_runtime_state
  - `campaign_snapshots` — daily ROAS/spend snapshot per campaign (UNIQUE campaign_id + snapshot_date)
    - Columns: id, campaign_id, spend (cents bigint), impressions, clicks, roas, cpm, cpc, ctr, snapshot_date, created_at
    - Note: column is `spend` NOT `spend_cents` — value is in cents despite the name
  - `event_snapshots` — daily ticket sales snapshot per TM event (UNIQUE tm_id + snapshot_date)
    - Columns: id, tm_id, tickets_sold, tickets_available, gross, snapshot_date, created_at
    - Note: column is `tm_id` NOT `event_id`
  - `agent_tasks` — orchestration ledger for dashboard requests, Gmail push work, and delegated agent tasks
    - Columns: id, from_agent, to_agent, action, params, tier, status, result, error, created_at, started_at, completed_at
    - Use `created_at` for ordering. Status flow: `pending` -> `running` -> `completed` or `failed`
  - `agent_runtime_state` — singleton runtime status and watch cursors
    - Keys in use: `heartbeat`, `gmail_watch`
  - `agent_alerts` — proactive alerts (level: info/warning/critical — Zod-validated, "warn"/"error" silently rejected, read_at for dismissal)
- **Meta API**: Graph API v21.0, ad account act_787610255314938
  - Pixel ID (default): 879345548404130
  - Pixel ID (Sienna): 918875103967661 (created Feb 25)
  - Page ID: 175118299508364
  - Instagram ID: 17841402356610735
- **Video uploads**: Use `act_787610255314938/advideos` with `-F "source=@\"$FILE_PATH\""` (escaped quotes required). Commas in filenames cause curl exit code 26 without the quotes. Always verify video status is `ready` before using in ads.
- **Ingest endpoint**: POST /api/ingest with secret header (`x-ingest-secret` or body `secret`)
- **Alerts endpoint**: POST /api/alerts `{ secret, message, level }` to create an alert visible in dashboard (no client_slug field)
- **Local agent**: runs on Jaime's Mac, consumes `agent_tasks`, handles Discord, and keeps runtime/watch state in Supabase
- **Discord bot**: Multi-agent architecture (as of Feb 25 2026). Boss orchestrator routes to specialized agents via Discord channels.
  - Agents: boss (orchestrator), media-buyer, client-manager, creative-agent, reporting-agent, tm-agent, don-omar-agent, email-agent, meeting-agent
  - Activity logged to `session/activity-log.json`
- **Dashboard app**: Railway (formerly localhost:3000 for dev)
- **Prompt files (18 total):** `prompts/boss.txt`, `prompts/media-buyer.txt`, `prompts/client-manager.txt`, `prompts/creative-agent.txt`, `prompts/reporting-agent.txt`, `prompts/tm-agent.txt`, `prompts/don-omar-agent.txt`, `prompts/email-agent.txt`, `prompts/meeting-agent.txt`, `prompts/command.txt`, `prompts/general.txt`, `prompts/think.txt`, `prompts/content-finder.txt`, `prompts/customer-whatsapp-agent.txt`, `prompts/growth-supervisor.txt`, `prompts/lead-qualifier.txt`, `prompts/publisher-tiktok.txt`, `prompts/tiktok-supervisor.txt`

## Campaign Strategy (from Arjona tour learnings)
- CBO (Campaign Budget Optimization) + broad targeting
- 3-Day Rule: every new creative gets 3 days to prove itself, then kill or scale
- Best performing segment: Female 35-44 (historically 9.8x ROAS)
- Facebook > Instagram for purchases
- Retargeting = 5x ROAS typically
- NEVER kill a city/show entirely — find new strategy (new creative, expand radius, retargeting)
- **Post-show auto-pause:** After a show date passes, always verify the campaign is PAUSED with $0 spend. If still ACTIVE or spending, pause it immediately — no confirmation needed. Jaime may pause adsets but the campaign can remain on; always check campaign-level status. **Jaime re-confirmed Mar 9:** "if it's paused and hasn't spent, turn it off automatically always."
- ROAS below 2.0 = flag for review, not automatic kill
- Urgency creatives in the final week before show date

## Email Rules — Venue/Pixel Communications
- **Never say "TM1"** in pixel emails — just say "here's the pixel to incorporate"
- **Always label it "Meta pixel ID"** so the venue knows which pixel type it is
- Template: "Hi [name], here's the Meta pixel ID to incorporate: [ID]"
- Keep it platform-agnostic — the venue knows their system

## Learned Preferences
- Keep owner alerts short and factual
- Surface only meaningful changes (not routine "nothing changed" checks)
- BE PROACTIVE — if data shows an issue, say so without being asked
- When in doubt about campaign data, pull it live — never cite from memory
- MEMORY.md is the source of truth for context that survives between sessions

## Data Storage Conventions
- **Supabase column naming**: campaign name column is `name` (NOT `campaign_name`). `tm_events` name column is also `name` (NOT `event_name`). `tm_events` date column is `date` (NOT `event_date`). Query with `select=campaign_id,name,status,...`
- **tm_events EATA fields**: `tickets_sold_today`, `revenue_today`, `avg_ticket_price` — populated by EATA/Vivaticket sync for Don Omar BCN events
- **Supabase stores monetary values in CENTS** (bigint): spend=224000 means $2,240.00
- Meta API: `daily_budget` and `lifetime_budget` come in cents natively from Meta. `lifetime_budget` = 0 (not null) for campaigns without one.
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

## Data Pipeline Status (verified 2026-03-14, Cycle #260)
- `daily_budget` ✅ populated for all campaigns in Supabase
- `start_time` ✅ populated for all campaigns in Supabase
- `campaign_snapshots` ✅ **HEALTHY** — 14+ dates (through Mar 13). Gap Feb 27-Mar 4 permanent. ⚠️ Mar 9≈Mar 10 duplication (Known Issue #10).
- `event_snapshots` ⚠️ **POPULATED BUT STATIC** — ticket values identical across dates (TM One source frozen).
- **Meta syncs:** Session cache from Mar 14 18:01 CST (fresh). Boss did live pull Mar 14.
- **TM One events:** last-events.json 10+ days stale (Mar 4). TM sync not running regularly.
- **Supabase status lag:** Supabase shows 7 ACTIVE (includes SF + Anaheim + Sac) but Boss confirmed only 5 truly ACTIVE on Meta (Don Omar, KYBBA, Sienna, Vaz Vil, Sac showday). Known pipeline gap — PAUSED status doesn't sync back to Supabase. Verified Cycle #260.
- **Pacing checks (P4):** ✅ Can run with fresh data.
- **ROAS trend checks (P4):** ✅ Can run (consecutive snapshots Mar 5-13 available).

## EATA / Vivaticket Integration (added Cycle #76, Mar 5)
- **Platform:** Vivaticket (entradasatualcance.com/backstage) — AngularJS SPA
- **Client:** Don Omar BCN (slug: `don_omar_bcn`)
- **Auth:** OAuth2 access_token as query param. Token lifetime ~1-2h, refreshed via Playwright login.
- **API base:** `https://www.entradasatualcance.com`
- **Common params:** `access_token=<token>&host=www.entradasatualcance.com&release=2.120.37&team=1578`
- **Key endpoints:** `/api/events` (list), `/api/events/{id}` (detail), `/api/events/{id}/report` (revenue/tickets)
- **Report fields:** `revenue.total` (whole euros), `revenue.daily`, `soldTickets.total`, `soldTickets.daily`
- **Events:** 14948 = DON OMAR BARCELONA (active, tm_id=`eata_14948`), 14942 = NO VALIDO (skipped)
- **Venue:** Estadio Olimpico Lluis Companys, Barcelona
- **Scripts:** `session/eata-cookie-refresh.mjs` (Playwright login), `session/eata-http-sync.mjs` (data fetch)
- **Auth file:** `session/eata-auth.json` (accessToken, host, release, team, savedAt)
- **Scheduler:** `eata-sync` (every 2h), `eata-cookie-refresh` (every 6h)
- **Pipeline status (verified Cycle #76):** LIVE. Don Omar BCN: 30,052 tickets sold, gross 3,231,949 euros, 442 tickets/day, avg price 107.55 euros. Event date Jul 23, 2026. Event snapshot writing to Supabase.

## Known Issues (tracked, ranked by impact — updated Mar 15 Boss Supervision #2)
1. 🔴 **Service account key exposed on GitHub** — Gmail auth broken (`invalid_grant`). **Jaime must rotate the service account key and generate a new PAT.**
2. 🔴 **KYBBA ZERO purchases 4+ consecutive days** — Mar 11-14 confirmed zero purchases ($173 spent for nothing). **8 consecutive blended ROAS declines (2.72→2.44)**. Marginal ROAS near 0. Freq 3.82 (fatigue). Show Mar 22 (7 days). $50/day. **Creative refresh CRITICAL** — current ads are dead. Don't kill (show proximity).
3. 🔴 **Vaz Vil still ACTIVE at 0x ROAS** — $153/7d, $350+ total, 0 purchases in 12+ days. $50/day budget delivering ~$22/day. No show date. Needs Jaime's call: pause or keep running.
4. 🟡 **Arjona Glendale Mar 20 (5 days) — NO active campaign** — 3,698 tickets sold. Needs decision: activate a campaign or let organic handle it.
5. ✅ **Don Omar BCN EXCELLENT** — $3,867 total spend, 6.38x ROAS (7d), 87 purchases (7d). $600/day. Marginal ROAS 6.24x (Mar 14→15). ✅ Safe to scale further.
6. ✅ **Sienna on track** — $877/7d, ViewContent optimization, 5,503 VCs. 0x ROAS expected.
7. ✅ **Arjona Anaheim** — show TODAY Mar 15. Campaign PAUSED, $0 spend. No action needed.
8. 🟡 **Heartbeat stale** — Mar 8 (7+ days). Data still flowing but heartbeat cron not updating.
9. 🟡 **Campaign snapshots gap Feb 20-22 + Feb 27-Mar 4** — permanent.
10. 🟡 **Snapshot duplication bug** — Mar 9≈Mar 10 partially resolved. Write-once UPSERT = permanent for affected rows.
11. 🟡 **TM One per-event data incomplete** — Jaime actively working on TM1 scraper.
- ✅ RESOLVED: Arjona SF (show Mar 14, PAUSED), Arjona Anaheim (show Mar 15, PAUSED $0), KYBBA delivery (fixed, now spending ~$43/day)
- ✅ RESOLVED: Phoenix (PAUSED, confirmed $0 spend Mar 9), SLC (PAUSED after Mar 9 show), `/api/health` (returns 200 now), Palm Desert (recovered to 3.35x), Don Omar BCN (delivered 6.73x, now PAUSED by Jaime), Anaheim trend reversal (4.09x), Sienna (PAUSED by Jaime ~Mar 8), SF 8.55x (recovered), San Diego (PAUSED), Meta sync stale (resumed), Houston (PAUSED, $2,977 5.90x), Dallas (PAUSED, $625 19.02x), San Antonio (PAUSED, $1,718 3.89x), Alofoke (PAUSED, show past), KYBBA marginal recovered (4.67x), PAUSED status sync, Scheduler auto-firing, `/api/alerts` Clerk bug, Scheduler down, agent_jobs deprecated

## Current Campaign Landscape (as of 2026-03-15, Boss Supervision — LIVE PULL)
- **4 ACTIVE campaigns**. Rest PAUSED.
- **Data freshness:** Mar 15 live Meta API pull.

### ACTIVE Campaigns (4) — updated Mar 15 Boss Supervision #2 (LIVE)
**KYBBA — 🔴 CRITICAL:**
- KYBBA Miami — **$2,755 spend (lifetime), 2.44x blended ROAS**, $50/day budget. Show Mar 22 (7 days).
  - **Last 7d:** $452 spend, 13 purchases, 3.76x ROAS — but ALL 13 purchases were Mar 8-10.
  - **Mar 11-14: 4 CONSECUTIVE ZERO-PURCHASE DAYS** (~$173 spent with 0 conversions).
  - Blended ROAS declining 8 consecutive snapshots: 2.72→2.44. Marginal ROAS near 0.
  - Freq 3.82 ⚠️ fatigue. Audience exhausted.
  - **Recommendation:** Fresh creatives CRITICAL. Show in 7 days — don't kill but current ads are dead.

**Excellent:**
- Don Omar Barcelona — **$3,497 spend (7d), 6.34x ROAS**, 87 purchases (7d). $600/day. Freq 2.44. Concert Jul 23. Marginal ROAS 6.24x (Mar 14→15). ✅ Safe to scale further. Total spend $3,867.

**On track:**
- Sienna - Peace In Mind — **$877 spend (7d), 0x ROAS (expected — ViewContent optimization)**. $200/day. 5,503 ViewContent. Freq 1.47. ✅ Normal.

**Dead:**
- Vaz Vil - Kiko Blade — **$153 spend (7d)**, 0x ROAS, $50/day budget but only delivering ~$22/day. **0 purchases in 12+ days.** Freq 2.22. 🔴 Needs Jaime's decision.

**El Destilero pixel** — created Mar 12 by Isabel (ID: `939151375333756`). Access: Jaime, Isabel, Alexandra.

### Upcoming Shows (from Mar 15)
- **TODAY Mar 15:** Arjona Anaheim (Honda Center, 4,398 tickets) — PAUSED, $0 spend, never activated.
- **Mar 20:** Arjona Glendale (Desert Diamond Arena, 3,698 tickets) — ⚠️ NO active campaign, 5 days out.
- **Mar 22:** KYBBA Miami — ACTIVE but 0 purchases for 4 days. 🔴
- **Mar 25:** Arjona San Antonio (Frost Bank Center, 2,681 tickets)
- **Mar 29:** Arjona Austin (Moody Center, 3,513 tickets)
- **Apr 2-7:** Arjona Miami (5 shows, Kaseya Center, 4,795-9,593 tickets each)

### Clients Summary (updated Mar 15)
- **Zamora:** 24+ campaigns (ALL PAUSED — next show Glendale Mar 20, no active campaign)
- **KYBBA:** 1 campaign (ACTIVE, 2.47x declining, $50/day, show Mar 22) 🔴 CRITICAL
- **Sienna:** 1 campaign (ACTIVE, 0x expected, $200/day) ✅
- **Vaz Vil:** 1 campaign (ACTIVE, $350 total, 0x, $50/day — dead) 🔴
- **Don Omar BCN:** 1 Meta campaign (ACTIVE, $600/day, **6.34× ROAS**, 87 purchases/7d) + EATA (30,052 tickets, €3.2M). ✅
- **Beamina / Happy Paws:** PAUSED

### Snapshot Dates
14+ dates through Mar 14. Gap Feb 27-Mar 4 permanent.

## Upcoming Shows (updated Mar 14 — Boss Supervision #2)
- **PAST:** Denver Feb 18, Seattle Feb 25, Portland Feb 26, Inglewood Mar 1, Boston Mar 2, San Jose Mar 6, San Diego Mar 7, Phoenix Mar 8, SLC Mar 9, Palm Desert Mar 12, Camila Anaheim Mar 13, Camila Sacramento Mar 14, Arjona SF Mar 14
- **TODAY Mar 15:** **Arjona Anaheim** (Honda Center, 4,398 tickets) — campaign PAUSED, $0 spend
- **Mar 15:** **Arjona Anaheim** (Honda Center, 4,398 tickets) — ⚠️ campaign PAUSED
- **Mar 20:** Arjona Glendale (Desert Diamond Arena, 3,698 tickets)
- **Mar 22:** **KYBBA Miami** (136 purchases, 2.91x ROAS)
- **Mar 25:** Arjona San Antonio (Frost Bank Center, 2,681 tickets)
- **Mar 29:** Arjona Austin (Moody Center, 3,513 tickets)
- **Apr 2-7:** Arjona Miami (5 shows, Kaseya Center, 4,795-9,593 tickets each)
- **Apr 10-16:** Nashville, Atlanta, DC, Reading
- **Jul 23:** Don Omar BCN (Estadio Olimpico, 30,052 tickets)
- **Campaign-Event alignment:** Camila Phoenix→Phoenix (past) ✓, Camila Anaheim→Anaheim ✓, Camila Sacramento→Sacramento ✓, Arjona SLC→Salt Lake (past) ✓, Arjona Palm Desert→Palm Desert ✓, Arjona SF→SF ✓, KYBBA Miami→(not in TM One), Don Omar BCN→eata_14948 ✓

## Arjona Tour 2026 — Pixel & Venue Status (updated Mar 6)
- **Primary Pixel:** 879345548404130 (all venues except San Diego)
- **San Diego Pixel:** 2005949343681464
- LIVE: Salt Lake City (Maverik Center), Palm Desert (Acrisure Arena)
- PENDING: Anaheim (Honda Center / OC Vibe — waiting on Kishore to place it), San Diego (Pechanga Arena / AXS — Taylor submitted, 4-5 day wait)
- DENIED: San Francisco (Chase Center / Golden State) — legal team rejected third-party pixels (privacy concerns, requires vetting/approval/dev). Contact: Steph Krutolow (Manager, Venue Marketing). Jaime needs to decide: escalate via Mirna/Zamora, push back at Golden State, or run SF without pixel.
- NO RESPONSE: Puerto Rico (Coliseo / Ticketera — needs follow-up)

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

## Campaign Creation Rules (from Jaime, Mar 6)
- **CTA: Always "Shop Now"** for any event or sales campaign
- **Fan Page: Use the artist's page**, not Outlet Media's. Search for the artist's FB page and grab the ID. If we don't have the artist's page, use **Zamora's page** as fallback (not Outlet Media).
- **Advantage+ Creative Enhancements: ALL OFF (set to 0)**. Jaime wants zero enhancements enabled. Turn off: Text improvements, Enhance CTA, Flex media, Show summaries, Translate text, Add overlays, and all others.
- **EU Beneficiary & Payer: Always "OUTLET MEDIA INC"**. Required for ad sets targeting EU audiences. Set in Advertising Settings. Both beneficiary and payer = OUTLET MEDIA INC (same entity).
- **Known artist pages:**
  - Don Omar: Page ID `21608835481`, IG ID `17841400670290220`

## Things To Remember
- TM One credentials in .env (TM_EMAIL, TM_PASSWORD) — ✅ **configured** as of Feb 22 (jaime@outletmedia.net)
- Meta credentials are in the app's ../.env.local — agent reads them from the parent directory
- Agent working directory is /Users/jaimeortiz/outlet-media-app/agent — all paths relative to here
- INGEST_URL should point to Railway (or localhost:3000 for dev)
- LEARNINGS.md is the think-loop journal — read it first every cycle
- session/ directory holds: `last-campaigns.json` (inter-run cache, refreshed Mar 13), `activity-log.json` (Discord cross-channel coordination for Boss agent), `last-demographics.json` (TM fan demographics, refreshed Mar 4), `last-events.json` (events with ticket data, refreshed Mar 4), `eata-auth.json` (EATA OAuth2 token), `eata-cookie-refresh.mjs` (Playwright login), `eata-http-sync.mjs` (EATA data fetch). 40+ `tm1-*` debug files (scrapers, screenshots, captured API calls, storage state).
- session/proposals.md has 18 ranked capability proposals (A-R, tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min. Gmail uses push watch first, with minute-level history polling only as fallback. All cron jobs use fixed UTC schedules, not intervals-from-start.
- **Email agent:** Monitors jaime@outletmedia.net via Gmail API (service account with domain-wide delegation). Memory at `memory/email-agent.md`. Prompt at `prompts/email-agent.txt`. Tools: `session/gmail-reader.mjs`, `session/gmail-sender.mjs`. Gmail scope `gmail.settings.basic` authorized in Google Admin for filter management. 72 auto-archive filters active. 13 color-coded labels.
- **Meeting agent:** Schedules Jaime's calendar via Google Calendar API using the same service-account + domain-wide delegation model as Gmail. Memory at `memory/meeting-agent.md`. Prompt at `prompts/meeting-agent.txt`. Tool: `session/calendar-meet.mjs`. Default timezone America/Chicago. Creates Google Meet links by default unless Jaime says otherwise.
- **Claude CLI:** v2.1.76 at `/Users/jaimeortiz/.local/bin/claude` (verified Cycle #260)

## Proposals Status (from session/proposals.md, updated Cycle #257)
**Completed:** Fix campaigns page, Client slug validation, Daily pacing alerts, Historical snapshots, PAUSED status sync, Alert levels bug fix, EATA integration
**Active proposals (18 total, ranked by priority, re-ranked Cycle #257):**
- **A (Zero-Conversion Auto-Detector):** HIGH priority — auto-flag campaigns with 0 purchases after $100+ spend.
- **M (Delivery Anomaly Auto-Diagnosis):** when pacing < 0.3 for 3+ days, run diagnostic API calls (delivery estimate, learning phase, frequency, ad issues). Would have resolved KYBBA weeks faster.
- **K (Daily Morning Digest):** automated 8am summary of all ACTIVE campaigns. Low-medium effort, high impact.
- **B (Show Proximity ROAS Gate):** auto-alert when ROAS < 2.0 within 3 days of show date.
- **C (Post-Show Campaign Auto-Pause Detector):** flag campaigns still ACTIVE after show date passes.
- **D (Campaign-Event Auto-Linking):** core value prop — ad spend to ticket sales attribution.
- **E (Client Budget Cap Monitor):** track cumulative spend vs client caps.
- **N (Agent Infrastructure Health Page):** dashboard page showing ingest reachability, cache freshness, heartbeat, sync status.
- **F (Marginal ROAS Dashboard Widget):** visualize the metric that caught KYBBA decline.
- **L (Multi-Client Portfolio P&L):** per-client financial summary (total spend, revenue, ROI).
- **G (Ad Health Scan):** scan ACTIVE ads for `effective_status=WITH_ISSUES`.
- **H (EATA Sell-Through Velocity):** project Don Omar BCN sell-out date from daily velocity.
- **I (Campaign Change Journal):** structured history of all changes + impact tracking.
- **J (Snapshot Gap Backfill Pipeline):** detect missing snapshot dates, alert on 24h gaps.
- **O (Post-Show Performance Recap Generator):** automated post-show summary with ROAS trajectory, marginal phases, efficiency. Testable with Palm Desert (Mar 12) and KYBBA (Mar 22).
- **P (Smart Budget Reallocation Advisor):** ranks campaigns by marginal ROAS within client_slug and recommends budget shifts. Portfolio management, not just monitoring.
- **Q (Delivery Stall Detector):** catches frozen/underpacing campaigns via snapshot comparison. Three failure modes: frozen spend (Sienna pattern), severe underpacing (KYBBA pattern), budget-spend mismatch (Houston pattern).
**Implementation priority order:** A first, then Q, then M, then K, then G, then D (which unlocks B/C/H), then O, then P.
