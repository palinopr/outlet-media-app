# Product Direction

Outlet Media is a client-facing autonomous-agency operating system, but the current shipped product is intentionally narrower than the long-term vision.

## Current Core

The active web product should focus on:

- **Campaigns**
- Admin-managed clients, users, memberships, branding, and portal packaging

Events and Reports are not active navigable surfaces right now. Keep those direct routes absent unless a later product decision restores them.

Client-facing campaign pages should stay read-only and analytics-first for now. Do not add request/comment boxes, reports tabs, events tabs, or workflow panels back onto those pages unless there is a clear customer need.

## What To Avoid Right Now

- No placeholder product pages or parked tabs.
- No duplicate client surfaces for the same workflow.
- No standalone CRM/workspace/updates/conversations/approvals apps unless explicitly restored.
- No agent/chat product surface or background agent runtime for now.

## Product Principles

- Build for shared visibility between Outlet operators and clients.
- Support summary-first dashboards before deeper workflow views.
- Keep collaboration and workflow internal until it is clearly useful enough to expose.
- Prefer guided execution: show what happened, what matters, what is blocked, and what needs a human decision next.
- Use structured domain objects and `system_events` rather than route-local status blobs.
