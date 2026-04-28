---
title: Dead Ends and Dead Code
status: active
updated: 2026-04-27
---

# Dead Ends and Dead Code

This page tracks likely cleanup targets and the evidence standard required before deletion.

## Confirmed dead-end / hygiene issue

### Retired client overview support components
- **Removed:** `src/app/client/[slug]/components/campaign-card.tsx`, `campaign-section.tsx`, `date-range-picker.tsx`, and `stat-card.tsx`
- **Removed:** the old aggregate portal loader from `src/app/client/[slug]/data.ts`
- **Why it was a problem:** the active client surface now routes directly through Campaigns, Reports, optional Events, and optional Agent instead of keeping a parallel overview/card data path alive
- **Classification:** deleted dead client code
- **Action:** keep future client analytics work in the surviving route-specific loaders/components unless a shared feature module removes real duplication

### `tmp-playwright/`
- **Current state:** untracked local folder at repo root
- **Why it is a problem:** it is local scratch output and should never shape the normal repo verification loop
- **Classification:** quarantined local-artifact issue
- **Action:** `vitest.config.ts` now excludes `tmp-playwright/**`; keep treating the folder as local scratch and do not let it become part of shipped paths

## Audited support modules to keep

### `src/features/operations-center/`
- **Audit result:** keep as a small support helper, not a standalone surface
- **Evidence:** `src/features/agents/summary.ts` imports `countActionableAgentOutcomes`, and `__tests__/features/operations-center/summary.test.ts` covers the helper
- **Current classification:** embedded support module

### `src/features/conversations/`
- **Audit result:** keep as embedded discussion aggregation for dashboard/admin context
- **Evidence:** `src/features/dashboard/server.ts` imports `listConversationThreads`, and conversation tests cover scope filtering and summary behavior
- **Current classification:** embedded support module

### `src/features/assets/` and `src/features/asset-follow-up-items/`
- **Audit result:** keep as support code for campaign/admin workflow visibility and scoped reads
- **Evidence:** active imports exist from campaigns, approvals, notifications, conversations, and agent-outcome readers
- **Current classification:** embedded support module

## Dead-code candidates that require proof

No current candidates after the April 27 audit. Future candidates should only be added with route/import evidence.

## Important caution

Do not delete based only on naming or old product packaging.

For each candidate, confirm:
1. no active route imports it for shipped behavior
2. no tests prove it as current behavior
3. no feature module depends on it transitively
4. current docs do not still require the underlying domain object

## Output expectation for future passes

For each candidate module, the next audit pass should produce:
- owning routes
- importing modules
- whether behavior is user-visible
- whether it matches the reset
- recommendation: keep / merge / redirect / delete
