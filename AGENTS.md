# Outlet Media -- Project Instructions

> Project-specific instructions for Claude Code. General coding standards live in CLAUDE.md.

## Stack

- Frontend/API: Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui
- Auth: Clerk (middleware is `src/proxy.ts`, not `middleware.ts`)
- DB: Supabase (`https://dbznwsnteogovicllean.supabase.co`)
- External APIs: Ticketmaster, Meta Marketing API
- Agent: `agent/` -- autonomous Claude agent with Discord bot + node-cron

## Key Paths

| Area | Path |
|------|------|
| Admin pages | `src/app/admin/` (dashboard, campaigns, events, agents, clients, users) |
| API routes | `src/app/api/` (ingest, meta, ticketmaster, agents, alerts, admin) |
| Client portal | `src/app/client/[slug]/` |
| Supabase client | `src/lib/supabase.ts` |
| DB types | `src/lib/database.types.ts` |
| Agent code | `agent/src/` (services, events, agents, jobs) |
| Agent prompts | `agent/prompts/` (boss.txt, media-buyer.txt, etc.) |
| Agent memory | `agent/MEMORY.md` |

## Data Conventions

- Monetary values in Supabase: **cents** (bigint). Display with `centsToUsd(n)`.
- Meta API `spend` is a dollar string -- multiply by 100 for Supabase. `daily_budget` is already cents.
- ROAS: stored as float (e.g. 8.4), not cents or percentage.
- Client slugs: `zamora`, `kybba`, `beamina`, `happy_paws`, `unknown`
  - Zamora sub-brands: campaigns containing "arjona", "alofoke", "camila" map to slug `zamora`

## Meta Ad Creative Rules

- Always use **separate creatives** for Post and Story placements
- Use `asset_feed_spec` with `asset_customization_rules` to split by placement
- Label convention: `{city}_post_v` / `{city}_story_v` (videos), `{name}_post` / `{name}_story` (images)
- Never create single-video/single-image ads -- always split post + story

## Deployment

Railway is the production host. It does NOT auto-deploy from git push.

After every `git push`, run: `railway up --detach`

- Railway project: `outlet-media-app`
- Live URL: `https://outlet-media-app-production.up.railway.app`

## Agent Architecture

Multi-agent Discord system with per-agent concurrency:
- **Services**: webhook, queue (Supabase ledger), approval (3-tier: Green/Yellow/Red), status (presence rotation)
- **Events**: message handler (routing), trigger handler (ROAS/capacity alerts), inspect handler (#agent-internals)
- **Agents**: delegate (structured JSON delegation), spawner (dynamic agent creation)
- **Jobs**: `cron-sweeps.ts` (10 sweep jobs, start OFF, enable via `!enable <job>`)
- **Config**: `discord-router.ts` (channel->agent mapping), `rules.json` (approval thresholds)
- Discord layout: 16 channels, 8 categories
- 5 core cron jobs run unconditionally on startup (heartbeat, TM check, Meta sync, think cycle, Discord health)
