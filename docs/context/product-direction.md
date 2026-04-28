# Product Direction

Outlet Media is a client-facing autonomous-agency operating system, but the current shipped product is intentionally narrower than the long-term vision.

## Current Core

The active web product should focus on:

- **Campaigns**
- **Events** (enabled per client)
- **Reports**
- Admin-managed clients, users, memberships, branding, and portal packaging

Approvals, discussions, assets, activity, and follow-up work should live inside campaign, event, report, and admin account surfaces before earning standalone routes.

## What To Avoid Right Now

- No placeholder product pages or parked tabs.
- No duplicate client surfaces for the same workflow.
- No standalone CRM/workspace/updates/conversations/approvals apps unless explicitly restored.
- No agent/chat product surface or background agent runtime for now.

## Product Principles

- Build for shared visibility between Outlet operators and clients.
- Support both summary-first dashboards and deeper workflow views.
- Keep collaboration attached to the relevant campaign, event, report, client, asset, or action item.
- Prefer guided execution: show what happened, what matters, what is blocked, and what needs a human decision next.
- Use structured domain objects and `system_events` rather than route-local status blobs.
