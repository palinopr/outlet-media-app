# Repo Organization

## Mental Model

Treat this repository as one active product system plus durable support material:

- `src/` — the active Next.js web app
- `supabase/` — database migrations and Supabase assets
- `docs/` — durable product, architecture, ops, and historical implementation docs
- `public/` — static web assets
- `__tests__/` / `__mocks__/` — automated test support

The previous top-level `agent/` runtime has been retired and should not be recreated by default.

## What Should Not Live In The Root

Do not leave one-off screenshots, generated assets, browser output, temp folders, or ambiguous top-level folders at the repo root. Move durable references into `docs/references/`, screenshots into `docs/screenshots/`, and bulky historical material into `archive/` or out of the repo.

## Active Placement Rules

### Web code

- keep routes thin in `src/app/`
- put domain logic in `src/features/`
- use `src/components/`, `src/lib/`, and `src/hooks/` for shared primitives

### Database

- keep schema changes in forward migrations under `supabase/migrations/`
- do not edit applied historical migrations to remove old concepts; add cleanup migrations instead
- keep `src/lib/database.types.ts` aligned with the active schema

### Docs and artifacts

- product/architecture/ops knowledge -> `docs/context/`
- implementation plans/specs -> `docs/plans/`
- small durable reference inputs -> `docs/references/`
- screenshots worth keeping -> `docs/screenshots/`
- historical bulk material -> `archive/` or external storage

## Cleanup Rule

When a new folder or file appears in root, ask:

1. Is this active web code?
2. Is this a database asset or durable doc?
3. Is this a reference artifact that belongs under `docs/` or `archive/`?
4. Is this local/generated noise that should be ignored?

If the answer is not obvious, do not leave it in root by default.
