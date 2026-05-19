---
status: canonical
last_updated: 2026-05-19
replaces:
  - docs/context/current-priorities.md
  - docs/context/active-surface-map.md
  - docs/context/production-operating-baseline.md
  - docs/references/current-project-map.md
---

# Current State

## Active product scope

The shipped product is intentionally narrow:

1. **Campaigns**
2. **Admin account/access management** needed to support campaign access

Do not add standalone client apps for Events, Reports, CRM, assets, approvals, action items, conversations, workspace, updates, or chat unless there is a new explicit product decision and a maintainable end-to-end slice.

## Active shipped surfaces

- Admin dashboard and campaign management: `/admin/dashboard`, `/admin/campaigns`, `/admin/campaigns/[campaignId]`
- Admin account/access management: `/admin/clients`, `/admin/clients/[id]`, `/admin/users`, `/admin/settings`
- Client portal campaign experience: `/client`, `/client/pending`, `/client/[slug]`, `/client/[slug]/campaigns`, `/client/[slug]/campaign/[campaignId]`
- Public support routes: `/privacy`, `/terms`, `/sign-in`, `/sign-up`, `/connect-error`, `/deletion-status/[code]`
- Public operational APIs: `/api/contact`, `/api/health`, `/api/meta/callback`, `/api/meta/data-deletion`
- Operational backend ingest: `/api/ingest` is Meta-only, secret-protected, and not a restored product surface
- Public client funnel exceptions: `/9am/[city]` and `/ataca-sergio/[market]`; `/9am/orlando` and `/ataca-sergio/newark` are live and protected from cleanup

New public funnel namespaces must be added to the public route matcher in `src/proxy.ts`; otherwise Clerk will protect the route and media assets such as MP4 files.

## Retired by default

These are intentionally absent or non-navigable unless a new product decision restores them:

- Events and Reports product surfaces
- Ticketing workflows and ingest product surfaces
- Agent runtime, agent chat, task queues, outcomes, and background agent work
- Approvals, requests, comments, conversations, action items, CRM, ticketing, assets, and broad workspace UI
- Placeholder product pages, parked tabs, coming-soon routes, and duplicate surfaces

Removed direct routes that should stay absent:

- `/admin/events`, `/admin/events/[eventId]`
- `/admin/reports`
- `/client/[slug]/events`, `/client/[slug]/event/[eventId]`
- `/client/[slug]/reports`

## Protected cleanup areas

- Do not remove `src/app/9am`, `public/9am`, `src/app/ataca-sergio`, or `public/ataca-sergio` during app-surface cleanup.
- Do not treat migrations or `src/lib/database.types.ts` as dead code based on import reachability.
- Do not auto-delete files from audit output; use audit reports as evidence for a separate cleanup pass.

## Active integrations

- Supabase
- Clerk
- Meta Marketing API
- Contact form email delivery
- Ticketmaster Custom IMG pixel to Meta CAPI bridge for the Ataca Sergio funnel

## Active code areas

- `src/app/` contains Next.js routes, redirects, page composition, and API route entrypoints.
- `src/features/` owns reusable business logic for campaigns, clients, client portal access, invitations, settings, system events, and users.
- `src/components/` contains shared UI plus admin/client presentation components.
- `src/lib/` contains shared infrastructure helpers, Supabase clients, formatters, Meta API helpers, and generated DB types.
- `supabase/migrations/` is forward-only migration history; do not rewrite old migrations to hide retired concepts.

## Audit workflow

Run the read-only codebase surface audit with:

```bash
npm run audit:surfaces
```

The audit classifies files as active route roots, active imported code, test-only code, unreachable candidates, API routes with no obvious caller, and product-scope review items. It prints to the console only.

Use `npm run audit:data` when checking whether the active Campaigns product is ready for clients. See [Campaigns and Meta Ads](./Campaigns-And-Meta-Ads.md).
