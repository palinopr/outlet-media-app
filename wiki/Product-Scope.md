---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/context/product-direction.md
  - docs/context/architecture-reset.md
  - docs/context/salvage-map.md
  - docs/context/agent-patterns.md
---

# Product Scope

## Direction

Outlet Media is a client-facing autonomous-agency operating system, but the current shipped product is deliberately smaller than the long-term vision.

The active web product should focus on:

- Campaigns
- Admin-managed clients, users, memberships, branding, and portal packaging

Client-facing campaign pages should stay read-only and analytics-first for now. Do not add request/comment boxes, reports tabs, events tabs, or workflow panels unless there is a clear customer need and an explicit product decision.

## Product principles

- Build for shared visibility between Outlet operators and clients.
- Support summary-first dashboards before deeper workflow views.
- Keep collaboration and workflow internal until it is clearly useful enough to expose.
- Prefer guided execution: show what happened, what matters, what is blocked, and what needs a human decision next.
- Use structured domain objects and `system_events` rather than route-local status blobs.
- Build one complete vertical slice at a time; remove dead surfaces instead of preserving placeholders.

## What to avoid now

- No placeholder product pages or parked tabs.
- No duplicate client surfaces for the same workflow.
- No standalone CRM, workspace, updates, conversations, approvals, reports, or events apps unless explicitly restored.
- No agent/chat product surface or background agent runtime for now.
- No client request/comment panels by default.

## Architecture reset decisions

The reset target is a smaller, maintainable web product centered on Campaigns and the admin access backbone.

Current decisions:

- Remove unfinished standalone surfaces rather than preserving dead navigation.
- Keep Campaigns as the active client/admin product core.
- Keep Events and Reports retired as navigable surfaces; direct URLs should redirect to Dashboard/Campaigns or remain absent.
- Keep the shipped client campaign experience analytics-first.
- Treat `system_events` as the shared product activity timeline.
- Keep route handlers thin and feature modules reusable.
- Retire agent runtime/product code for now.

## Removed scope

The reset deleted or retired:

- admin Agents page and web agent endpoints
- client Agent tab and client agent chat APIs
- agent task/outcome loaders and widgets
- top-level Discord/runtime agent project
- standalone Events and Reports surfaces while the baseline is Campaigns-only
- standalone workflow surfaces that duplicated campaign context
- client/admin request tabs, comment forms, and request APIs that added workflow breadth without current product value

Historical migrations may still show how older tables were introduced, but new code should not depend on retired concepts. Cleanup migrations remove active agent tables/columns and retired portal toggles from the database.

## Agent runtime status

Outlet's web product does not currently ship an agent runtime, agent chat surface, or client-facing Agent tab.

The prior Discord/runtime implementation, web agent endpoints, client agent chat, agent outcome loaders, and agent task tables were removed during the April 2026 cleanup. Do not rebuild them by default.

If agents return later, reintroduce them as a deliberate product decision with a small, event-driven slice, clear approval boundaries, durable ledgers, and tests.

## Salvage map

Keep active:

- `src/app/admin/campaigns`
- `src/app/admin/clients`
- `src/app/admin/users`
- `src/app/client/[slug]/campaigns`
- shared feature modules that power Campaigns/account access
- Supabase migrations and generated active DB types

Retired / do not rebuild by default:

- broad workspace/client app surfaces
- approvals, conversations, updates, CRM, reports, events, action items, follow-up, or asset centers outside the core pages
- direct admin/client Events and Reports routes while those surfaces remain retired
- old agent runtime, admin agent page, client agent tab, task queue, and outcome widgets
- one-off scripts and local artifacts at the repo root

## Rebuild rule

If a removed surface returns, rebuild it only through:

1. explicit product decision,
2. a small vertical slice,
3. shared domain objects,
4. access tests,
5. auditability through `system_events`, ledgers, or product tables,
6. explicit verification.

Do not resurrect old route-local logic or hidden background queues for convenience.
