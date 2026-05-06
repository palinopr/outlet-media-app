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

The client account record and `client_members` are the authority for portal access. Do not use Clerk metadata or URL slugs as the business source of truth for memberships or landing behavior. Clerk invitation metadata may be used only as transition metadata to accept a DB-backed `client_access_invites` row and create the real `client_members` record.

Campaign ownership assignment must target an existing active client account. Do not auto-create clients from a typed campaign slug; create/activate the client in Clients first, then assign campaigns to that canonical account.

Client portal packaging is intentionally simple right now: Campaigns are the only active client-facing app surface.

## Keep The Surface Small

No dead nav items, placeholder routes, duplicate surfaces, or speculative UI breadth. If a workflow is not part of Campaigns or account/access management, keep it embedded or remove it until there is an explicit product decision. ticketing workflows and ingest are retired for now and should not be reintroduced without a new explicit product decision.

## Verification Discipline

Default verification should stay lean: `npm run type-check`, `npm run lint`, `npm test`, and `npm run build`. Do not add browser automation, generated reports, screenshots, or broad E2E machinery unless the change touches auth-critical behavior that focused tests cannot prove.

## Agent Runtime Status

Agent runtime, agent task queues, agent outcomes, and client/admin agent chat surfaces are retired for now. Do not add agent-specific tables, endpoints, nav items, or background workers without a new product decision and a complete tested vertical slice.
