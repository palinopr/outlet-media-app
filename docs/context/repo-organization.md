# Repo Organization

## Mental model

Treat this repository as **two first-class systems in one repo**:

- `src/` — the web app
- `agent/` — the Discord/autonomous runtime

Everything else should either support one of those systems or stay clearly secondary.

## Top-level ownership

### Active product areas

- `src/` — active Next.js app code
- `agent/` — active agent runtime code, prompts, runtime memory, and agent-specific scripts
- `docs/` — durable product, architecture, ops, and historical implementation docs
- `supabase/` — database migrations and Supabase assets
- `public/` — static web assets
- `__tests__/` — automated web-app test code that still participates in the repo verification story
- `__mocks__/` — minimal root-level test stubs still wired into Vitest resolution

### Reference and archive areas

- `docs/references/` — small durable reference material worth keeping in git
- `docs/screenshots/` — screenshots or visual artifacts worth keeping alongside docs
- `archive/` — large historical or legacy material that should stay out of the active development surface

## What should not live in the root

Do **not** leave these at the repo root:

- legacy website source folders
- one-off screenshots or generated images
- local browser/tool output
- temporary scratch folders
- ambiguous duplicate ownership folders

The root should mostly answer: **what are the active systems in this repo?**

## Local and generated artifacts

These are not part of the architecture story and should be gitignored/local-only unless there is a deliberate reason to retain them:

- `.next/`
- `node_modules/`
- `.playwright-mcp/`
- `.opencode/`
- `.superpowers/`
- `output/`
- `session/`
- `tmp/`
- `root-next-artifact-*`
- `opencode.json`
- `supabase/.temp/`
- `*.tsbuildinfo`

If a local artifact becomes worth preserving, move the specific useful output into `docs/screenshots/` or `docs/references/` instead of keeping a whole scratch directory in root.

## Archive rules

Use `archive/` only for material that is still worth retaining in-repo but should not compete with active code.

Current examples:

- `archive/website-legacy/` — bulky historical website source/reference inputs
- `archive/agent-profiles-legacy/` — older non-runtime agent profile material that should not be confused with `agent/`

If archived material is not needed for normal development and is large enough to create repo drag, prefer moving it out of the repo entirely.

## Naming rules

- `agent/` is the active runtime project
- do not create another top-level folder with a nearly identical name that collides with it
- prefer explicit names for secondary materials (`archive/agent-profiles-legacy/`, `docs/references/…`) instead of vague duplicates

Follow `docs/context/salvage-map.md` before keeping or expanding non-core product areas in active paths.

## Placement rules

### New web code

- keep routes thin in `src/app/`
- put domain logic in `src/features/`
- use `src/components/`, `src/lib/`, and `src/hooks/` only for genuinely shared primitives

### New agent code

- keep executable runtime code under `agent/src/`
- keep agent-specific scripts under `agent/scripts/`
- keep prompts, memory, and skills under explicit agent-owned folders inside `agent/`

### New docs and artifacts

- product/architecture/ops knowledge -> `docs/context/`
- implementation plans/specs -> `docs/superpowers/` or the repo’s chosen planning area
- small durable reference inputs -> `docs/references/`
- historical bulk material -> `archive/` or external storage
- screenshots worth keeping -> `docs/screenshots/`

## Cleanup rule

When a new folder or file appears in root, ask:

1. Is this active web code?
2. Is this active agent runtime code?
3. Is this a durable doc?
4. Is this a reference artifact that belongs under `docs/` or `archive/`?
5. Is this just local/generated noise that should be ignored instead?

If the answer is not obvious, do not leave it in root by default.
