# Engineering Principles

## Model Real Product Objects

Prefer first-class objects for campaigns, events, reports, approvals, comments, action items, assets, clients, members, and invitations. Do not hide core business workflows inside generic documents or route-local JSON blobs.

## Event-Driven Backbone

Every meaningful product mutation should be traceable through durable state, usually `system_events`, `approval_requests`, or the owning workflow table. Examples:

- `campaign_updated`
- `event_updated`
- `approval_requested`
- `client_comment_added`
- `campaign_action_item_created`
- `event_follow_up_item_updated`
- `report_generated`

Use `system_events` as the shared admin/client-visible timeline. Use `admin_activity` for internal operator audit only.

## Thin Routes, Shared Feature Modules

Routes should authenticate, validate input, call feature-owned logic, and return responses. Repeated loaders/mutations belong under `src/features/**` so admin and client surfaces do not drift.

## Access And Packaging

The client account record and `client_members` are the authority for portal access. Do not use Clerk metadata or URL slugs as the business source of truth for memberships, enabled apps, or landing behavior.

Client portal packaging is admin-managed. Campaigns are universal; reports are first-class when enabled; events are optional per client.

## Keep The Surface Small

No dead nav items, placeholder routes, duplicate surfaces, or speculative UI breadth. If a workflow is not part of Campaigns, Events, Reports, or account/access management, keep it embedded or remove it until there is an explicit product decision.

## Agent Runtime Status

Agent runtime, agent task queues, agent outcomes, and client/admin agent chat surfaces are retired for now. Do not add agent-specific tables, endpoints, nav items, or background workers without a new product decision and a complete tested vertical slice.
