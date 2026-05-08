# Current Priorities

## Active Product Scope

The current shipped product is intentionally narrow:

1. **Campaigns**
2. Admin account/access management required to support campaign access

Events, Reports, ticketing workflows and ingest product surfaces are retired for now. Direct Events/Reports routes should remain absent unless a new explicit product decision restores them.

Exception: public client marketing funnels are allowed when they are explicitly live for a client. `/9am/orlando` is an active client event landing page under `src/app/9am` + `public/9am`, and `/ataca-sergio/newark` is an active client event landing page under `src/app/ataca-sergio` + `public/ataca-sergio`; do not remove them during app-surface cleanup. These exceptions do not restore the retired Events product surface.

New public funnel namespaces must be added to the public route matcher in `src/proxy.ts`; otherwise Clerk will protect the route and media assets such as MP4 files.

Do not add standalone client apps for Events, Reports, CRM, assets, approvals, action items, conversations, workspace, updates, or chat unless there is an explicit product decision and a maintainable end-to-end slice.

## Agent Status

All agent runtime and agent-facing product surfaces are retired for now. Do not expose an admin Agents page, client Agent tab, agent task queue, agent outcome widgets, or agent-triggered background work. If a workflow needs follow-through, model it directly inside campaign/admin surfaces with the smallest durable object needed.

## Engineering Priorities

- Keep routes thin; move reusable business logic into feature modules.
- Preserve one canonical client/account/membership access backbone.
- Keep client portal packaging admin-managed from client account data.
- Treat `system_events` as the shared product timeline for app-visible activity.
- Keep dashboards summary-first while surfacing only useful active signals; do not reintroduce client request/comment panels by default.
- Delete dead routes and nav items instead of hiding unfinished surfaces.
- Prefer one complete vertical slice over many placeholder tabs.
