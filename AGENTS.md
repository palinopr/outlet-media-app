# Outlet Media -- Project Instructions

> Project-specific instructions for Claude Code. General coding standards live in CLAUDE.md.

## Stack

- Frontend/API: Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, shadcn/ui
- Auth: Clerk (middleware is `src/proxy.ts`, not `middleware.ts`)
- DB: Supabase (`https://dbznwsnteogovicllean.supabase.co`)
- External APIs: Ticketmaster, Meta Marketing API
- Agent: `agent/` -- autonomous Claude agent with Discord bot + node-cron

## Product Direction

- Outlet Media is not just a workspace app or a Notion clone. It is a **client-facing autonomous agency operating system**.
- The product should let internal team members, clients, contractors, and agents work in the same environment with shared visibility.
- The UI can borrow strong Notion-style patterns (sidebar, docs, comments, nested pages, block editing), but the product model should be centered on **agency operations**, not generic documents.
- Current active product core during this reset:
  - Campaigns
  - Reports / results
  - Events
  - optional client `Agent` as a read-only conversational reporting surface
- Supporting workflow concepts such as approvals, discussions, assets, activity, and agent follow-through should stay embedded inside those surviving campaign/event/report/admin surfaces before they earn their own standalone app again.
- The long-term direction is still to make Outlet an AI-enabled environment where clients can run major parts of their business with guidance, automation, and full visibility, but the current shipped product should stay intentionally narrower than that long-term model.

## Product Principles

- Build for **shared visibility**: clients should feel included, informed, and guided rather than locked out of the work.
- Build for **dual visibility modes**: some users need a simple dashboard with graphs and KPIs, while others need deeper workflow/collaboration views. Support both.
- Build for **collaboration around context**: work should stay attached to the relevant campaign, client, asset, event, or task instead of being scattered across tools.
- Build for **agent actionability**: agents should react to real system events and structured data, not just ad hoc chat.
- Build for **guided execution**: the system should help users understand what happened, what matters, what is blocked, and what should happen next.
- Build for **multi-app extensibility**: assume more apps will be added over time for customers, not just ads and ticketing.

## Current Packaging Rules

- The current active product reset target is intentionally narrow:
  - `Campaigns`
  - `Events`
  - `Reports`
- Treat those three areas as the product core for cleanup and architecture decisions until a later explicit product decision changes that scope.
- Client portal packaging is controlled from Outlet admin. Each client account should have one admin-managed source of truth for enabled apps, branding, portal URL metadata, and memberships.
- Treat the client account record and `client_members` as the authority for portal access. Do not treat Clerk `publicMetadata.client_slug` or URL slug values as the business source of truth for invites, memberships, or landing behavior.
- Keep `Events` optional per client account. Campaigns are universal; reports are first-class when enabled; `Agent` is optional per client account and should stay off until explicitly enabled by Outlet admin.
- Client-facing analytics, activity, approvals, comments, assets, and agent follow-through should live inside campaign and event views before earning their own top-level client routes.
- `Agent` may aggregate those same campaign and event insights conversationally, but it must stay read-only and must not expose internal structure, source systems, or admin-only workflow state.
- Client-facing web is primarily a reporting and visibility surface. Meta account connection, campaign creation, and live campaign mutation should stay internal/admin-only by default unless a later product decision explicitly reopens client self-serve execution.
- Do not ship client top-level apps for CRM, assets, approvals, conversations, updates, or workspace unless current customers clearly need them and the surface can be maintained without duplicating workflow logic.
- Admin web should preserve the required account/access backbone and the active product core, but should not keep broad standalone surfaces merely because they already exist.
- Keep Clerk, users, client accounts, memberships, invitations, and other access-governance primitives as required infrastructure.
- Do not treat CRM as part of the active standalone product surface during this reset unless a later explicit product decision restores it.

## Surface Selection

Outlet can be built on:
- **web**: admin/client app surfaces in Next.js
- **Discord**: internal control-plane agents and operator workflows
- **both**: shared backend state with coordinated web and Discord surfaces

In new chats, treat the user's surface choice as explicit when they say:
- "work on web"
- "work on Discord"
- "work on both"

Default interpretation when the user does not specify:
- client/admin product visibility, dashboards, workflows, and collaboration -> bias toward **web**
- owner-only or internal autonomous teams, publishing, inboxes, schedulers, and control-plane ops -> bias toward **Discord**
- if the workflow clearly needs shared visibility plus autonomous execution -> build **both** on one shared backbone

Do not create disconnected versions of the same workflow. Web and Discord work should share the same domain objects, ledgers, approvals, and `system_events` backbone.

## Architecture Priorities

- Prefer an **event-driven architecture**. Every meaningful action should be able to emit a structured event such as:
  - `asset_uploaded`
  - `campaign_updated`
  - `approval_requested`
  - `report_generated`
  - `client_comment_added`
  - `agent_action_requested`
  - `agent_action_completed`
- Treat agents as bounded workers that inspect events, decide next actions, draft work, request approval, and log outcomes.
- When agent work produces a recommendation, blocker, or failure, make it convertible into first-class campaign follow-up work instead of leaving it as a passive status row.
- Treat the workspace/editor layer as the **shell**, not the full product. Core business entities should not be hidden inside generic docs when they need first-class models.
- Client onboarding should resolve through one canonical portal-entry flow: create client account -> invite member -> member signs in/up -> lands in the correct portal or pending screen without false "no access" states.
- Campaign-native next steps should live in first-class campaign workflow objects, not only generic workspace tasks.
- Traditional dashboards and reporting views should remain first-class surfaces for summary-first users.
- Dashboard summary surfaces should be derived from the same approvals, action items, comments, and `system_events` backbone as deeper workflow views, not from duplicated ad hoc summary state.
- Summary-first dashboards should still surface the next human actions clearly, especially pending approvals and unresolved campaign discussion.
- Until the worker runtime writes explicit completion events, product-facing agent outcome views should derive state by joining `agent_tasks` to the corresponding `agent_action_requested` `system_events` entry keyed by task id.
- When making product or refactor decisions, prefer designs that make the app feel like a coherent operating system across admin and client views.
- `system_events` is the shared product timeline for admin/client-visible activity.
- `approval_requests` is the first-class approval object. Use it for requests that need an explicit yes/no/cancel decision.
- `admin_activity` is the internal operator audit log. Do not treat it as the main product activity backbone.
- Owner email is a private Discord control-plane workflow, not a default web app surface. Keep owner inbox triage in Discord `#email` / `#email-log`; treat `email_events`, `email_drafts`, and related tables as durable backend state for that Discord flow unless a future product decision explicitly asks for a web email app.
- Internal growth and customer-acquisition teams should also be Discord-first control-plane workflows, not default web app surfaces. Treat platform operations, content production, publishing, community triage, and lead routing as durable backend state and task ledgers behind Discord channels unless a later product decision explicitly asks for a dedicated app.
- For new autonomous internal teams, separate supervisors, workers, executors, and evaluators. Strategy agents should not publish, send, spend, or mutate live systems directly; only bounded executor/publisher agents should perform approved side effects.
- For new autonomous internal teams, do not rely on prompt text plus markdown memory alone. Mirror the email-agent pattern with structured ledgers for events, drafts, examples, corrections, outcomes, and promoted playbooks so the system can learn from real outputs and real owner feedback.
- If an existing implementation is clearly built in a way that will not scale, do not keep extending it just for short-term convenience. Refactor it toward the correct shared architecture.
- When refactoring a weak pattern into the correct one, update `docs/context/` or `AGENTS.md` in the same pass so future sessions inherit the lesson.

## Execution Expectations

- Operate like the senior implementation owner for the current slice of work. Do the implementation, cleanup, verification, and follow-through end to end when the repo and tools make that possible.
- When the user asks to build, assume autonomous delivery by default on the requested surface (`web`, `Discord`, or `both`) unless they explicitly ask for planning or design only.
- Build the shared primitives once, then ship one complete vertical slice at a time. Do not try to build the whole agency, every platform, or every pod in one pass.
- When a slice reaches its first real end-to-end path, stop expanding scope and switch to stabilization. In practice, that means stop adding new agents, channels, routes, or platforms once the current slice has the domain model, routing, approvals, executor path, and user-visible outcome wired together.
- Treat any slice that touches live side effects, approvals, concurrency, schedulers, or cross-surface state as test-first after wiring. At that point, the next work should bias toward verification, fixtures, manual runbooks, evals, and bug fixing instead of more breadth.
- Do not leave testing to the user if the agent can run it. For every completed slice, run the relevant verification yourself:
  - `npm run type-check` at minimum for app changes
  - targeted lint for the touched files
  - targeted tests when the code path already has test coverage or a focused test is practical
- For new autonomous workflows, the minimum "stop building and test now" gate is:
  - one end-to-end happy path works
  - approval rules are enforced
  - side effects are logged in durable ledgers
  - retry/idempotency behavior has at least one explicit verification path
  - the operator or user can see what happened from the product or Discord surface without reading raw logs
- If a useful verification step cannot be run, say exactly what blocked it instead of silently skipping it.
- When the user wants autonomous delivery, commit and push only the relevant changes after verification. Do not bundle unrelated dirty files into the commit.
- After a verified app push, run `railway up --detach`.
- When a durable engineering lesson is learned, capture it in `docs/context/` or this file before finishing.
- Do not guess about library behavior, API contracts, framework changes, SDK usage, or current implementation patterns.
- If there is any meaningful uncertainty, check primary sources first.
- For library/framework/API behavior, prefer Context7 MCP first.
- For repository-specific implementation details or upstream source examples, prefer GitHub MCP.
- If Context7 or GitHub MCP is unavailable or insufficient, say that explicitly and use the next-best primary source instead of pretending certainty.

## No Garbage Rules

- No dead nav items. If a surface is not part of the current product, remove it from navigation and redirect or gate direct routes in the same pass.
- No placeholder product pages, parked tabs, or "coming soon" routes in shipped admin/client surfaces.
- No duplicate surfaces for the same job. If campaign/event pages already own the client context, do not also ship separate client inbox, updates, approvals, CRM, or workspace flows that partially repeat it.
- No route-local rewrites of shared business logic. Extract or reuse feature modules instead of creating another loader or mutation path that drifts.
- No indefinite compatibility clutter. When a new surface replaces an old one, either delete the old path after stabilization or keep one explicit redirect path. Do not leave both alive by default.
- No speculative UI breadth. If a page does not solve a current customer or operator problem in this slice, do not expose it yet.
- No hidden rebuild debt. If a piece of code is weak enough that it obviously has to be replaced soon, refactor it now or quarantine it outside shipped paths instead of building more features on top of it.

## Codex Workflow

- Scope one Codex thread to one deliverable: one bugfix, one feature branch, or one PR review pass.
- Reuse the same thread only while the work stays on the same branch and diff. Start a new thread after merge, when the task changes, or when the conversation accumulates stale context.
- Work from the main checkout unless there is a specific reason to do otherwise.
- Keep one active Codex thread per branch. Do not let two Codex threads edit the same files at once.
- Codex-created branches should use the `codex/` prefix.
- Use the repo's checked-in scripts, package commands, and documented verification loops for the common app and agent workflows. Do not assume an optional Codex environments file exists unless it is actually present in the checkout.
- Use `.github/workflows/codex-pr-review.yml` when you want a manual Codex review pass posted back to GitHub.

## Persistent Context

- Before major product, architecture, or agent work, read:
  - `docs/context/product-direction.md`
  - `docs/context/engineering-principles.md`
  - `docs/context/agent-patterns.md`
  - `docs/context/current-priorities.md`
- When the system feels too broad, too prompt-driven, or split across too many parallel surfaces, also read `docs/context/architecture-reset.md`.
- Before TM1 seat-map inventory or staged seating changes, also read `docs/context/tm1-dynamic-seating.md`.
- Before browserless TM1 automation or seat-move API changes, also read `docs/context/tm1-browserless-api.md`.
- For Codex operating changes, branch conventions, or prompt hygiene decisions, also read `docs/context/codex-workflow.md`.
- For Codex browser MCP failures, prefer the official `chrome-devtools-mcp --autoConnect` path, verify Chrome remote debugging is actually serving `127.0.0.1:9222`, and avoid stacking Playwright/profile workarounds before DevTools is healthy.
- When a durable implementation pattern or architectural lesson is discovered, update `docs/context/` or this `AGENTS.md` so future sessions inherit it.
- Prefer storing durable project context in repo docs rather than relying on transient conversation history.
- Treat `docs/plans/` and `docs/screenshots/` as historical reference, not current truth.

## Repo Organization Rules

- Treat the repo as two first-class systems: `src/` for web and `agent/` for the active Discord/autonomous runtime.
- Keep the repo root focused on active systems, core config, docs, and database assets.
- Put small durable reference material under `docs/references/` and screenshots worth keeping under `docs/screenshots/`.
- Put bulky historical material under `archive/` or move it out of the repo entirely when it is no longer useful for normal development.
- Do not leave one-off screenshots, exported assets, browser output, temp folders, or generated files at the repo root.
- Do not create ambiguous top-level folders that visually collide with active system ownership.
- Follow `docs/context/repo-organization.md` and `docs/context/salvage-map.md` before adding new top-level folders, preserving non-core systems, or relocating major material.

## Key Paths

| Area | Path |
|------|------|
| Admin pages | `src/app/admin/` (dashboard, campaigns, events, agents, clients, users) |
| API routes | `src/app/api/` (ingest, meta, ticketmaster, agents, alerts, admin) |
| Client portal | `src/app/client/[slug]/` |
| Shared app logic | `src/features/` |
| Supabase client | `src/lib/supabase.ts` |
| DB types | `src/lib/database.types.ts` |
| Migrations | `supabase/migrations/` |
| Agent code | `agent/src/` (services, events, agents, jobs) |
| Tracked agent scripts | `agent/scripts/` |
| Agent prompts | `agent/prompts/` (boss.txt, media-buyer.txt, etc.) |
| Agent memory | `agent/MEMORY.md` |
| Agent runtime skills | `agent/skills/` |
| Ephemeral agent runtime scratch | `agent/session/` (gitignored; do not put durable tooling here) |
| Durable architecture context | `docs/context/` |
| Repo organization guide | `docs/context/repo-organization.md` |
| Durable references | `docs/references/` |
| Historical archive | `archive/` |
| Execution plans | `docs/plans/` |

## Data Conventions

- Monetary values in Supabase: **cents** (bigint). Display with `centsToUsd(n)`.
- Meta API `spend` is a dollar string -- multiply by 100 for Supabase. `daily_budget` is already cents.
- ROAS: stored as float (e.g. 8.4), not cents or percentage.
- Client slugs: `zamora`, `kybba`, `beamina`, `happy_paws`, `unknown`
  - Zamora sub-brands: campaigns containing "arjona", "alofoke", "camila" map to slug `zamora`

## Meta Ad Creative Rules

- Always use **separate creatives** for Post and Story placements
- Use `asset_feed_spec` with `asset_customization_rules` to split by placement
- Label convention: `{city}_post_v` / `{city}_story_v` (videos), `{name}_post` / `{name}_story` (images)
- Never create single-video/single-image ads -- always split post + story

## Deployment

Railway is the production host. It does NOT auto-deploy from git push.

After every `git push`, run: `railway up --detach`

- Railway project: `outlet-media-app`
- Live URL: `https://outlet-media-app-production.up.railway.app`

## Agent Architecture

Multi-agent Discord system with per-agent concurrency:
- **Services**: webhook, queue (Supabase ledger), approval (3-tier: Green/Yellow/Red), status (presence rotation)
- **Events**: message handler (routing), trigger handler (ROAS/capacity alerts), inspect handler (#agent-internals)
- **Agents**: delegate (structured JSON delegation), spawner (dynamic agent creation)
- **Jobs**: `cron-sweeps.ts` (10 sweep jobs, start OFF, enable via `!enable <job>`)
- **Config**: `discord-router.ts` (channel->agent mapping), `rules.json` (approval thresholds)
- Discord layout: 17 channels, 8 categories
- 5 core cron jobs run unconditionally on startup (heartbeat, TM check, Meta sync, think cycle, Discord health)
- Owner email triage is Discord-first and owner-only. Do not add a parallel admin/client web inbox by default; improve the Discord operating surface instead.
- Owner meeting scheduling is also Discord-first and owner-only in `#meetings`, backed by Google Calendar API rather than a separate shared web surface by default.
- Local agent runtimes should run under a restart loop or process manager, not only an ad hoc foreground shell, so pending work resumes after crashes.
- Internal growth-team work should follow the same Discord-first model: use Discord channels and threads as the operating surface, `agent_tasks` as the execution queue, `system_events` as the durable timeline, and feature-specific ledgers for examples, corrections, and measured outcomes.
