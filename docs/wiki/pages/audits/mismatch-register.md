---
title: Mismatch Register
status: active
updated: 2026-04-10
---

# Mismatch Register

This page records confirmed and suspected mismatches between docs, code, runtime behavior, and verification.

## Confirmed mismatches

### 1. README agent description is stale vs current architecture docs
- **Status:** confirmed
- **Evidence:** `README.md` says the agent is a Discord bot with `node-cron`; `AGENTS.md` and `docs/context/agent-patterns.md` say the runtime is now single-agent, reactive, and has no cron jobs or sweeps
- **Why it matters:** the public repo summary gives future coding agents and humans the wrong runtime model
- **Likely fix:** update `README.md` to match the current single-runtime reactive architecture

## Resolved mismatches

### 1. Local scratch Playwright file leaked into the normal web test loop
- **Status:** resolved on 2026-04-10
- **Evidence:** `vitest.config.ts` now excludes `tmp-playwright/**`, and `npm run check:web` passes again
- **Why it mattered:** local scratch output should not break the normal repo verification loop

## Suspected mismatches that need deeper audit

### 3. Agent memory may still carry scheduler-era operational guidance
- **Status:** needs audit
- **Evidence:** grep hits in `agent/MEMORY.md` reference scheduler behavior and old cron assumptions
- **Why it matters:** memory is runtime input, not just historical documentation
- **Next step:** read `agent/MEMORY.md` fully and separate current instructions from historical notes

### 4. Feature-module breadth may exceed current packaged product shape
- **Status:** needs audit
- **Evidence:** modules such as `assets`, `asset-follow-up-items`, `conversations`, and `operations-center` still exist while current product docs emphasize a narrower packaged surface
- **Why it matters:** these may be valid embedded support layers, or they may be partially dead remnants of the broader pre-reset app
- **Next step:** perform route/import ownership audit before deleting anything

## Verification snapshot
- `npm run type-check` ✅
- `npm run lint` ✅
- `npm run test` ✅
- `npm run build` ✅
- `npm run check:web` ✅
- `npm run check:agent` ✅ (from prior wiki pass; agent not changed in this slice)
