# Agent Simplification Design

**Date:** 2026-04-03
**Status:** Approved

## Intent

Replace the 11 persona-based agent system with a single tool-driven operations agent. The current architecture models an org chart (boss, media buyer, creative, reporting, etc.) but the user only talks in #boss and uses one interface. Every "agent" is just Claude CLI with a different system prompt. The delegation chains burn tokens and the 270KB of prompts encode business logic that should be simpler.

## Requirements

1. **Single agent** — one prompt (`agent.txt`), one identity, all capabilities
2. **All channels route to the same agent** — no per-channel routing
3. **No cron, no sweeps, no scheduled jobs** — agent is purely reactive, only acts when spoken to
4. **No delegation** — agent handles everything directly, no spawning other Claude instances
5. **One MEMORY.md** — agent reads it before every response, writes to it when it learns something important
6. **One bot identity** — posts as "Outlet Agent", not multiple personas. Webhook service simplified to one identity.
7. **10-message Discord history** — current behavior is sufficient, no persistent sessions
8. **Keep existing tools** — Claude CLI, Meta API via curl, Gmail/Calendar via session/*.mjs scripts, Supabase via REST

## Capabilities Lost (intentional)

Killing the scheduler means the agent becomes purely reactive. These proactive behaviors are intentionally dropped:

| Capability | What it did | User confirmed drop |
|-----------|-------------|---------------------|
| Email polling | Checked Gmail every 1min during business hours | ✅ |
| Meeting reminders | Checked upcoming meetings every 1min | ✅ |
| Meta data sync | Pulled campaign data every 6h | ✅ |
| Scheduled handoffs | Dispatched timed budget/copy-swap changes | ✅ |
| Heartbeat | Health check ping every 1min | ✅ |
| Think cycle | Self-improvement loop every 30min | ✅ |
| Discord health | Connection check every 12h | ✅ |
| TM/EATA sync | Ticket data sync (already disabled) | ✅ |
| 11 optional sweeps | Morning briefing, show-day automation, etc. | ✅ |

The agent can still do all of these things on demand — user just has to ask.

## Capabilities (all in one prompt)

- Meta Ads: campaign status, insights, budget changes, pause/activate, creative
- Email: Gmail read/send/reply/organize via session scripts
- Calendar: Google Calendar/Meet via session scripts
- Database: Supabase REST for campaigns, events, clients, system_events
- Reporting: pull and synthesize data from Meta + Supabase
- Strategic: analyze data and make recommendations

## Prompt File

`agent/prompts/agent.txt` (~5KB) containing:
- Identity and rules
- Credentials (META_ACCESS_TOKEN, ad account ID)
- Meta Ads API curl commands and safety guardrails
- Email tool commands (gmail-reader.mjs, gmail-sender.mjs, gmail-admin.mjs)
- Calendar tool commands (calendar-meet.mjs)
- Database REST pattern and key tables
- Client aliases
- Memory instructions (read MEMORY.md before responding, write when learning something important)
- Data conventions (cents, ROAS, etc.)

## Existing v2 Prototype Files

Three prototype files already exist in the codebase from an earlier implementation attempt:
- `agent/src/index-v2.ts`
- `agent/src/discord/core/router-v2.ts`
- `agent/src/events/message-handler-v2.ts`

These inform the implementation but should be deleted after the real files are rewritten — we modify the originals in-place rather than maintaining parallel copies.

## What Gets Deleted

### Prompts (17 files — keep only `agent.txt`)
`boss.txt`, `media-buyer.txt`, `tm-agent.txt`, `reporting-agent.txt`, `think.txt`, `creative-agent.txt`, `client-manager.txt`, `email-agent.txt`, `don-omar-agent.txt`, `meeting-agent.txt`, `general.txt`, `command.txt`, `growth-supervisor.txt`, `content-finder.txt`, `lead-qualifier.txt`, `publisher-tiktok.txt`, `tiktok-supervisor.txt`

### Per-agent memory and skills
- `agent/memory/` — entire directory (15 files)
- `agent/skills/` — entire directory (13 subdirectories)

### Source files

**Scheduler & jobs:**
- `src/scheduler.ts`
- `src/jobs/` (entire directory: `cron-sweeps.ts`, `creative-classify.ts`)

**Agents:**
- `src/agents/delegate.ts`, `src/agents/spawner.ts`

**Events:**
- `src/events/trigger-handler.ts`, `src/events/inspect-handler.ts`

**Discord core:**
- `src/discord/core/command-router.ts`, `src/discord/core/access.ts`, `src/discord/core/message-prompt.ts`

**Discord commands:**
- `src/discord/commands/admin.ts`, `src/discord/commands/schedule.ts`, `src/discord/commands/dashboard.ts`, `src/discord/commands/ops.ts`, `src/discord/commands/supervisor.ts`, `src/discord/commands/growth-publish.ts`

**Discord features (entire directory):**
- `src/discord/features/` (`buttons.ts`, `memory.ts`, `skills.ts`, `threads.ts`, `restructure.ts`)

**Services:**
- `src/services/approval-service.ts`
- `src/services/status-service.ts`
- `src/services/agent-resource-locks.ts`
- `src/services/external-task-dispatcher.ts`
- `src/services/owner-discord-service.ts`
- `src/services/scheduled-handoff-service.ts`
- `src/services/meta-copy-swap-service.ts`
- `src/services/email-intelligence-service.ts`
- `src/services/email-classify.ts`
- `src/services/gmail-watch-service.ts`
- `src/services/calendar-service.ts`
- `src/services/runtime-state.ts`
- `src/services/growth-ledger-types.ts`, `src/services/growth-ledger-service.ts`, `src/services/growth-ledger-writers.ts`, `src/services/growth-ledger-resolve.ts`, `src/services/ledger-service.ts`
- `src/services/email-types.ts`

**State:**
- `src/state.ts`

**Growth (entire directory):**
- `src/growth/`

**Prototype v2 files:**
- `src/index-v2.ts`, `src/discord/core/router-v2.ts`, `src/events/message-handler-v2.ts`

### Slash commands to remove (keep `/status`, `/help`, `/reset`)
`/supervise`, `/ops`, `/dashboard`, `/schedule`, `/schedule-budget`, `/schedule-copy-swap`, `/roles`, `/threads`, `/publish-confirm`, `/publish-fail`

### Dependencies to remove from package.json
- `grammy` — Telegram bot library, no Telegram surface
- `node-cron` — no scheduled jobs

## What Gets Kept

- `src/index.ts` — simplified (Discord bot startup only, no scheduler)
- `src/runner.ts` — Claude CLI subprocess spawning (unchanged)
- `src/discord/core/entry.ts` — simplified (remove deleted module imports, wire messageCreate directly)
- `src/discord/core/router.ts` — simplified (all channels → one agent)
- `src/discord/commands/slash.ts` — simplified (3 commands only)
- `src/events/message-handler.ts` — simplified (no delegation, no resource locks, no memory sync)
- `src/services/webhook-service.ts` — simplified (one "Outlet Agent" identity)
- `src/services/supabase-service.ts` — unchanged
- `src/services/queue-service.ts` — unchanged
- `src/services/system-events-service.ts` — keep if `email-gmail.ts` still imports it, otherwise delete
- `src/services/email-gmail.ts` — keep (Gmail API wrapper for session scripts)
- `src/utils/` — keep (date-helpers, error-helpers, prompt-formatters, session-loader)
- `session/` directory — keep (Gmail, Calendar, TM tools)
- `MEMORY.md` — keep (single strategic context file)
- `LEARNINGS.md` — keep as read-only reference (think cycle is gone, but historical value remains)
- `package.json`, `tsconfig.json`, `.env`

## Migration Safety

Agent is live. Changes are deployed by: stop agent → pull code → start agent. If broken, `git revert` and restart old version.
