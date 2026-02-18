# Project Status

**Last Updated**: 2026-02-18
**Current Phase**: All admin pages done - build green - ready to build client portal + wire real data
**Repo**: `palinopr/outlet-media-app` (private)

---

## Platform Summary

Autonomous ad agency platform for Outlet Media managing ads for Zamora (music promoter).

| Side | Users | Purpose |
|------|-------|---------|
| Admin | Outlet Media team | Manage AI agents, run ads, monitor campaigns |
| Client | Zamora | View campaign numbers, TM1 numbers, promoter dashboard |

**Tech Stack**: Next.js 16.1.6 + TypeScript strict + Tailwind v4 + shadcn/ui + Clerk auth + Supabase

---

## Build Status

**Build**: PASSING - `npm run build` - 0 TypeScript errors, 14 routes

```
/ → redirects to /admin/dashboard
/sign-in /sign-up → Clerk auth (force-dynamic)
/admin/dashboard /campaigns /events /agents → Admin views (all done)
/api/ingest /api/agents /api/meta /api/ticketmaster → API routes
/client/[slug] /client/[slug]/campaigns → Client portal (scaffold only)
```

---

## What's Done

- [x] Git repo + commits pushed to `palinopr/outlet-media-app`
- [x] Clean template pushed to `palinopr/claude-agent-template` (public)
- [x] AGENTS.md fully written (OpenCode only, session handoff, AI team config)
- [x] .gitignore, .mcp.json.example, opencode.json.example, .env.example
- [x] 4 domain agents: tech-lead-orchestrator, nextjs-expert, ticketmaster-scraper, meta-ads-manager
- [x] Next.js 16.1.6 scaffold with 14 routes
- [x] shadcn/ui components installed
- [x] Clerk auth - proxy.ts middleware protecting all routes
- [x] Supabase client (conditional on env vars, build works without them)
- [x] `src/lib/database.types.ts` - full TypeScript types for tm_events, meta_campaigns
- [x] `supabase/schema.sql` - SQL ready to paste into Supabase dashboard
- [x] `POST /api/ingest` - receives agent data, upserts to Supabase tm_events
- [x] `/admin/dashboard` - 6 stat cards, active shows table, campaigns section, agent status panel
- [x] `/admin/events` - 4 stat cards, full shows table with sell-through progress bars
- [x] `/admin/campaigns` - 4 stat cards, full campaigns table with ROAS indicators
- [x] `/admin/agents` - setup banner, 3 agent cards (TM One Monitor, Meta Ads Manager, Campaign Monitor)
- [x] Autonomous agent in `agent/` - Claude Agent SDK + Playwright MCP + Grammy Telegram bot
- [x] Build passing with 0 TypeScript errors

---

## Next Steps (Priority Order)

### 1. Build missing admin pages
- [ ] `/admin/clients` - in sidebar nav but page doesn't exist yet

### 2. Build client portal
- [ ] `/client/[slug]` - proper Zamora-facing UI (currently basic scaffold)
  - Shows their events with sell-through, gross revenue
  - Active campaigns with spend/ROAS
  - TM1 numbers
  - Clean read-only view, no admin controls

### 3. External services setup (user does these)
- [ ] Create Supabase project at supabase.com, run `supabase/schema.sql`
- [ ] Create Clerk project at dashboard.clerk.com, get publishable + secret keys
- [ ] Create `.env.local` from `.env.example`, fill in all keys
- [ ] Create Telegram bot via @BotFather, fill in `agent/.env`
- [ ] Run `cd agent && npm install && npm start`

### 4. Wire real data
- [ ] Swap mock arrays in all admin pages for Supabase queries (env vars already gated)
- [ ] Get Meta access token, wire /admin/campaigns to real Meta API
- [ ] Make agent "Run" buttons call /api/agents endpoint

### 5. Deploy
- [ ] Push to Vercel, set all env vars in Vercel dashboard

---

## Known Issues / Quirks

- Workspace root warning from Next.js (two package-lock.json files) - non-blocking
- `/admin/clients` is in the nav but page does not exist yet
- `supabaseAdmin` in `src/lib/supabase.ts` has no Database generic - Supabase v2 resolves Insert types as `never` with circular Omit definitions. Types handled manually at each call site.
- Clerk: conditionally applied in root layout - app builds and works without real Clerk keys, shows plain avatar

---

## Autonomous Agent Architecture

Data flows via agent, NOT a scraper:

```
agent/src/index.ts        → starts Grammy bot + cron scheduler
agent/src/agent.ts        → Claude Agent SDK, spawns local claude CLI
agent/src/bot.ts          → Telegram commands: /run, /status, /help
agent/src/scheduler.ts    → node-cron every 2 hours
agent/src/system-prompt.ts → instructs Claude to navigate TM One intelligently
```

Claude gets a real Chrome browser via Playwright MCP (`@playwright/mcp`). No brittle CSS selectors - Claude reads and understands the page. Results POST to `/api/ingest`.

**Run**: `cd agent && npm install && cp .env.example .env && npm start`

---

## Key Files

| File | Notes |
|------|-------|
| `src/proxy.ts` | Clerk middleware (Next.js 16 renamed middleware to proxy) |
| `src/lib/supabase.ts` | Admin client has no Database generic (Supabase v2 type bug) |
| `src/lib/database.types.ts` | Manual DB types for tm_events, meta_campaigns |
| `supabase/schema.sql` | Paste into Supabase SQL editor |
| `agent/` | Autonomous Claude agent - Telegram bot + TM One navigator |
| `agent/.env.example` | TM credentials, Telegram token, INGEST config |
| `.env.example` | All required env vars documented |
| `AGENTS.md` | Full OpenCode agent config |
