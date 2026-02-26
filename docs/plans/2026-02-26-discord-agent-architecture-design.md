# Discord Multi-Agent Architecture Design

Date: 2026-02-26

## Goal

Turn Outlet Media's Discord server into an autonomous agency command center. Agents acquire clients, create ads, manage budgets, report results, and scale -- with you supervising from Discord.

## Architecture Overview

Single bot process. Multiple agent identities via webhooks. In-memory job queue with Supabase ledger. Three-tier approval. Self-learning memory + skills. Dynamic agent spawning.

### Three Layers

1. **Display layer** -- Discord. Webhooks for agent identity, embeds for structured output, buttons/select menus for approvals.
2. **Coordination layer** -- In-memory job queue. Agents dispatch typed tasks to each other. Per-channel slots, max 3 concurrent Claude calls.
3. **Persistence layer** -- Supabase `agent_tasks` table. Every task written here. Survives restarts. Queryable from Next.js app.

## Agent Identity System

One bot token, per-agent webhooks with custom name + avatar.

| Agent | Webhook Name | Primary Channel |
|---|---|---|
| Boss | Boss | #boss |
| Media Buyer | Media Buyer | #media-buyer |
| TM Agent | TM Data | #tm-data |
| Creative | Creative | #creative |
| Reporting | Reporting | #dashboard |
| Client Manager | Client Manager | #zamora, #kybba |

Webhooks are cached on startup. If a cached webhook is invalid, fallback creates a new one (Would-You-Bot pattern). Dynamic agents get webhooks created during spawn.

## Concurrency & Job Queue

Per-agent processing slots replace the global `agentBusy` lock. Boss always has reserved slot access.

### Task Object

```
{
  id: "task_abc123",
  from: "boss",
  to: "media-buyer",
  action: "check-roas",
  params: { campaign_id: "123", threshold: 2.0 },
  tier: "green" | "yellow" | "red",
  status: "pending" | "running" | "completed" | "failed" | "escalated",
  created_at: timestamp,
  result: null
}
```

### Flow

1. Task enters queue (from cron, event trigger, agent delegation, or user message)
2. Queue checks if target agent's slot is free
3. If free: run immediately. If busy: queue it, process when slot opens
4. On completion: write result, post to Discord via webhook, write to Supabase
5. Yellow/Red tier: route through approval flow before execution

### Supabase `agent_tasks` Table

Columns: `id`, `from_agent`, `to_agent`, `action`, `params` (jsonb), `tier`, `status`, `result` (jsonb), `created_at`, `started_at`, `completed_at`.

## Agent-to-Agent Communication

Structured task dispatch via JSON blocks in Claude output. No free-text `@agent-name` parsing.

Each agent's system prompt includes: "To delegate a task, output a TASK block:
```json
{"delegate": "media-buyer", "action": "check-roas", "params": {...}}
```"

Runner parses these blocks, strips from display text, enqueues them. Task posts to target channel as structured embed via source agent's webhook.

## Autonomy & Triggers

### Scheduled Sweeps (Cron)

| Agent | Sweep | Schedule |
|---|---|---|
| Media Buyer | ROAS check | Every 6h |
| Media Buyer | Budget review | Daily 8am CST |
| TM Agent | Ticket velocity | Every 4h |
| Creative | Ad fatigue check | Daily |
| Reporting | Morning briefing | Daily 7am CST |
| Client Manager | Client pulse | Daily 9am CST |
| Boss | Supervision | Every 4h |

### Event-Driven Reactions

| Trigger | Agent | Action |
|---|---|---|
| Meta sync lands new data | Media Buyer | Auto-evaluate ROAS drops |
| Campaign hits daily budget | Media Buyer | Decide: cap or increase |
| New event in TM | TM Agent | Create record, notify Client Manager |
| Tickets cross 80% | TM Agent | Alert Boss + Client Manager |
| Agent task fails | Boss | Evaluate, retry or escalate |
| New client signup | Boss | Spawn onboarding workflow |

## Three-Tier Approval System

### Green -- agent acts freely
- Read data, generate reports, sync campaigns/events
- Update own memory and skills
- Post to own channel or #agent-feed
- Create threads in client channels

### Yellow -- Boss auto-approves within rules
- Budget changes under $50/day
- Pause campaign with ROAS below 1.0
- Resume paused campaign with ROAS above 2.0
- Swap ad creative on existing campaign
- Send routine client update (templated)
- Delegate tasks between agents

Boss checks against `agent/rules.json`. If outside rules, escalates to Red.

### Red -- requires user button tap in #approvals
- Budget changes over $50/day
- Create or delete a campaign
- Any client-facing freeform message
- Spawn a new agent
- Modify another agent's prompt or rules
- Any action Boss is uncertain about

#approvals uses select menus for nuanced choices (approve as-is, approve reduced, reject, ask for info). Timeout: 4hr reminder, 24hr expiry.

## Self-Learning & Agent Spawning

### Memory (what happened)
- Lightweight Claude call after substantial conversations extracts facts
- Extended to capture task outcomes, not just chat
- Cross-agent reads: Boss reads all agent memories during supervision

### Skills (how to do things)
- Detect reusable multi-step procedures, save as skill files
- Extended with executable task templates (replayable sequences)
- Boss can promote skills from one agent to another

### Agent Spawning Flow
1. Any agent proposes via structured task to Boss
2. Boss evaluates: real gap or existing agent can handle it?
3. Boss creates Red-tier approval with full spec
4. Embed in #approvals with Accept/Reject
5. On Accept: Boss creates prompt file, memory file, skills dir, webhook, channel, router entry
6. New agent comes online next cycle. Boss posts intro in #agent-feed

### Agent Retirement
If unused for 2+ weeks, Boss flags in supervision. Archive: channel moves to Archive category, agent removed from roster, files preserved.

## Discord Server Layout

16 channels, 8 categories.

```
Boss
  #boss                -- orchestrator, supervision, delegation

Media Buyer
  #media-buyer         -- Meta Ads work (threads per task)

TM Data
  #tm-data             -- Ticketmaster work (threads per task)

Creative
  #creative            -- ad creative work (threads per task)

Reporting
  #dashboard           -- campaign status panel, analytics

Clients
  #zamora (forum)      -- per-campaign posts with tags
  #kybba (forum)       -- per-campaign posts with tags

HQ
  #general             -- team chat, announcements
  #morning-briefing    -- daily summary from Boss
  #agent-feed          -- real-time activity stream (silent)
  #approvals           -- Red/Yellow-tier actions, select menus
  #war-room            -- incident threads, multi-agent coordination
  #agent-internals     -- inspect any agent's memory/skills/prompt
  #schedule            -- view and toggle cron jobs

Ops (you + Boss only)
  #ops                 -- private strategy, escalations, agent issues
  #audit-log           -- every action taken, structured entries
```

### Discord Features

| Feature | Where |
|---|---|
| Webhooks w/ identity | All agent communication |
| Select menus | #approvals, #schedule, agent config |
| Modals | Agent instructions, client messages, rules editing |
| Forum channels | #zamora, #kybba (per-campaign posts with tags) |
| Pinned status embeds | Every agent work channel |
| Bot presence | Global agent activity indicator |
| Thread-per-task | Agent work channels (auto-pin results) |
| Audit log | Agent spawn, channel creation tracking |

### Dynamic Agents
New agents get their own category with one work channel. Router and webhook registry update automatically.

## Code Structure (refactored)

```
agent/src/
  services/
    webhook-service.ts     -- webhook cache, create, send with identity
    queue-service.ts       -- in-memory task queue, per-agent slots
    approval-service.ts    -- tier checking, rules.json evaluation
    memory-service.ts      -- agent memory extraction + injection
    skills-service.ts      -- agent skill extraction + promotion
  events/
    message-handler.ts     -- route messages to agents
    button-handler.ts      -- interactive button responses
    slash-handler.ts       -- slash command responses
    trigger-handler.ts     -- event-driven reactions to data changes
  jobs/
    cron-sweeps.ts         -- per-agent scheduled sweeps
    health-check.ts        -- stale channel detection
    briefing.ts            -- morning summary generator
  agents/
    router.ts              -- channel-to-agent routing config
    delegate.ts            -- structured task delegation
    spawner.ts             -- dynamic agent creation
    supervisor.ts          -- Boss supervision cycle
  discord.ts               -- thin entry point, wires everything
  runner.ts                -- Claude CLI subprocess spawner
  state.ts                 -- shared runtime flags
```

## Shared Client Context

Per-client context files that multiple agents read/write (Agent-MCP pattern):
- `context/zamora.md` -- shared state for Zamora campaigns
- `context/kybba.md` -- shared state for KYBBA campaigns

Media Buyer, Creative, TM, and Client Manager all read from these. Decisions, campaign status, event updates, and client preferences in one place per client.

## What Changes from Current Code

| Current | New |
|---|---|
| Global `agentBusy` lock | Per-agent slots, max 3 concurrent |
| `@agent-name` regex delegation | Structured JSON task blocks |
| One bot identity for all agents | Per-agent webhooks (name + avatar) |
| Text channels for clients | Forum channels with campaign tags |
| No approval flow | Three-tier Green/Yellow/Red |
| Agents only respond when poked | Cron sweeps + event triggers |
| Fixed 6 agents | Boss can spawn new agents (with approval) |
| Memory = chat learnings only | Memory = chat + task outcomes + cross-agent reads |
| Skills = markdown docs | Skills = markdown + executable task templates |
| No activity indicator | Bot presence + pinned status embeds |
| 690-line discord.ts monolith | Split into services/events/jobs/agents |

## What Stays the Same

- Discord.js 14 as client library
- Claude CLI via runner.ts for agent execution
- Prompt files in `prompts/`, memory in `memory/`, skills in `skills/`
- Supabase for persistent data
- Single Node.js process on Mac Mini

## References

- [Kimaki](https://github.com/remorses/kimaki) -- threads as sessions pattern
- [Agent-MCP](https://github.com/rinadelph/Agent-MCP) -- shared context, task management, multi-agent
- [mcp-discord-agent-comm](https://github.com/EugenEistrach/mcp-discord-agent-comm) -- async request/reply with timeout
- [Discord-Bot-TypeScript-Template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template) -- services/events/jobs split
- [Would-You-Bot](https://github.com/Would-You-Bot/client) -- webhook cache with fallback
- [Discord Community Playbook 2025](https://www.influencers-time.com/create-a-thriving-discord-community-2025-playbook-guide/) -- backstage category pattern
