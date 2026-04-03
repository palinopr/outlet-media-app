# Agent Patterns

## Agent Role In Outlet

The agent is a single autonomous operations assistant running on Jaime's Mac Mini via Discord. It handles Meta Ads management, email, calendar, database queries, and reporting — all through one prompt and one identity.

## Architecture (Simplified April 2026)

The agent was simplified from an 11-persona multi-agent system to a single-agent design:

- **One prompt** (`agent/prompts/agent.txt`, ~5KB) containing all capabilities
- **One identity** ("Outlet Agent") posting via webhooks
- **One memory file** (`agent/MEMORY.md`) — read before every response, written when learning something important
- **Purely reactive** — no cron jobs, no scheduled tasks, no background work. Agent only acts when spoken to in Discord.
- **No delegation** — agent handles everything directly. No spawning other Claude instances.
- **Tools**: Meta Graph API (curl), Gmail (session scripts), Google Calendar (session scripts), Supabase REST

### Why Single Agent

The previous system had 11 agents (boss, media-buyer, creative, reporting, tm-agent, etc.) each with their own 15-35KB prompt, memory file, and skills directory. But:
- Jaime only used #boss for everything
- Every "agent" was just Claude CLI with a different system prompt
- Delegation chains (boss → media-buyer → boss) burned tokens
- 270KB of prompts encoded business logic that should be simpler

### What Was Removed

- 17 prompt files, 15 per-agent memory files, 13 skills directories
- Scheduler (15+ cron jobs), cron sweeps (11 optional jobs)
- Delegation system (delegate.ts, spawner.ts)
- Approval tiers (green/yellow/red)
- Per-agent resource locks, status rotation, trigger handler
- Growth system (speculative, never shipped)

## Control Plane

- **Discord** is the operating surface for internal agent work
- **Web** is the product surface for admin and client views
- Both share the same Supabase database, domain objects, and `system_events` backbone
- Email and calendar operations are available on demand via the agent's tools
- Do not duplicate Discord workflows into web surfaces unless there's a clear product need

## Adding Capabilities

When the agent needs a new capability:
1. Add the tool commands to `agent/prompts/agent.txt`
2. If it needs a new session script, add it to `agent/session/`
3. If it needs safety guardrails (confirm before executing), add them to the prompt's rules section
4. Keep business logic in the prompt or in code — not in separate memory/skills files

## Agent Memory

`MEMORY.md` is the single source of strategic context. The agent reads it before every response. It writes to it when it learns something important: strategy changes, budget decisions, client updates, new contacts, deadlines.

Keep it concise — bullet points, not paragraphs. If it grows too large, prune old entries.

`LEARNINGS.md` is a historical reference from the old think-cycle system. Read-only.
