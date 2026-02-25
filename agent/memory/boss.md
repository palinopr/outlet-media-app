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
| General | #general | chat.txt | Quick queries, casual chat |

## Known Issues (updated Cycle #49)
1. Houston $400/day $0 spend -- likely delivery issue
2. KYBBA ROAS declining -- marginal 0.95x, blended crosses 2.0 ~Mar 18
3. Campaign snapshots gap Feb 20-22 (unrecoverable)
4. TM One per-event data incomplete (percentSold/ticketsSold null)

## Proposals Status (ranked)
G (Ad health scan) > I (Budget cap monitor) > A (Campaign-event linking) > C (Marginal ROAS dashboard) > J (Change journal) > B (Show countdown) > H (Post-show reports) > E (Creative-level data) > F (Budget recommendations)

## Current Campaign Landscape (Feb 25)
- 18 total campaigns (5 ACTIVE, 13 PAUSED)
- ACTIVE: Alofoke 8.72x, Camila Sac 4.42x, Camila Ana 3.81x, KYBBA 2.47x, Houston 0.00x
- All Zamora campaigns healthy except Houston ($0 spend)
- KYBBA declining but above 2.0, show Mar 22

## Scheduler Status
ALL SCHEDULED JOBS DISABLED. Manual triggers only via Discord channels.
