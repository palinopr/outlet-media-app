# Active Surface Map

This map is the source of truth for codebase-understanding and dead-code audits. It is intentionally conservative: it identifies what is shipped, what is removed, and what needs product review before cleanup.

## Active Product Surfaces

- Admin dashboard and campaign management: `/admin/dashboard`, `/admin/campaigns`, `/admin/campaigns/[campaignId]`
- Admin account/access management: `/admin/clients`, `/admin/clients/[id]`, `/admin/users`, `/admin/settings`
- Client portal campaign experience: `/client`, `/client/pending`, `/client/[slug]`, `/client/[slug]/campaigns`, `/client/[slug]/campaign/[campaignId]`
- Public support routes: `/privacy`, `/terms`, `/sign-in`, `/sign-up`, `/connect-error`, `/deletion-status/[code]`
- Public operational APIs: `/api/contact`, `/api/health`, `/api/meta/callback`, `/api/meta/data-deletion`
- Operational backend ingest: `/api/ingest` is Meta-only, secret-protected, and not a restored product surface
- Public client funnel exceptions: `/9am/[city]` and `/ataca-sergio/[market]`; `/9am/orlando` and `/ataca-sergio/newark` are live and protected from cleanup

## Removed Retired Direct Routes

These direct routes are intentionally absent. If they reappear in `src/app`, the audit should flag them as needing a new product decision:

- `/admin/events`, `/admin/events/[eventId]`
- `/admin/reports`
- `/client/[slug]/events`, `/client/[slug]/event/[eventId]`
- `/client/[slug]/reports`

Do not rebuild Events, Reports, ticketing workflows, ingest product surfaces, or agent/runtime UI without a new explicit product decision.

## Audit Classification Decisions

- `/api/health` is an operational health endpoint used by production smoke/monitoring.
- `/api/ingest` is an operational Meta campaign ingest endpoint. It is secret-protected, Meta-only, and not a restored ingest product surface.
- `/api/meta/callback` is retained to close out retired Meta OAuth callbacks with a controlled redirect instead of a broken external callback.
- `/api/meta/data-deletion` and `/deletion-status/[code]` are retained for Meta platform compliance.
- Event/Report route files and guard-only tests are removed while those product surfaces are retired.
- Product-scope audit matches under `system_events`, tests, env validation, and operational endpoints are review signals, not automatic deletion targets.

## Off-Limits And Protected Areas

- Do not touch landing-page files or assets unless the user explicitly reopens that scope.
- Do not remove `src/app/9am`, `public/9am`, `src/app/ataca-sergio`, or `public/ataca-sergio` during product-surface cleanup.
- Do not treat migrations or `src/lib/database.types.ts` as dead code based on app import reachability.
- Do not auto-delete files from audit output. Use the report as evidence for a separate cleanup pass.

## Audit Workflow

Run the read-only codebase audit with:

```sh
npm run audit:surfaces
```

The audit classifies files as active route roots, active imported code, test-only code, unreachable candidates, API routes with no obvious caller, and product-scope review items. It prints to the console only.

Default verification after changing audit tooling or product-surface maps:

```sh
npm run type-check
npm run lint
npm test
npm run build
```
