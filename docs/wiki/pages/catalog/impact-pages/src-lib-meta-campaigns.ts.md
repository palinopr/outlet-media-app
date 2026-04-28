# Impact: src/lib/meta-campaigns.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Shared web libraries
- Impact score: 42
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/campaigns/page.tsx, src/app/client/[slug]/campaigns/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: src/app/admin/campaigns/data.ts, src/app/admin/campaigns/page.tsx, src/app/client/[slug]/data.ts, src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/campaigns/columns.tsx, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/lib/meta-campaigns.test.ts
- Tests related: src/features/campaigns/server.test.ts, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/campaigns/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- DB objects: meta_campaigns, clients, if
- Env vars: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / campaigns, src/lib
- Summary: exports: fetchCampaignById, fetchAllCampaigns, MetaCampaignCard, DailyInsight, MetaCampaignsResult; internal imports: 5
