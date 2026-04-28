# Current Priorities

## Active Product Scope

The current shipped product is intentionally narrow:

1. **Campaigns**
2. **Events** (optional per client)
3. **Reports**
4. Admin account/access management required to support those surfaces

Do not add standalone client apps for CRM, assets, approvals, conversations, workspace, updates, or chat unless there is an explicit product decision and a maintainable end-to-end slice.

## Agent Status

All agent runtime and agent-facing product surfaces are retired for now. Do not expose an admin Agents page, client Agent tab, agent task queue, agent outcome widgets, or agent-triggered background work. If a workflow needs follow-through, model it directly as approvals, action items, comments, reports, and `system_events` inside the active product surfaces.

## Engineering Priorities

- Keep routes thin; move reusable business logic into feature modules.
- Preserve one canonical client/account/membership access backbone.
- Keep client portal packaging admin-managed from client account data.
- Treat `system_events` as the shared product timeline for app-visible activity.
- Keep dashboards summary-first while surfacing pending approvals, unresolved discussion, and open action items.
- Delete dead routes and nav items instead of hiding unfinished surfaces.
- Prefer one complete vertical slice over many placeholder tabs.
