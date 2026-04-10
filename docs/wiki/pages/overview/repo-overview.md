---
title: Repo Overview
status: active
updated: 2026-04-10
---

# Repo Overview

Outlet is currently shaped as two active systems in one repo:
- `src/` — the Next.js web app
- `agent/` — the single Discord/admin-runtime agent

The durable product docs define the current active product core as:
- Campaigns
- Reports
- Events
- optional client Agent surface
- client/account access backbone

## Current architecture understanding

### Web
The web app uses:
- Next.js App Router
- Clerk auth
- Supabase
- feature modules under `src/features/**`
- thin routes under `src/app/**`

Current shipped shape worth noting:
- client navigation is already narrowed to campaigns, reports, events, and optional agent
- client campaign detail now mixes analytics with the shared operating loop panels for approvals, discussion, next steps, agent follow-through, and recent activity instead of acting as a charts-only page

### Agent
The agent docs describe a simplified single-runtime system:
- one runtime
- one prompt
- no cron jobs
- no autonomous sweeps
- work starts from Discord or supported persisted `agent_tasks`

## Primary navigation for this wiki

The main entrypoint is now the generated file catalog:
- [Repo File Catalog](../catalog/manifest.md)
- [Working Tree Snapshot](../catalog/working-tree.md)

Use the catalog first when you need to answer:
- which files exist
- what each file contains at a high level
- which files are modified or untracked right now

Use the overview and inventory pages after that for higher-level context.

## Important root files
- `AGENTS.md` — repo operating rules and current product shape
- `README.md` — short project summary, but currently has at least one drift item vs current agent architecture
- `package.json` — root verification and dev commands
- `vitest.config.ts` — web test sweep config
- `src/proxy.ts` — Clerk middleware/proxy entry
- `src/lib/database.types.ts` — generated DB typing surface
- `agent/prompts/agent.txt` — single runtime prompt
- `agent/MEMORY.md` — runtime memory file; needs careful drift review because memory affects behavior

## Initial audit priority

The first value of this wiki is not a pretty summary. It is to help future coding agents quickly answer:
- what is active
- what is legacy
- what is inconsistent
- what should be deleted, redirected, or rewritten

That means the next useful passes are:
1. route reachability audit
2. feature-module ownership audit
3. stale-doc and stale-memory audit
4. local artifact and verification-hygiene audit
