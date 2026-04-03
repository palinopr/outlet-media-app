# Agent Simplification Design

**Date:** 2026-04-03
**Status:** Approved

## Intent

Replace the 11 persona-based agent system with a single tool-driven operations agent. The current architecture models an org chart (boss, media buyer, creative, reporting, etc.) but the user only talks in #boss and uses one interface. Every "agent" is just Claude CLI with a different system prompt. The delegation chains burn tokens and the 270KB of prompts encode business logic that should be simpler.

## Requirements

1. **Single agent** — one prompt, one identity, all capabilities
2. **All channels route to the same agent** — no per-channel routing
3. **No cron, no sweeps** — no scheduled jobs
4. **No delegation** — agent handles everything directly, no spawning other Claude instances
5. **One MEMORY.md** — agent reads it before every response, writes to it when it learns something important
6. **One bot identity** — posts as "Outlet Agent", not multiple personas
7. **10-message Discord history** — current behavior is sufficient
8. **Keep existing tools** — Claude CLI, Meta API via curl, Gmail/Calendar via session/*.mjs scripts, Supabase via REST

## Capabilities (all in one prompt)

- Meta Ads: campaign status, insights, budget changes, pause/activate, creative
- Email: Gmail read/send/reply/organize via session scripts
- Calendar: Google Calendar/Meet via session scripts
- Database: Supabase REST for campaigns, events, clients, system_events
- Reporting: pull and synthesize data from Meta + Supabase
- Strategic: analyze data and make recommendations

## What Gets Deleted

- 17 prompt files (replaced by `agent.txt`)
- `scheduler.ts`, `cron-sweeps.ts`, `creative-classify.ts`
- `delegate.ts`, `spawner.ts`
- `approval-service.ts`, `status-service.ts`
- `trigger-handler.ts`, `inspect-handler.ts`
- `growth/`, growth ledger services
- 15 per-agent memory files (`memory/*.md`)
- 13 per-agent skills directories (`skills/*/`)
- 11 of 14 slash commands (keep `/status`, `/help`, `/reset`)
- `command-router.ts`, bang commands
- Discord features: `buttons.ts`, `memory.ts`, `skills.ts`, `threads.ts`, `restructure.ts`
- `agent-resource-locks.ts`
- `external-task-dispatcher.ts`

## What Gets Kept

- `runner.ts` — Claude CLI subprocess spawning
- `entry.ts` — Discord.js client connect/disconnect
- `webhook-service.ts` — posting to Discord
- `supabase-service.ts` — database access
- `queue-service.ts` — task tracking
- `session/` directory — Gmail, Calendar, TM tools
- `MEMORY.md` — single strategic context file
- `LEARNINGS.md` — think cycle journal (read-only reference)
- `package.json` + deps (discord.js, supabase, googleapis, dotenv, claude-agent-sdk)

## Migration Safety

Agent is live. Changes are deployed by: stop agent → pull code → start agent. If broken, `git revert` and restart old version.
