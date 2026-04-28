# Impact: src/lib/campaign-client-assignment.ts

Generated from the current working tree on 2026-04-28 02:31:12.

- Category: Shared web libraries
- Impact score: 72
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/dashboard/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/layout.tsx, src/app/client/[slug]/campaigns/page.tsx
- Imported by: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/clients/data.test.ts, src/app/admin/clients/data.ts, src/app/admin/dashboard/data.ts, src/app/client/[slug]/campaign/[campaignId]/data.ts, src/features/campaigns/server.test.ts, src/features/campaigns/server.ts, src/lib/campaign-client-assignment.test.ts, … (+1 more)
- Tests related: __tests__/app/client/campaign-detail-data.test.ts, src/app/admin/actions/search.test.ts, src/app/admin/clients/data.test.ts, src/features/campaigns/server.test.ts, src/lib/campaign-client-assignment.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/lib/meta-campaigns.test.ts, src/app/admin/campaigns/page.test.tsx, … (+1 more)
- DB objects: meta_campaigns, campaign_client_overrides, if
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / App, src/app / admin, src/app / client, src/features / campaigns, src/lib
- Summary: exports: getCampaignClientOverrideMap, resolveEffectiveCampaignClientSlug, applyEffectiveCampaignClientSlugs, getEffectiveCampaignRowById, getEffectiveCampaignClientSlug, listEffectiveCampaignRowsForClientSlug, listEffectiveCampaignIdsForClientSlug, campaignBelongsToClientSlug; internal imports: 2
