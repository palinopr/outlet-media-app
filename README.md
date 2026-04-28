# Outlet Media App

Client-facing agency operating system focused on campaign performance, client access, and admin operations.

## Stack

- **Frontend/API**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Deploy**: Railway

## Product Shape

Current active product reset target:

- Campaigns
- Admin client/account access

Events and Reports are retired as navigable product surfaces for now; direct URLs redirect back to Dashboard/Campaigns.

Supporting infrastructure remains for auth, client accounts, memberships, invitations, and access control. The prior agent runtime and agent-facing product surfaces are retired for now.

## Structure

- `src/` -- active web app
- `docs/` -- durable product, architecture, ops, and planning docs
- `supabase/` -- database migrations and Supabase assets
- `public/` -- static web assets
- `archive/` -- legacy/reference material kept out of the active root surface

Key deeper paths:
- `src/app/admin/` -- admin product surfaces (dashboard, campaigns, clients, users, settings)
- `src/app/client/[slug]/` -- client portal (campaigns)
- `src/app/api/` -- API routes (ingest, meta, Ticketmaster, contact, workflow)
- `docs/context/` -- durable product and architecture context for future sessions

## Read First

- `AGENTS.md` -- repo operating brief and durable project instructions
- `docs/context/` -- current product direction, engineering rules, and priorities
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
