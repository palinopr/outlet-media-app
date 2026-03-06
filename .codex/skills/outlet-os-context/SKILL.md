---
name: outlet-os-context
description: Use when working on product architecture, app structure, domain modeling, event-driven workflows, or agent patterns in the outlet-media-app repo. This skill loads the project's operating-system direction so implementation stays aligned with the client-facing autonomous agency product vision.
---

# Outlet OS Context

Use this skill when the task is about:
- product direction
- architecture decisions
- app boundaries
- domain models
- event systems
- agent-triggered workflows
- deciding what should be first-class product state versus generic page content

## Read First

Before making product-level decisions, read:
- `docs/context/product-direction.md`
- `docs/context/engineering-principles.md`
- `docs/context/agent-patterns.md`

## Core Rules

- Treat the workspace/editor layer as the shell, not the full product.
- Prefer first-class entities for campaigns, assets, CRM, approvals, tasks, reports, and agent jobs.
- Prefer event-driven workflows over manual glue code.
- Keep admin and client surfaces on the same underlying system.
- Design agents as bounded workers with explicit triggers, actions, approvals, and logs.

## When You Learn Something Durable

If a new pattern becomes repeatable, update `docs/context/` or `AGENTS.md` before finishing.
