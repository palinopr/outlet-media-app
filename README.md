# Outlet Media App

Client-facing autonomous agency operating system. Outlet combines campaign operations, client visibility, collaboration, and agents inside one shared environment.

## Stack

- **Frontend/API**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Agent**: Discord bot with node-cron for autonomous campaign management
- **Deploy**: Railway

## Product Shape

- Notion-like workspace shell for docs, tasks, comments, and shared visibility
- First-class apps for campaigns, assets, CRM, approvals, reporting, and activity
- Agent-driven workflows that react to structured events and write outcomes back into the system

## Structure

- `src/app/admin/` -- Admin dashboard (agents, campaigns, events, clients, users)
- `src/app/client/[slug]/` -- Client portal (per-client campaign views)
- `src/app/api/` -- API routes (ingest, meta, alerts, agents)
- `agent/` -- Autonomous Discord agent (multi-agent system)
- `docs/context/` -- Durable product and architecture context for future sessions

## Read First

- `AGENTS.md` -- repo operating brief and durable project instructions
- `docs/context/` -- current product direction, engineering rules, agent patterns, and priorities
- `docs/plans/` -- historical plans only, not the current source of truth

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the required variables.

## Deploy

```bash
git push
railway up --detach
```
