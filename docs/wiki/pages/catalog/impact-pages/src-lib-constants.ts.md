# Impact: src/lib/constants.ts

Generated from the current working tree on 2026-04-10 18:02:26.

- Category: Shared web libraries
- Impact score: 110
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/dashboard/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-section.tsx, src/app/client/[slug]/components/date-range-picker.tsx, src/app/client/[slug]/data.ts, src/components/admin/events/columns.tsx, src/components/admin/events/event-operating-panel.tsx, src/components/admin/events/event-table.tsx, src/features/assets/lib.ts, … (+4 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, __tests__/app/client/data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/events/page.test.tsx, src/app/admin/events/[eventId]/page.test.tsx, src/app/admin/events/page.test.tsx, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/admin/reports/page.test.tsx, … (+21 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / assets, src/features / client-portal, src/features / reports, src/lib
- Summary: exports: parseRange, META_API_VERSION, META_PRESETS, RANGE_LABELS, EVENT_STATUS_OPTIONS, ASSET_STATUSES, ASSET_STATUS_COLORS, DateRange
