# Outlet Media -- Project Instructions

> Project-specific instructions for Claude Code. General coding standards live in CLAUDE.md.

## Stack

- Frontend/API: Next.js 15 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui
- Auth: Clerk (middleware is `src/proxy.ts`, not `middleware.ts`)
- DB: Supabase (`https://dbznwsnteogovicllean.supabase.co`)
- External APIs: Ticketmaster, Meta Marketing API
- Agent: `agent/` -- autonomous Claude agent with Discord bot + node-cron

## Product Direction

- Outlet Media is not just a workspace app or a Notion clone. It is a **client-facing autonomous agency operating system**.
- The product should let internal team members, clients, contractors, and agents work in the same environment with shared visibility.
- The UI can borrow strong Notion-style patterns (sidebar, docs, comments, nested pages, block editing), but the product model should be centered on **agency operations**, not generic documents.
- Core first-class product areas are:
  - CRM
  - Campaigns
  - Assets / creative pipeline
  - Tasks / approvals
  - Reports / results
  - Conversations / collaboration
  - Agents / automations
  - Activity / events
- The long-term direction is to make Outlet an AI-enabled environment where clients can run major parts of their business with guidance, automation, and full visibility, not only media buying.

## Product Principles

- Build for **shared visibility**: clients should feel included, informed, and guided rather than locked out of the work.
- Build for **collaboration around context**: work should stay attached to the relevant campaign, client, asset, event, or task instead of being scattered across tools.
- Build for **agent actionability**: agents should react to real system events and structured data, not just ad hoc chat.
- Build for **guided execution**: the system should help users understand what happened, what matters, what is blocked, and what should happen next.
- Build for **multi-app extensibility**: assume more apps will be added over time for customers, not just ads and ticketing.

## Architecture Priorities

- Prefer an **event-driven architecture**. Every meaningful action should be able to emit a structured event such as:
  - `asset_uploaded`
  - `campaign_updated`
  - `approval_requested`
  - `report_generated`
  - `client_comment_added`
  - `agent_action_requested`
  - `agent_action_completed`
- Treat agents as bounded workers that inspect events, decide next actions, draft work, request approval, and log outcomes.
- Treat the workspace/editor layer as the **shell**, not the full product. Core business entities should not be hidden inside generic docs when they need first-class models.
- Campaign-native next steps should live in first-class campaign workflow objects, not only generic workspace tasks.
- When making product or refactor decisions, prefer designs that make the app feel like a coherent operating system across admin and client views.
- `system_events` is the shared product timeline for admin/client-visible activity.
- `approval_requests` is the first-class approval object. Use it for requests that need an explicit yes/no/cancel decision.
- `admin_activity` is the internal operator audit log. Do not treat it as the main product activity backbone.
- If an existing implementation is clearly built in a way that will not scale, do not keep extending it just for short-term convenience. Refactor it toward the correct shared architecture.
- When refactoring a weak pattern into the correct one, update `docs/context/` or `AGENTS.md` in the same pass so future sessions inherit the lesson.

## Execution Expectations

- Operate like the senior implementation owner for the current slice of work. Do the implementation, cleanup, verification, and follow-through end to end when the repo and tools make that possible.
- Do not leave testing to the user if the agent can run it. For every completed slice, run the relevant verification yourself:
  - `npm run type-check` at minimum for app changes
  - targeted lint for the touched files
  - targeted tests when the code path already has test coverage or a focused test is practical
- If a useful verification step cannot be run, say exactly what blocked it instead of silently skipping it.
- When the user wants autonomous delivery, commit and push only the relevant changes after verification. Do not bundle unrelated dirty files into the commit.
- After a verified app push, run `railway up --detach`.
- When a durable engineering lesson is learned, capture it in `docs/context/` or this file before finishing.

## Persistent Context

- Before major product, architecture, or agent work, read:
  - `docs/context/product-direction.md`
  - `docs/context/engineering-principles.md`
  - `docs/context/agent-patterns.md`
  - `docs/context/current-priorities.md`
- When a durable implementation pattern or architectural lesson is discovered, update `docs/context/` or this `AGENTS.md` so future sessions inherit it.
- Prefer storing durable project context in repo docs rather than relying on transient conversation history.
- Treat `docs/plans/` and `docs/screenshots/` as historical reference, not current truth.

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
