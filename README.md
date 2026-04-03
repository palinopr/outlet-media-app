# Outlet Media App

Client-facing autonomous agency operating system. Outlet combines campaign operations, client visibility, collaboration, and agents inside one shared environment.

## Stack

- **Frontend/API**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Agent**: Discord bot with node-cron for autonomous campaign management
- **Deploy**: Railway

## Product Shape

Current active product reset target:

- Campaigns
- Reports
- Events
- optional client Agent reporting surface

Supporting infrastructure remains for auth, client accounts, memberships, and access control, but non-core product breadth should not continue defining the app.

## Structure

- `src/` -- Active web app
- `agent/` -- Active Discord/autonomous runtime
- `docs/` -- Durable product, architecture, ops, and planning docs
- `supabase/` -- Database migrations and Supabase assets
- `public/` -- Static web assets
- `archive/` -- Legacy/reference material kept out of the active root surface

Key deeper paths:
- `src/app/admin/` -- Admin product surfaces (campaigns, reports, events, agents, clients, users)
- `src/app/client/[slug]/` -- Client portal (campaigns, reports, optional events, optional agent)
- `src/app/api/` -- API routes (ingest, meta, alerts, agents)
- `docs/context/` -- Durable product and architecture context for future sessions
- `docs/context/repo-organization.md` -- Repo structure and file-placement rules
- `docs/context/salvage-map.md` -- Core reset keep/rebuild/archive/delete map

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
