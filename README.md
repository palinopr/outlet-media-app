# Outlet Media App

Autonomous ad agency platform. Manages Meta ads for music promoters with AI-driven campaign optimization.

## Stack

- **Frontend/API**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Agent**: Discord bot with node-cron for autonomous campaign management
- **Deploy**: Railway

## Structure

- `src/app/admin/` -- Admin dashboard (agents, campaigns, events, clients, users)
- `src/app/client/[slug]/` -- Client portal (per-client campaign views)
- `src/app/api/` -- API routes (ingest, meta, alerts, agents)
- `agent/` -- Autonomous Discord agent (multi-agent system)

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
