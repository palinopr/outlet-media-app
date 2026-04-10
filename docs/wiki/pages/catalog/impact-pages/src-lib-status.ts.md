# Impact: src/lib/status.ts

Generated from the current working tree on 2026-04-10 16:14:38.

- Category: Shared web libraries
- Impact score: 120
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+10 more)
- Imported by: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/features/client-portal/insights.ts, src/lib/formatters.tsx
- Tests related: src/app/client/[slug]/campaigns/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/lib/formatters.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/lib.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, src/app/client/[slug]/reports/page.test.tsx, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, … (+34 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/app / client, src/features / client-portal, src/lib
- Summary: exports: getCampaignStatusCfg, getEventStatusCfg
