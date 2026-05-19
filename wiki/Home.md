---
status: canonical
last_updated: 2026-05-19
audience: humans, LLMs, coding agents
---

# Outlet Media Knowledge Wiki

This wiki is the **single knowledge source of truth** for Outlet Media's web app, operations, architecture, and AI-agent workflow.

Repo Markdown files outside `wiki/` should be short bootstrap pointers only. Do not rebuild a second knowledge base in `docs/`, `README.md`, issues, prompts, or agent notes.

## Non-negotiables

- Do not put secrets, tokens, credentials, private keys, or private client PII in this wiki.
- Durable product/engineering/ops knowledge belongs here first.
- If a repo pointer disagrees with the wiki, treat the wiki as canonical and fix the pointer.
- Historical screenshots/assets can stay under `docs/screenshots/`, `docs/references/`, or `archive/`, but explanatory docs should live here.
- This wiki is plain Markdown and can be opened with Obsidian, Foam, Logseq, VS Code, or synced to GitHub Wiki.

## Current product in one paragraph

Outlet Media is a client-facing autonomous-agency operating system, but the shipped web product is intentionally narrow: **Campaigns** plus **admin account/access management**. Events, Reports, ticketing workflows, broad workspace/collaboration surfaces, and agent runtime surfaces are retired unless a new explicit product decision restores them. Public client funnel exceptions are allowed when explicitly live: `/9am/orlando` and `/ataca-sergio/newark` are active and protected from cleanup.

## Read path by task

| Task | Read first |
| --- | --- |
| Any product or architecture work | [Current State](./Current-State.md), [Product Scope](./Product-Scope.md), [Engineering Principles](./Engineering-Principles.md) |
| Campaign reporting, Meta ads, attribution | [Campaigns and Meta Ads](./Campaigns-And-Meta-Ads.md) |
| Supabase schema, data repair, migrations | [Data and Supabase](./Data-And-Supabase.md) |
| Deploys, production smoke, env names | [Deployment and Production](./Deployment-And-Production.md) |
| Codex/LLM/operator workflow | [AI Codex Workflow](./AI-Codex-Workflow.md) |
| Old audits, retired docs, screenshots | [Archive](./Archive.md) |

## Active code map

| Area | Path |
| --- | --- |
| Admin pages | `src/app/admin/` |
| API routes | `src/app/api/` |
| Client portal | `src/app/client/[slug]/` |
| Public funnels | `src/app/9am`, `src/app/ataca-sergio`, `public/9am`, `public/ataca-sergio` |
| Shared app logic | `src/features/` |
| Shared infrastructure/helpers | `src/lib/` |
| Supabase migrations | `supabase/migrations/` |
| Canonical knowledge | `wiki/` |

## Default verification

For normal web app changes:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

The combined gate is:

```bash
npm run check
```

Do not add Playwright, screenshots, browser reports, or broad E2E machinery by default. Add browser automation only when a specific auth-critical browser behavior cannot be proven with focused tests.

## Deployment rule

Railway hosts production and does **not** auto-deploy from git push.

After a verified app push, run:

```bash
railway up --detach
```

See [Deployment and Production](./Deployment-And-Production.md) for the full smoke checklist.
