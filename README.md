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

Events, Reports, ticketing workflows and ingest are retired for now; direct Events/Reports URLs redirect back to Dashboard/Campaigns.

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
- `src/app/api/` -- API routes (ingest, meta, contact, admin access)
- `docs/context/` -- durable product and architecture context for future sessions

## Read First

- `AGENTS.md` -- repo operating brief and durable project instructions
- `docs/context/` -- current product direction, engineering rules, and priorities

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the required variables.

## Quality Gates

```bash
npm run check
npm run playwright:install # once per machine/CI image
npm run test:e2e
```

Authenticated Playwright smoke tests create temporary Clerk users with sign-in tokens, then delete them after the run. Set `E2E_BASE_URL` to the real app domain for the Clerk environment being tested (production auth uses `https://outletmedia.net`, not the Railway preview URL) and provide `E2E_CLERK_SECRET_KEY`.

See `docs/references/production-smoke-runbook.md` for the production deploy smoke checklist, `docs/references/database-safety-runbook.md` for Supabase migration safety, and the manual GitHub Actions smoke path.

## Deploy

```bash
git push
railway up --detach
```
