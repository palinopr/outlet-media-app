---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/references/active-code-audit.md
  - docs/screenshots/README.md
  - docs/references/README.md
---

# Archive

This page preserves short historical notes that are useful context but are not active product direction.

## Historical reference policy

- Use `docs/screenshots/` for screenshots, visual comparisons, and implementation snapshots.
- Use `docs/references/` for small durable input artifacts that are still useful to keep in git.
- Use `archive/` or external storage for bulky historical material.
- Do not leave local scratch output, generated browser/test artifacts, or temporary planning leftovers in the repo root.
- Explanatory documentation belongs in `wiki/`, not `docs/context/` or generated wiki folders.

Screenshots and references are supporting material only. They are not the source of truth for current product direction or architecture.

## Active code audit — 2026-04-28

Scope: narrowed Outlet web baseline only — admin Dashboard, Campaigns, Clients, Users, Settings; client Campaigns portal; public landing/legal/contact/health/Meta deletion endpoints.

Automated inventory:

- Active non-test `src` TypeScript/React files: 200
- App/proxy/instrumentation entry files: 60
- Import-graph unreachable active files: 0
- Retired surface scan found no active Ticketmaster/TM1, WhatsApp/concierge, Google Ads, Shopify, agent, approval, conversation, workspace, CRM, or ticketing product code. Remaining string hits were documentation/privacy copy or `user_agent` telemetry.

Active route/API posture:

- Admin routes stay behind Clerk admin layout.
- Client routes resolve through DB-backed `client_members` / invite acceptance before access.
- Public APIs are limited to contact, ingest, health, Meta callback, and Meta data deletion.
- Mutating JSON APIs have request size guards; public APIs also have IP rate limits or signed/secret validation.
- Events/Reports direct routes were removed after the active baseline narrowed to Campaigns and account access.

Cleanup/fixes completed in that audit:

- Removed unused landing components, obsolete landing CSS helpers, old client portal re-export files, and unused text/client-detail helpers.
- Replaced route-local client portal helper imports with feature-level `features/client-portal/*` imports.
- Hardened `fetchAllCampaigns()` so Meta failures are no longer silently treated as successful empty data.
- Added Supabase campaign fallback for campaign lists when Meta credentials/API are unavailable.
- Preserved DB campaign ownership metadata during live Meta reads.
- Tightened admin invite handling for existing admin users and pending admin invitations.
- Added request size guards and stronger DB error checks on active admin/user/observability APIs.
- Fixed Telegram workflow alert scripts to run Node ESM when using top-level `await`.

Follow-up from that audit:

- Rotate the Telegram bot token that was pasted in chat.
- Run one controlled real invite acceptance test with an email the owner controls.
- Continue 24-hour production monitor observation after deploy.

## Retired docs mapping

The previous `docs/context/` and `docs/references/*.md` files were consolidated into this wiki to avoid duplicate sources of truth.

| Old docs area | New wiki page |
| --- | --- |
| `docs/context/current-priorities.md`, `active-surface-map.md`, `production-operating-baseline.md`, `docs/references/current-project-map.md` | [Current State](./Current-State.md) |
| `product-direction.md`, `architecture-reset.md`, `salvage-map.md`, `agent-patterns.md` | [Product Scope](./Product-Scope.md) |
| `engineering-principles.md`, `repo-organization.md` | [Engineering Principles](./Engineering-Principles.md) |
| `campaign-data-quality.md`, `meta-ads-playbook.md` | [Campaigns and Meta Ads](./Campaigns-And-Meta-Ads.md) |
| `database-safety-runbook.md`, `supabase-backup-restore-runbook.md` | [Data and Supabase](./Data-And-Supabase.md) |
| `production-smoke-runbook.md`, `production-operating-baseline.md` | [Deployment and Production](./Deployment-And-Production.md) |
| `codex-workflow.md` | [AI Codex Workflow](./AI-Codex-Workflow.md) |
| `active-code-audit.md`, screenshot/reference READMEs | this page |
