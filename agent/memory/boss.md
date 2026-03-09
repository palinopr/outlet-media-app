# Boss Agent Memory

## Role
Supervisor of all agents. Reads activity-log.json to monitor what every agent is doing.
Makes strategic decisions, delegates work to specialist agents, manages the overall operation.

## Owner Profile
- Jaime Ortiz, founder of Outlet Media
- Prefers short, direct answers -- answer first, offer details second
- Don't ask too many questions -- plan, show the plan, then execute
- Wants fully autonomous AI -- only surface decisions that require real money or strategy changes
- Communicates casually with typos. Respond like a colleague, not formal.

## What Outlet Media Does
- Media buying company -- buys Facebook/Instagram ads for music promoters
- Clients are promoters who run concert tours
- Dashboard at outlet-media-app shows TM One ticket data + Meta campaign data
- Agent runs locally on Jaime's Mac, pushes data to Supabase, dashboard reads Supabase

## Clients
- **Zamora** (slug: "zamora") -- music promoter, campaigns contain "arjona", "camila", "alofoke"
- **KYBBA** (slug: "kybba") -- separate music promoter
- **Sienna** (slug: "sienna") -- music artist, ViewContent optimization (NOT purchase), 0x ROAS expected
- **Vaz Vil** (slug: "vaz_vil") -- new client Mar 3, campaign "Kiko Blade - penetrado tour"
- **Don Omar BCN** (slug: "don_omar_bcn") -- Don Omar concert Barcelona Jul 23. Tickets via Vivaticket/EATA, NOT Ticketmaster.
- **Beamina** (slug: "beamina") -- music promoter
- **Happy Paws** (slug: "happy_paws") -- client
- Unknown campaigns default to slug: "unknown"

## Agent Roster
| Agent | Channel | Prompt | Purpose |
|-------|---------|--------|---------|
| Boss | #boss | boss.txt | Orchestrator, supervisor |
| Media Buyer | #media-buyer | media-buyer.txt | Meta Ads analysis + execution |
| TM Agent | #tm-data | tm-agent.txt | Ticketmaster One data |
| Creative | #creative | creative-agent.txt | Ad creative + copy |
| Reporting | #dashboard | reporting-agent.txt | Cross-source analytics |
| Client Manager | #zamora, #kybba | client-manager.txt | Per-client operations |
| Email Agent | #email | email-agent.txt | Gmail monitoring, auto-draft replies |
| Meeting Agent | #meetings | meeting-agent.txt | Google Calendar scheduling |
| Don Omar Agent | #don-omar | don-omar-agent.txt | Don Omar BCN campaign + EATA data |
| General | #general | general.txt | Quick queries, casual chat |

## Known Issues (updated Mar 9 2026, Cycle #157)
1. Scheduler possibly down -- heartbeat last seen Mar 8 23:05 UTC (~23h stale). No Mar 9 snapshots. Needs restart if it doesn't recover.
2. Vaz Vil 0x ROAS -- $197 spent, $50/day, 7+ consecutive zero-purchase snapshots (Mar 5-8). Alert posted.
3. Phoenix post-show -- show was Mar 8, campaign still ACTIVE at $500/day in stale data. Jaime may have paused but no sync to confirm.
4. SLC show TODAY (Mar 9) -- $800/day, 17.7x ROAS. Should be paused after show tonight.
5. KYBBA delivery issue -- $100/day budget but only $2-6/day actual spend for 9+ cycles. Blended ROAS flat at 2.47x.
6. Campaign snapshots gaps Feb 20-22 + Feb 27-Mar 4 (permanent, unrecoverable).
7. TM One per-event data incomplete -- Jaime actively working on TM1 scraper.
8. EATA token staleness -- cookie refresh visibility needs explicit runtime-state logging.

## Proposals Status (ranked)
G (Ad health scan) > I (Budget cap monitor) > A (Campaign-event linking) > C (Marginal ROAS dashboard) > J (Change journal) > B (Show countdown) > H (Post-show reports) > E (Creative-level data) > F (Budget recommendations)

## Current Campaign Landscape (Mar 9 2026, Cycle #156)
- **29 total campaigns** (8 ACTIVE, 21 PAUSED)
- Data freshness: session cache from Mar 8 18:01 CST (>24h stale as of Mar 9)

### ACTIVE (8)
- KYBBA Miami -- $2,703 spend, 2.47x ROAS, $100/day. Show Mar 22. Delivery issue ($2-6/day actual).
- Camila Anaheim -- $1,541 spend, 4.16x ROAS, $100/day. Show Mar 14.
- Camila Sacramento -- $1,539 spend, 4.92x ROAS, $100/day. Show Mar 15.
- Camila Phoenix -- $1,771 spend, 3.02x ROAS, $500/day. **Show Mar 8 PAST -- should be paused.**
- Arjona Salt Lake City -- $1,131 spend, 17.72x ROAS, $800/day. **Show Mar 9 TODAY.**
- Arjona Palm Desert -- $320 spend, 3.35x ROAS, $500/day. Show Mar 12.
- Arjona San Francisco -- $323 spend, 7.51x ROAS, $50/day. Show Mar 15.
- Vaz Vil - Kiko Blade -- $197 spend, 0x ROAS, $50/day. **7+ consecutive 0x snapshots.**

## Scheduler Status
ALL SCHEDULED JOBS DISABLED. Manual triggers only via Discord channels.


<!-- auto-learned 2026-02-26 -->
- Houston budget now $1,500/day (was $400) still $0 purchases
- #general Discord channel has duplicate response bug (2 replies)
- KYBBA blended ROAS crosses 2.0 ~Mar 7 (was ~Mar 18)
- Alofoke show in Boston on Mar 2

<!-- auto-learned 2026-02-26 -->
- Houston now delivering: 29 purchases, 4.81× ROAS, $37 CPA
- Houston $0-spend issue resolved — was learning phase
- No Houston event exists in TM One for cross-reference

<!-- auto-learned 2026-02-26 -->
- Camila Houston show date: Feb 26 at Smart Financial Centre
- Camila countdown creatives: Dropbox folder with 16 images (7 days→HOY, post+story)

<!-- auto-learned 2026-02-26 -->
- Total daily budget across account: $2,050/day (5 active)
- All-time account spend: $1.43M
- Account 30d blended ROAS: 5.43×, $40 CPA, $15K spend
- Campaign budgets: Alofoke $250, Camila Sac/Ana/KYBBA each $100

<!-- auto-learned 2026-02-26 -->
- Camila Houston budget bumped to $2,700/day for show day push
- Total daily budget now $3,250/day (was $2,050)

<!-- auto-learned 2026-03-05 -->
- Gmail API integration built using Google OAuth refresh token from .env
- Mirna handles venue intros for pixel/database access on Arjona shows
- Arjona venues: Salt Lake, Palm Desert, SF, Anaheim, San Diego, Puerto Rico
- Anaheim (OC Vibe) ready to place TM1 pixels — awaiting instructions
- User's phone number shared with SF venue: (305) 487-0475

<!-- auto-learned 2026-03-05 -->
- Arjona TM1 pixel ID for Anaheim: 879345548404130
- San Diego pixel ID sent to venue: 2005949343681464
- Palm Desert contact: Jason Gurzi, Dir Integrated Mktg, Acrisure Arena
- Anaheim contact: Kishore Ramlagan at OC Vibe
- Palm Desert asked about OTT/OOH placements — reply pending

<!-- auto-learned 2026-03-05 -->
- Palm Desert OTT/OOH reply sent: declined, not in media buying scope

<!-- auto-learned 2026-03-05 -->
- Puerto Rico Arjona contacts: Eduardo & Amanda Cajina via Mirna intro
- SF venue contact: Steph Krutolow at Golden State

<!-- auto-learned 2026-03-05 -->
- Pixel emails: never say "TM1" — just say "here's the pixel to incorporate"

<!-- auto-learned 2026-03-05 -->
- Pixel emails: always say "Meta pixel ID" (not just "pixel")

<!-- auto-learned 2026-03-05 -->
- Gmail/Drive auth: service account with domain-wide delegation (NO browser OAuth needed)
- Service account: outlet-media-agent@zamora-agent.iam.gserviceaccount.com
- Key file: agent/service-account.json (gitignored)
- Shared auth helper: agent/session/google-auth.mjs (getGmailAuth, getDriveAuth, getAuth)
- Impersonates jaime@outletmedia.net for all API calls
- Scopes: gmail.modify, gmail.labels, gmail.send, gmail.readonly, drive.readonly
- Old OAuth refresh token approach is deprecated — all agent scripts now use service account


<!-- auto-learned 2026-03-06 -->
- Isabel's Discord: isalealm_ (ID 1308186598617125038)

<!-- auto-learned 2026-03-06 -->
- Discord agents can't read .txt attachments (only message text)

<!-- auto-learned 2026-03-06 -->
- SF Arjona venue (Golden State) denied pixel — legal blocked it

<!-- auto-learned 2026-03-07 -->
- Salt Lake Arjona daily budget bumped to $800/day (scheduled Mar 7)

<!-- auto-learned 2026-03-08 -->
- SLC Arjona copy swap: "Hoy" ad 120243055587590525 replacing "Mañana"
- Swap scheduled midnight MT (1AM CST) — activate Hoy, pause Mañana
- Ariel Rivas is Don Omar WhatsApp contact (likely don_omar_bcn)

<!-- auto-learned 2026-03-09 -->
- Sienna meeting contacts: Rosana (Carreman), Edu (EO Entertainment)
- AI Idea meeting contacts: Alexandra, Enid (Outlet Holdings), José Ruiz (KW)