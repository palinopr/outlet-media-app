# Impact: src/app/admin/actions/meta-sync.ts

Generated from the current working tree on 2026-04-10 21:51:44.

- Category: Admin actions
- Impact score: 17
- Ownership: web admin route surface
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: none
- Env vars: META_ACCESS_TOKEN, META_AD_ACCOUNT_ID
- Mutation symbols: syncCampaignStatus, syncCampaignBudget
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Summary: exports: syncCampaignStatus, syncCampaignBudget; internal imports: 1
