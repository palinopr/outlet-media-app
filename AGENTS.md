# Outlet Media -- Project Instructions

## Stack

- Frontend/API: Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui
- Auth: Clerk (middleware is `src/proxy.ts`, not `middleware.ts`)
- DB: Supabase (`https://dbznwsnteogovicllean.supabase.co`)
- External APIs: Ticketmaster, Meta Marketing API

## Current Product Scope

Outlet Media is a client-facing autonomous-agency operating system, but the current shipped web product is intentionally narrow:

- Campaigns
- Admin account/access management

Events and Reports are retired as navigable product surfaces for now. Keep direct Events/Reports routes redirected back to the active Campaigns/Dashboard experience unless there is a new explicit product decision.

All agent runtime and agent-facing product surfaces are retired for now. Do not add an admin Agents page, client Agent tab, agent task queue, agent outcome widgets, or background agent runtime unless there is a new explicit product decision.

## Product Principles

- Build for shared visibility: clients should feel informed and guided.
- Support both summary-first dashboards and deeper workflow/collaboration views.
- Keep collaboration attached to the relevant campaign, client, asset, or action item.
- Keep workflow concepts such as approvals, assets, activity, and follow-up embedded inside active campaign/admin surfaces before creating standalone apps.
- Build one complete vertical slice at a time; remove dead surfaces instead of preserving placeholders.

## Architecture Priorities

- Prefer event-driven architecture. Meaningful mutations should be traceable through `system_events`, `approval_requests`, or the owning workflow table.
- Treat `system_events` as the shared product timeline for admin/client-visible activity.
- Treat `approval_requests` as the first-class yes/no/cancel approval object.
- Treat `admin_activity` as internal operator audit only.
- Keep routes thin and feature modules reusable. Do not duplicate route-local business logic.
- The client account record and `client_members` are the authority for portal access. Do not use Clerk metadata or URL slugs as the business source of truth for memberships or enabled apps.
- Client portal packaging is intentionally simple: Campaigns are the only client-facing app surface right now.

## Execution Expectations

- Operate like the senior implementation owner for the requested slice.
- When asked to build, implement, clean up, verify, and follow through end to end when the repo/tools allow it.
- Do not leave testing to the user if you can run it.
- Web app baseline verification: `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`.
- If a useful verification step cannot be run, state exactly what blocked it.
- When the user wants autonomous delivery, commit and push only relevant changes after verification. Do not include unrelated dirty files.
- After a verified app push, run `railway up --detach`.
- When a durable engineering lesson is learned, update `docs/context/` or this file.

## No Garbage Rules

- No dead nav items.
- No placeholder product pages, parked tabs, or coming-soon routes in shipped admin/client surfaces.
- No duplicate surfaces for the same job.
- No route-local rewrites of shared business logic.
- No speculative UI breadth.
- No hidden rebuild debt: refactor weak patterns now or quarantine them outside shipped paths.

## Persistent Context

Before major product or architecture work, read:

- `docs/context/product-direction.md`
- `docs/context/engineering-principles.md`
- `docs/context/current-priorities.md`
- `docs/context/architecture-reset.md`

For Codex operating changes, branch conventions, or prompt hygiene decisions, also read `docs/context/codex-workflow.md`.

For repository organization decisions, read `docs/context/repo-organization.md` and `docs/context/salvage-map.md`.

## Repo Organization Rules

- Treat `src/` as the active web app.
- Keep the repo root focused on active systems, core config, docs, and database assets.
- Put small durable references under `docs/references/` and screenshots worth keeping under `docs/screenshots/`.
- Put bulky historical material under `archive/` or move it out of the repo.
- Do not create ambiguous top-level folders that collide with active ownership.

## Key Paths

| Area | Path |
| --- | --- |
| Admin pages | `src/app/admin/` |
| API routes | `src/app/api/` |
| Client portal | `src/app/client/[slug]/` |
| Shared app logic | `src/features/` |
| Supabase client | `src/lib/supabase.ts` |
| DB types | `src/lib/database.types.ts` |
| Migrations | `supabase/migrations/` |
| Durable context | `docs/context/` |

## Data Conventions

- Monetary values in Supabase: cents. Display with `centsToUsd(n)`.
- Meta API `spend` is a dollar string -- multiply by 100 for Supabase. `daily_budget` is already cents.
- ROAS: stored as float (e.g. 8.4), not cents or percentage.
- Client slugs: `zamora`, `kybba`, `beamina`, `happy_paws`, `unknown`.
- Zamora sub-brands: campaigns containing "arjona", "alofoke", "camila" map to slug `zamora`.

## Meta Ad Creative Rules

- Always use separate creatives for Post and Story placements.
- Use `asset_feed_spec` with `asset_customization_rules` to split by placement.
- Label convention: `{city}_post_v` / `{city}_story_v` (videos), `{name}_post` / `{name}_story` (images).
- Never create single-video/single-image ads -- always split post + story.
- Treat root `.env.local` as the canonical local Meta credential source; document variable names only and never copy secret values into docs or prompts.

## Deployment

Railway is the production host. It does not auto-deploy from git push.

After every `git push`, run: `railway up --detach`

- Railway project: `outlet-media-app`
- Live URL: `https://outlet-media-app-production.up.railway.app`
