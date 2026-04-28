# Impact: src/lib/constants.ts

Generated from the current working tree on 2026-04-28 02:30:43.

- Category: Shared web libraries
- Impact score: 58
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/dashboard/page.tsx
- Imported by: src/app/admin/actions/meta-sync.ts, src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/campaigns/campaign-range-filter.tsx, src/app/client/[slug]/campaigns/campaigns-table.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/client/[slug]/components/campaign-detail-header.tsx, src/app/client/[slug]/data.ts, src/features/client-portal/insights.ts, src/lib/meta-api.ts, … (+1 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, __tests__/app/client/campaign-detail-data.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/client/[slug]/campaigns/campaigns-table.test.tsx, src/app/client/[slug]/components/campaign-detail-header.test.tsx, src/lib/meta-api.test.ts, src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/client/[slug]/lib.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+1 more)
- DB objects: if
- Env vars: none
- Mutation symbols: start
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/app / client, src/features / client-portal, src/lib
- Summary: exports: parseRange, parseCampaignRange, parseClientCampaignRange, getRangeLabel, getRangeQuery, META_API_VERSION, META_PRESETS, RANGE_LABELS
