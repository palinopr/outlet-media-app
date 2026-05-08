# Current Project Map

This is the compact replacement for the retired generated wiki. Keep it short and update it only when the active product shape changes.

## Active Product

- Campaign performance and campaign detail views.
- Admin dashboard, clients, users, settings, and access management.
- Meta ingest/settings and Supabase-backed campaign/client data.
- Public `/9am/orlando` client funnel under `src/app/9am` and `public/9am`.

## Active Code Areas

- `src/app/` contains Next.js routes, redirects, page composition, and API route entrypoints.
- `src/features/` owns reusable business logic for campaigns, clients, client portal access, invitations, settings, system events, and users.
- `src/components/` contains shared UI plus admin/client presentation components.
- `src/lib/` contains shared infrastructure helpers, Supabase clients, formatters, Meta API helpers, and generated DB types.
- `supabase/migrations/` is forward-only migration history; do not rewrite old migrations to hide retired concepts.

## Retired By Default

- Events and Reports product surfaces are removed while the active baseline stays focused on Campaigns and account access.
- Agent runtime, agent chat, task queues, outcomes, approvals, requests, comments, CRM, ticketing, assets, action items, and workspace UI stay out of the shipped app.
- Generated wiki pages, browser reports, local worktrees, screenshots from ad hoc testing, and temporary outputs should not live in the root project surface.

## Default Verification

Use the lean app gate:

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Do not add Playwright, screenshot generation, or broad E2E machinery unless a specific auth-critical browser behavior cannot be verified with focused tests.
