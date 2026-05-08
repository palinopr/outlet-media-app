# Salvage Map

The active product reset keeps only the maintainable web surfaces needed for Campaigns and account/access management.

## Keep Active

- `src/app/admin/campaigns`
- `src/app/admin/clients`
- `src/app/admin/users`
- `src/app/client/[slug]/campaigns`
- shared feature modules that power Campaigns/account access
- Supabase migrations and generated active DB types

## Retired / Do Not Rebuild By Default

- broad workspace/client app surfaces
- approvals, conversations, updates, CRM, reports, events, action items, follow-up, or asset centers outside the core pages
- direct admin/client Events and Reports routes while those surfaces remain retired
- the old agent runtime, admin agent page, client agent tab, task queue, and outcome widgets
- one-off scripts and local artifacts at the repo root

If a retired area returns, rebuild it as a small tested vertical slice on shared domain objects rather than reviving old route-local logic.
