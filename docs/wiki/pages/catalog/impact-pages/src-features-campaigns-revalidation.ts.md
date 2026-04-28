# Impact: src/features/campaigns/revalidation.ts

Generated from the current working tree on 2026-04-28 03:23:46.

- Category: Feature files
- Impact score: 16
- Ownership: feature module: campaigns
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/revalidation.test.ts
- Tests related: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: if
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: calls revalidatePath()
- Depends on groups: none
- Used by groups: src/app / admin, src/features / campaigns
- Summary: exports: getCampaignRevalidationPaths, revalidateCampaignPaths; package imports: 1
