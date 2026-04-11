# Impact: src/lib/formatters.tsx

Generated from the current working tree on 2026-04-10 22:25:15.

- Category: Shared web libraries
- Impact score: 235
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/client/[slug]/agent/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, … (+10 more)
- Imported by: __tests__/lib/formatters.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/data.ts, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/data.ts, src/app/admin/dashboard/events-preview-table.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/dashboard/upcoming-shows.tsx, src/app/admin/events/[eventId]/page.tsx, … (+48 more)
- Tests related: __tests__/lib/formatters.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/clients/data.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, src/app/client/[slug]/agent/page.test.tsx, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, … (+37 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/features / invitations, src/lib
- Used by groups: Tests / Lib, src/app / admin, src/app / client, src/components / admin, src/components / client, src/features / client-portal, src/features / dashboard, src/features / events, src/features / reports, src/lib
- Summary: exports: centsToUsd, fmtUsd, fmtNum, fmtDate, fmtTodayLong, slugToLabel, getInvitationStatusCfg, timeAgo; tests/describes: _; internal imports: 2
