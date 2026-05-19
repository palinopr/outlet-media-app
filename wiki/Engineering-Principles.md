---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/context/engineering-principles.md
  - docs/context/repo-organization.md
  - AGENTS.md product/architecture sections
  - src/app/AGENTS.md
  - src/features/AGENTS.md
  - supabase/AGENTS.md
---

# Engineering Principles

## Model real product objects

Prefer first-class objects for active product concepts: campaigns, clients, members, invitations, and connected accounts. Do not hide core business workflows inside generic documents or route-local JSON blobs.

## Event-driven backbone

Every meaningful product mutation should be traceable through durable state, usually `system_events`, `admin_activity`, or the owning product table.

- Use `system_events` as the shared admin/client-visible timeline.
- Use `admin_activity` for internal operator audit only.
- Examples: `campaign_updated` and account/access changes.

## Thin routes, shared feature modules

Routes should authenticate, validate input, call feature-owned logic, and return responses.

- Keep `src/app/**` thin. Pages, layouts, route handlers, and server actions should compose feature modules instead of owning business rules directly.
- Repeated loaders/mutations belong under `src/features/**` so admin and client surfaces do not drift.
- Do not let route-local code become the only place that knows how campaign or account/access behavior works.
- If route code starts duplicating logic already needed by admin and client surfaces, extract it.

## Access and packaging

The client account record and `client_members` are the authority for portal access.

- Do not use Clerk metadata or URL slugs as the business source of truth for memberships or landing behavior.
- Clerk invitation metadata may be used only as transition metadata to accept a DB-backed `client_access_invites` row and create the real `client_members` record.
- Campaign ownership assignment must target an existing active client account.
- Do not auto-create clients from a typed campaign slug; create/activate the client in Clients first, then assign campaigns to that canonical account.
- Client portal packaging is intentionally simple right now: Campaigns are the only active client-facing app surface.

## Data conventions

- Monetary values in Supabase: cents. Display with `centsToUsd(n)`.
- Meta API `spend` is a dollar string; multiply by 100 for Supabase.
- Meta API `daily_budget` is already cents.
- ROAS is stored as a float, e.g. `8.4`, not cents or a percentage.
- Avoid leaving campaign ownership as `unknown` for active campaigns. Add a client account and/or `campaign_client_overrides` row when campaign naming cannot be inferred safely.
- Zamora sub-brands: campaigns containing `arjona`, `alofoke`, or `camila` map to slug `zamora`.

Current production client slugs include:

`9am`, `beamina`, `chris_r`, `distill_pr`, `don_omar`, `don_omar_bcn`, `happy_paws`, `kybba`, `outlet_media`, `proteccion_final`, `project_solaris_bcn`, `sienna`, `vaz_vil_enterprise`, and `zamora`.

## Keep the surface small

No dead nav items, placeholder routes, duplicate surfaces, or speculative UI breadth. If a workflow is not part of Campaigns or account/access management, keep it embedded or remove it until there is an explicit product decision.

Ticketing workflows and ingest product surfaces are retired for now and should not be reintroduced without a new explicit product decision.

## Repository organization

Treat the repository as one active product system plus durable support material:

- `src/` — active Next.js web app
- `supabase/` — database migrations and Supabase assets
- `wiki/` — canonical product, engineering, ops, and AI workflow knowledge
- `docs/` — pointers plus screenshots/reference assets only; not canonical explanatory docs
- `public/` — static web assets
- `__tests__/` / `__mocks__/` — automated test support
- `archive/` — historical bulk material kept out of the active root surface

The previous top-level `agent/` runtime has been retired and should not be recreated by default.

## Placement rules

### Web code

- Keep routes thin in `src/app/`.
- Put domain logic in `src/features/`.
- Use `src/components/`, `src/lib/`, and `src/hooks/` for shared primitives.

### Database

- Make durable schema changes through forward migrations under `supabase/migrations/`.
- Do not edit applied historical migrations to remove old concepts; add cleanup migrations instead.
- Keep `src/lib/database.types.ts` aligned with the active schema.
- Public app tables should ship with RLS enabled and explicit policies. Do not leave exposed tables without policies.

### Docs and artifacts

- Durable product/architecture/ops knowledge → `wiki/`.
- Small reference inputs and screenshots → `docs/references/` or `docs/screenshots/` when useful.
- Historical bulk material → `archive/` or external storage.
- Generated wiki/report output → delete by default unless deliberately promoted into `wiki/` or a reference asset folder.

## Cleanup rule

When a new folder or file appears in the repo root, ask:

1. Is this active web code?
2. Is this a database asset or durable wiki doc?
3. Is this a reference artifact that belongs under `docs/` or `archive/`?
4. Is this local/generated noise that should be ignored?

If the answer is not obvious, do not leave it in root by default.

## Verification discipline

Default verification should stay lean:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Do not add browser automation, generated reports, screenshots, or broad E2E machinery unless the change touches auth-critical behavior that focused tests cannot prove.
