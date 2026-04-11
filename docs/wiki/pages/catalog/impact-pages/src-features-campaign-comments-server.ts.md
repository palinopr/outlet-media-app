# Impact: src/features/campaign-comments/server.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Feature files
- Impact score: 29
- Ownership: feature module: campaign-comments
- Feature module: campaign-comments
- Route owners: src/app/api/campaign-comments/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Tests related: __tests__/features/campaign-comments/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: campaign_comments
- Env vars: none
- Mutation symbols: none
- Auth signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: Tests / Features, src/app / api, src/app / client, src/features / campaigns
- Summary: exports: listCampaignComments, canAccessCampaignComments, CampaignCommentVisibility, CampaignComment; internal imports: 2; package imports: 1
