---
title: Feature Modules
status: active
updated: 2026-04-10
---

# Feature Modules

This page is a high-level map of what each `src/features/*` area appears to contain.

For file-by-file detail, use the generated catalog pages linked from:
- [Repo File Catalog](../catalog/manifest.md)

## Primary product-facing areas

| Module | High-level role |
|---|---|
| `client-portal` | client entry, portal access, shell, theme, and scope helpers |
| `campaigns` | campaign data and detail support |
| `events` | event data and detail support |
| `reports` | report data and report-facing shared logic |
| `client-agent` | client-facing agent runtime, policy, tools, store, and UI pieces |
| `clients` | admin client/account data helpers |
| `users` | admin user/access helpers |
| `invitations` | invite ledger, pending-access flow, and onboarding helpers |
| `agents` | admin agent summary/support helpers |
| `dashboard` | summary-first dashboard loaders and summaries |
| `system-events` | shared system-event listing and filtering |

## Embedded workflow/support areas

| Module | High-level role |
|---|---|
| `campaign-comments` | embedded campaign discussion support |
| `campaign-action-items` | campaign-native follow-up items |
| `event-follow-up-items` | event-native follow-up items |
| `agent-outcomes` | visible agent follow-through and outcome helpers |
| `notifications` | route-aware notifications and discussion broadcasts |
| `approvals` | approval object support and related loaders |
| `workflow` | shared workflow revalidation and helper utilities |
| `access` | scope and access helpers |
| `settings` | admin settings/support summaries |
| `shared` | shared feature-level support code |

## Additional feature areas present in the tree

| Module | High-level role |
|---|---|
| `assets` | asset-related summaries, readers, and server helpers |
| `asset-follow-up-items` | asset-linked follow-up helper layer |
| `conversations` | conversation/discussion support helpers |
| `operations-center` | operations-center summary helper layer |

## How to read this page

This page is intentionally descriptive, not evaluative.

If you want exact files inside any feature area, open its generated catalog page from [Repo File Catalog](../catalog/manifest.md).
