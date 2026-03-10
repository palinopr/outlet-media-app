# Outlet Media -- Discord Agent System

One person running a media buying agency with 9 AI agents on Discord.

Outlet Media manages Meta ad campaigns for live event promoters (concerts, tours). The entire operation -- ad buying, email, meetings, ticket monitoring, reporting, client updates -- runs through a Discord server where each channel is wired to a specialist AI agent.

Jaime talks to agents in Discord like talking to a team. The agents talk back, take action, and coordinate with each other.

---

## How It Works

A single Node.js process runs on a Mac Mini. It connects to Discord as a bot, watches every channel for messages, and routes each message to the right agent based on channel name. Each agent has its own prompt, memory file, tools, and concurrency slot.

```
Discord message in #media-buyer
  -> router.ts maps "media-buyer" to media-buyer agent config
  -> loads prompts/media-buyer.txt + memory/media-buyer.md
  -> spawns Claude CLI with tools (curl for Meta API, Supabase, etc.)
  -> agent reads data, takes action, replies in channel
```

Agents can also run on autopilot. A scheduler fires cron jobs (meta sync, email monitoring, think cycles), and 11 sweep jobs run proactive automations on their own schedules.

---

## The 9 Agents

### Boss (orchestrator)
**Channel**: `#boss`, `#whatsapp-boss`
**What it does**: Jaime's main interface. Coordinates all other agents, delegates tasks, maintains the big picture. Reads a server snapshot before every response so it knows what's happening across all channels.
**Automations**: Morning briefing (8am daily), supervision cycle (every 4h)

### Media Buyer
**Channel**: `#media-buyer`
**What it does**: Manages Meta ad campaigns via the Graph API. Adjusts budgets, pauses/activates campaigns, pulls spend and ROAS data. Learned rules from Jaime over time -- like auto-pausing campaigns after a show ends.
**Automations**: Show-day budget maxing (9am on show days), budget pacing alerts (every 4h), show-day spend monitoring
**Tools**: curl (Meta Graph API v21.0, Supabase REST, Ingest endpoint)

### Email Agent
**Channel**: `#email`, `#email-log`
**What it does**: Monitors jaime@outletmedia.net via Gmail API. Triages every inbound email, auto-drafts replies for routine messages, alerts Jaime for important ones. Learns from corrections -- when Jaime edits a draft, the agent remembers the pattern.
**How**: Gmail pub/sub push notifications trigger instant processing. 72 auto-archive filters + 13 color-coded labels keep the inbox clean.
**Tools**: gmail-reader.mjs, gmail-sender.mjs, Gmail API (filters, labels)

### Meeting Agent
**Channel**: `#meetings`
**What it does**: Manages Google Calendar. Creates events, generates Google Meet links, sends reminders. Knows the contact directory and timezone map (CST for Jaime, CET for Barcelona venues, etc.).
**Automations**: Meeting reminders (checks every minute)
**Tools**: calendar-meet.mjs, Google Calendar API, Google Meet conference creation

### Reporting Agent
**Channel**: `#dashboard`
**What it does**: Generates daily, weekly, and post-show performance reports. Pulls data from Meta API and Supabase snapshots. Calculates ROAS, cost per ticket, spend trends.
**Automations**: Weekly report (Monday 9am), post-show recap (day after each show)

### TM Data Agent
**Channel**: `#tm-data`
**What it does**: Syncs Ticketmaster One event data -- ticket sales, demographics, venue info. Uses browser automation (Playwright) to scrape TM One's authenticated dashboard.
**Automations**: TM sync (every 2h when enabled), cookie refresh (every 6h)

### Don Omar Tickets Agent
**Channel**: `#don-omar-tickets`
**What it does**: Monitors Don Omar Barcelona ticket sales through the EATA/Vivaticket platform. Tracks revenue (EUR), daily ticket velocity, capacity.
**Automations**: EATA sync (every 2h when enabled), cookie refresh (every 6h)

### Creative Agent
**Channel**: `#creative`
**What it does**: Reviews ad creatives for fatigue signals (CTR drops, frequency spikes, CPC increases). Classifies assets. Enforces the rule: every ad gets separate post and story creatives.
**Automations**: Creative fatigue check, asset classification

### Client Manager
**Channel**: `#zamora`, `#kybba`, `#whatsapp-control`
**What it does**: Per-client view of campaigns and events. Summarizes health across a client's portfolio. Drafts WhatsApp messages for client communication.
**Automations**: Client pulse check (daily health per client)

---

## Discord Server Layout

```
OWNER
  #boss              Boss orchestrator
  #email             Email triage + drafts
  #meetings          Calendar + Meet links
  #email-log         Silent email audit trail
  #approvals         Yellow/Red tier actions needing sign-off
  #schedule          Cron job control (!enable, !disable, !schedule list)
  #whatsapp-boss     WhatsApp message synthesis

SPECIALISTS
  #media-buyer       Meta Ads management
  #tm-data           Ticketmaster data
  #creative          Ad creative analysis

HQ
  #dashboard         Reporting agent
  #general           Misc
  #morning-briefing  Boss daily auto-briefing
  #agent-feed        All bot output (read-only feed)

CLIENTS
  #don-omar-tickets  Don Omar BCN (EATA/Vivaticket)
  #zamora            Zamora sub-brands (Arjona, Camila, Alofoke)
  #kybba             KYBBA campaigns
  #whatsapp-control  WhatsApp draft review

OPS
  #war-room          Urgent coordination
  #agent-internals   Agent state inspection
  #ops               Operational tasks
  #audit-log         Action audit trail
```

---

## Automation Schedule

### Always-on core jobs (start automatically)
| Job | Schedule | What it does |
|-----|----------|-------------|
| Heartbeat | Every 1 min | Pings ingest endpoint, resets stale locks |
| Meta sync | Every 6h | Pulls all campaigns + insights from Meta API |
| Think cycle | Every 30 min (8am-10pm) | Self-improvement: reads LEARNINGS.md, works on priorities |
| Discord health | Every 12h | Channel audit, stale lock cleanup |
| Gmail watch | Every 6h | Renews Gmail pub/sub push subscription |
| Meeting reminder | Every 1 min | Checks for meetings starting in 15/5 minutes |
| Scheduled handoffs | Every 1 min | Dispatches time-delayed tasks |

### Sweep jobs (enabled via Discord, persist across restarts)
| Job | Schedule | What it does |
|-----|----------|-------------|
| morning-briefing | 8am daily | Boss generates briefing: shows, campaigns, action items |
| show-day-check | 9am daily | Media buyer auto-maxes budgets on show days |
| show-day-monitor | Every 4h on show days | Mid-day spend pace check |
| post-show-recap | Day after show | Final numbers: spend, ROAS, tickets, auto-pause |
| budget-pacing | Every 4h | Flags under/over-pacing campaigns |
| weekly-report | Monday 9am | Full week performance summary |
| boss-supervision | Every 4h | Agent health review: activity, errors, gaps |
| ticket-velocity | Periodic | Ticket sales acceleration/deceleration alerts |
| creative-fatigue | Periodic | CTR drops, frequency spikes, CPC increases |
| client-pulse | Daily | Per-client portfolio health |
| creative-classify | On demand | Asset classification |

---

## Safety and Approval System

Actions are tiered:

- **Green**: Read-only, reporting, syncs. Runs automatically.
- **Yellow**: Budget changes under threshold, draft emails. Posts to `#approvals` for Jaime to confirm.
- **Red**: Large budget changes, campaign creation/deletion, sending emails to clients. Requires explicit approval.

Thresholds are defined in `agent/rules.json`.

---

## Task Queue

Every agent action goes through a task queue with:
- Supabase ledger for audit trail (`agent_tasks` table)
- Per-agent concurrency (one task at a time per agent slot)
- 10-minute timeout on hung tasks
- Stale resource lock detection (15-minute threshold, checked every heartbeat)
- State persists to `session/sweep-state.json` so enabled jobs survive restarts

---

## Data Flow

```
Meta Graph API  -->  Meta sync (Claude CLI + curl)  -->  session/last-campaigns.json
                                                    -->  Supabase (meta_campaigns, campaign_snapshots)
                                                    -->  Next.js dashboard (via ingest API)

TM One dashboard  -->  Playwright scraper  -->  session/last-events.json
                                           -->  Supabase (tm_events, tm_event_demographics)

EATA/Vivaticket  -->  HTTP API sync  -->  Supabase (tm_events with eata_ prefix)

Gmail API  -->  pub/sub push  -->  email intelligence service  -->  #email + #email-log
```

---

## Tech Stack

- **Runtime**: Node.js on Mac Mini (local, not cloud)
- **AI**: Claude CLI (claude-code) spawned per-task with tools
- **Discord**: discord.js bot with channel-based routing
- **Scheduler**: node-cron for core jobs + sweep jobs
- **Database**: Supabase (PostgreSQL)
- **Web dashboard**: Next.js 15 on Railway
- **Auth**: Clerk (web app), Google service account (Gmail/Calendar)
- **Browser automation**: Playwright (TM One, EATA cookie refresh)
- **Ad platform**: Meta Graph API v21.0

---

## What This Replaces

Before this system, running campaigns for 5+ clients meant:
- Manually checking Meta Ads Manager multiple times a day
- Copying numbers into spreadsheets for reporting
- Remembering to max budgets on show day and pause after
- Reading every email and drafting replies by hand
- Checking Ticketmaster dashboards for ticket velocity
- Building weekly reports from scratch

Now Jaime opens Discord, reads the morning briefing, and handles exceptions. The agents do the rest.

---

## Current State (March 9, 2026)

- **29 campaigns** across 5 clients (8 active, 21 paused)
- **9 agents** routing across 22 Discord channels
- **7 core cron jobs** running continuously
- **6 sweep jobs** enabled and persisting across restarts
- **157+ think cycles** completed (agent self-improvement journal)
- **72 Gmail auto-archive filters** + 13 labels
- Agent has learned rules from Jaime over time (post-show auto-pause, creative split rules, budget escalation patterns)
