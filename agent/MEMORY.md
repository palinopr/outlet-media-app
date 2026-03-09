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
  - `agent_alerts` — proactive alerts (level: info/warn/error — Zod-validated, read_at for dismissal)
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
- **Post-show auto-pause:** After a show date passes, always verify the campaign is PAUSED with $0 spend. If still ACTIVE or spending, pause it immediately — no confirmation needed. Jaime may pause adsets but the campaign can remain on; always check campaign-level status.
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

## Data Pipeline Status (verified 2026-03-09, Cycle #156)
- `daily_budget` ✅ populated for all 29 campaigns in Supabase
- `start_time` ✅ populated for all 29 campaigns in Supabase
- `campaign_snapshots` ✅ **HEALTHY** — 9+ dates. Gap Feb 27-Mar 4 permanent.
- `event_snapshots` ⚠️ **POPULATED BUT STATIC** — ticket values identical across dates (TM One source frozen).
- **Meta syncs:** ⚠️ Session cache from Mar 8 18:01 (>24h stale). Heartbeat 23h old — scheduler may be down. Supabase has 29 total, 8 ACTIVE.
- **TM One events:** Jaime actively developing TM1 scraper.
- **Pacing checks (P4):** ✅ Can run with fresh data.
- **ROAS trend checks (P4):** ✅ Can run (consecutive snapshots Mar 5-8 available).

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

## Known Issues (tracked, ranked by impact — updated Cycle #157, Mar 9)
1. 🔴 **Scheduler possibly down** — heartbeat last_seen Mar 8 23:05 UTC (~23h stale as of Mar 9). No Mar 9 snapshots. Session cache from Mar 8 18:01. If heartbeat doesn't recover, Jaime needs to restart.
2. 🔴 **Vaz Vil 0x ROAS** — $197 spent, $50/day. 7+ consecutive 0x snapshots (Mar 5-8, no Mar 9 data). Alert posted Cycle #136.
3. ⚠️ **Phoenix post-show** — Show was Mar 8 (PAST), campaign still ACTIVE at $500/day in Supabase. No sync since Mar 8 18:01 (scheduler stale). Jaime may have paused but no data to confirm.
4. ⚠️ **SLC show TODAY (Mar 9)** — $800/day, 17.7× ROAS. Should be paused after show tonight.
5. 🟡 **KYBBA blended ROAS flat at 2.47** — stable but close to 2.0 threshold. Show Mar 22. Monitor.
6. 🟡 **KYBBA delivery issue** — $100/day budget but only $2-6/day actual spend. Meta barely spending. Noted 9+ cycles.
7. 🟡 **Campaign snapshots gap Feb 20-22 + Feb 27-Mar 4** — Two permanent gaps in historical data.
8. 🟡 **TM One per-event data incomplete** — Jaime actively working on TM1 scraper.
9. 🟡 **EATA token staleness** — Cookie refresh visibility still needs explicit runtime-state logging.
- ✅ RESOLVED: `/api/health` (returns 200 now), Palm Desert (recovered to 3.35x), Don Omar BCN (delivered 6.73x, now PAUSED by Jaime), Anaheim trend reversal (4.09x), Sienna (PAUSED by Jaime ~Mar 8), SF 8.55x (recovered), San Diego (PAUSED), Meta sync stale (resumed), Houston (PAUSED, $2,977 5.90x), Dallas (PAUSED, $625 19.02x), San Antonio (PAUSED, $1,718 3.89x), Alofoke (PAUSED, show past), KYBBA marginal recovered (4.67x), PAUSED status sync, Scheduler auto-firing, `/api/alerts` Clerk bug, Scheduler down, agent_jobs deprecated

## Current Campaign Landscape (as of 2026-03-09, verified Cycle #156)
- **29 total campaigns** in Supabase (8 ACTIVE, 21 PAUSED). Supabase is authoritative.
- **Data freshness:** Session cache from Mar 8 18:01 CST (>24h stale as of Mar 9).

### ACTIVE Campaigns (8) — updated Cycle #156 from Supabase
**Zamora — Continuing:**
- KYBBA Miami — ~$2,703 spend, 2.47x ROAS, $100/day. Show Mar 22 (13 days). Stable but near 2.0 threshold. Delivery issue: only $2-6/day actual on $100/day budget.
- Camila Anaheim — ~$1,541 spend, 4.16x ROAS, $100/day. Show Mar 14 (5 days). Healthy.
- Camila Sacramento — ~$1,539 spend, 4.92x ROAS, $100/day. Show Mar 15 (6 days). Healthy.

**Zamora — Show-day / Post-show (needs pause verification):**
- Camila Phoenix — ~$1,771 spend, **3.02x ROAS**, **$500/day**. **Show Mar 8 PAST — should be paused.** Still ACTIVE in stale data.
- Arjona Salt Lake City — ~$1,131 spend, **17.72x ROAS**, **$800/day**. **Show Mar 9 TODAY.** Should pause after show.

**Zamora — Arjona cities:**
- Arjona Palm Desert — ~$320 spend, **3.35x ROAS**, **$500/day** (budget bumped from $50, final push). Show Mar 12 (3 days).
- Arjona San Francisco — ~$323 spend, **7.51x ROAS**, $50/day. Show Mar 15 (6 days). Healthy.

**New Clients:**
- Vaz Vil - Kiko Blade — $197 spend, 0x ROAS, $50/day. Started Mar 3. **7+ consecutive 0x snapshots — alert posted.**

### PAUSED Campaigns (21) — updated Cycle #156
- **Don Omar Barcelona** — $370 spend, 6.73x ROAS, $600/day. **PAUSED by Jaime** (was ACTIVE, launched Mar 6). Concert Jul 23 via Vivaticket.
- Sienna - Peace In Mind — $776 spend, $200/day. **ViewContent optimization (music artist), NOT purchase.** 0x ROAS expected. Paused by Jaime ~Mar 8.
- Camila San Diego (Zamora) — $703 spend, 1.13x ROAS. Show Mar 7 past.
- Camila San Antonio (Zamora) — $1,718 spend, 3.89x ROAS. Show Mar 26. Was activated, ran, then paused.
- Camila Houston (Zamora) — $2,977 spend, 5.90x ROAS. Was reactivated and scaled ($2,700/day budget).
- Camila Dallas (Zamora) — $625 spend, 19.02x ROAS. Was reactivated and ran well ($1,600/day budget).
- Alofoke (Zamora) — $1,448 spend, 9.79x ROAS. Boston show Mar 2 past.
- Arjona Boston (4 campaigns) — ~$4,559 combined, shows past.
- Arjona Denver V2 — $2,240, 9.82x. Show past.
- Arjona Sacramento V2, Seattle V2, Portland V2 — all high ROAS, shows past.
- Arjona Anaheim, Arjona San Diego — $0 spend, PAUSED (staged for activation).
- Denver Retargeting ($126, 0.39x), Happy Paws ($200, 0x), Beamina V3 ($1,136, 3.73x).
- Note: PAUSED campaigns show $0 spend in meta_campaigns (Meta API behavior). Historical spend preserved in campaign_snapshots.

### Clients Summary
- **Zamora:** 24 campaigns (6 ACTIVE, 18 PAUSED) — includes Arjona, Camila, Alofoke sub-brands
- **KYBBA:** 1 campaign (ACTIVE)
- **Sienna:** 1 campaign (PAUSED — paused ~Mar 8)
- **Vaz Vil:** 1 campaign (ACTIVE)
- **Don Omar BCN:** 1 Meta campaign (PAUSED, was $600/day, 6.73× — paused by Jaime) + 1 EATA event (eata_14948). Tickets via Vivaticket, not TM.
- **Beamina:** 1 campaign (PAUSED)
- **Happy Paws:** 1 campaign (PAUSED)

### Snapshot Dates
9+ dates. Key dates: Feb 19, Feb 23-26, Mar 5-8. Gap Feb 27-Mar 4 permanent.

## Upcoming Shows (from TM One GraphQL, 25 events — updated Cycle #140, Mar 8)
- **PAST:** Denver Feb 18, Seattle Feb 25, Portland Feb 26, Inglewood Mar 1, Boston Mar 2, San Jose Mar 6, San Diego Mar 7, Phoenix Mar 8, **SLC Mar 9** (Arjona, 17.7x, show TODAY — pause after)
- **This week:** Palm Desert Mar 12 (Arjona, 3.35x ✅, $500/day), **Anaheim Mar 14** (Camila, 4.16x ✅), **Sacramento Mar 15** (Camila, 4.92x ✅), SF Mar 15 (Arjona, 7.51x ✅), Arjona Mar 16
- **Late March:** Glendale Mar 21, **KYBBA Miami Mar 22** (2.47x ⚠️), San Antonio Mar 26, Austin Mar 30
- **April:** Miami Apr 3-8 (5 shows), Nashville Apr 11, Atlanta Apr 12, DC Apr 14, Reading Apr 17
- **Don Omar BCN Jul 23** — Via Vivaticket/EATA (30,052 tickets sold). Meta campaign launched Mar 6.
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
- session/ directory holds: `last-campaigns.json` (inter-run cache, refreshed Mar 5), `activity-log.json` (Discord cross-channel coordination for Boss agent), `last-demographics.json` (TM fan demographics, refreshed Mar 4), `last-events.json` (events with ticket data, refreshed Mar 4), `eata-auth.json` (EATA OAuth2 token), `eata-cookie-refresh.mjs` (Playwright login), `eata-http-sync.mjs` (EATA data fetch). 40+ `tm1-*` debug files (scrapers, screenshots, captured API calls, storage state).
- session/proposals.md has 12 ranked capability proposals (A-L active, tracked in Proposals Status section below)
- `/client/[slug]/campaigns/page.tsx` wired to Supabase, shows real campaign data + trend charts
- Dashboard admin pages: /admin/dashboard (alert banner, ROAS chart), /admin/agents (job history), /admin/campaigns (client filter dropdown), /admin/clients (multi-client dynamic list)
- All mock data removed from dashboard — all pages read from Supabase
- **Scheduler timing:** TM One every 2h, Meta every 6h, Think every 30min (8am-10pm only), Heartbeat every 1min. Gmail uses push watch first, with minute-level history polling only as fallback. All cron jobs use fixed UTC schedules, not intervals-from-start.
- **Email agent:** Monitors jaime@outletmedia.net via Gmail API (service account with domain-wide delegation). Memory at `memory/email-agent.md`. Prompt at `prompts/email-agent.txt`. Tools: `session/gmail-reader.mjs`, `session/gmail-sender.mjs`. Gmail scope `gmail.settings.basic` authorized in Google Admin for filter management. 72 auto-archive filters active. 13 color-coded labels.
- **Meeting agent:** Schedules Jaime's calendar via Google Calendar API using the same service-account + domain-wide delegation model as Gmail. Memory at `memory/meeting-agent.md`. Prompt at `prompts/meeting-agent.txt`. Tool: `session/calendar-meet.mjs`. Default timezone America/Chicago. Creates Google Meet links by default unless Jaime says otherwise.
- **Claude CLI:** v2.1.69 at `/Users/jaimeortiz/.local/bin/claude` (verified Cycle #68)

## Proposals Status (from session/proposals.md, updated Cycle #127)
**Completed:** Fix campaigns page, Client slug validation, Daily pacing alerts, Historical snapshots, PAUSED status sync, Alert levels bug fix, EATA integration
**Active proposals (12 total, ranked by priority, re-ranked Cycle #127):**
- **A (Zero-Conversion Auto-Detector):** HIGH priority — auto-flag campaigns with 0 purchases after $100+ spend.
- **K (Daily Morning Digest):** automated 8am summary of all ACTIVE campaigns. Low-medium effort, high impact.
- **B (Show Proximity ROAS Gate):** auto-alert when ROAS < 2.0 within 3 days of show date.
- **C (Post-Show Campaign Auto-Pause Detector):** flag campaigns still ACTIVE after show date passes.
- **D (Campaign-Event Auto-Linking):** core value prop — ad spend to ticket sales attribution.
- **E (Client Budget Cap Monitor):** track cumulative spend vs client caps.
- **F (Marginal ROAS Dashboard Widget):** visualize the metric that caught KYBBA decline.
- **L (Multi-Client Portfolio P&L):** per-client financial summary (total spend, revenue, ROI).
- **G (Ad Health Scan):** scan ACTIVE ads for `effective_status=WITH_ISSUES`.
- **H (EATA Sell-Through Velocity):** project Don Omar BCN sell-out date from daily velocity.
- **I (Campaign Change Journal):** structured history of all changes + impact tracking.
- **J (Snapshot Gap Backfill Pipeline):** detect missing snapshot dates, alert on 24h gaps.
**Implementation priority order:** A first, then K, then G, then D (which unlocks B/C/H).
