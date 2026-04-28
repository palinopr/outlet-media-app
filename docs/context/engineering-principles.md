# Engineering Principles

## Model Real Product Objects

Prefer first-class objects for active product concepts: campaigns, clients, members, invitations, and connected accounts. Do not hide core business workflows inside generic documents or route-local JSON blobs.

## Event-Driven Backbone

Every meaningful product mutation should be traceable through durable state, usually `system_events`, `admin_activity`, or the owning product table. Examples:

- `campaign_updated`

Use `system_events` as the shared admin/client-visible timeline. Use `admin_activity` for internal operator audit only.

## Thin Routes, Shared Feature Modules

Routes should authenticate, validate input, call feature-owned logic, and return responses. Repeated loaders/mutations belong under `src/features/**` so admin and client surfaces do not drift.

## Access And Packaging

The client account record and `client_members` are the authority for portal access. Do not use Clerk metadata or URL slugs as the business source of truth for memberships or landing behavior.

Client portal packaging is intentionally simple right now: Campaigns are the only active client-facing app surface.

## Keep The Surface Small

No dead nav items, placeholder routes, duplicate surfaces, or speculative UI breadth. If a workflow is not part of Campaigns or account/access management, keep it embedded or remove it until there is an explicit product decision. ticketing workflows and ingest are retired for now and should not be reintroduced without a new explicit product decision.

## Authenticated Browser Smoke Tests

Use Playwright for repeatable authenticated app smoke tests. The production Clerk instance only accepts the real `outletmedia.net` origin, so production E2E must target `https://outletmedia.net` rather than the Railway preview URL. Prefer temporary Clerk users plus backend sign-in tokens, cover signed-out/admin/client-member access, use temporary `client_members` rows for non-admin portal acceptance instead of inviting real clients, and always delete temporary users and memberships in teardown.

## Agent Runtime Status

Agent runtime, agent task queues, agent outcomes, and client/admin agent chat surfaces are retired for now. Do not add agent-specific tables, endpoints, nav items, or background workers without a new product decision and a complete tested vertical slice.
