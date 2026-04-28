# Feature: campaigns

Generated from the current working tree on 2026-04-28 02:32:49.

- Files: 4
- Entry files: src/features/campaigns/revalidation.ts, src/features/campaigns/server.ts
- Component files: none
- Client files: none
- Server files: src/features/campaigns/server.ts
- Route users: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Database objects touched: if
- Depends on feature modules: none
- Used by feature modules: none
- Auth/access signals: none
- Behavior signals: calls revalidatePath()
- Direct tests: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- All linked tests: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts

## Exporting files
- `src/features/campaigns/revalidation.ts` — exports: getCampaignRevalidationPaths, revalidateCampaignPaths
- `src/features/campaigns/server.ts` — exports: getCampaignOperatingData, CampaignOperatingData

## File list
- `src/features/campaigns/revalidation.test.ts` — tests/describes: campaign revalidation paths; keeps campaign revalidation on active admin and client routes; internal imports: 1; package imports: 1
- `src/features/campaigns/revalidation.ts` — exports: getCampaignRevalidationPaths, revalidateCampaignPaths; package imports: 1
- `src/features/campaigns/server.test.ts` — tests/describes: getCampaignOperatingData; falls back to live Meta data when a linked campaign is not stored locally; uses the local campaign row when available; internal imports: 4; package imports: 1
- `src/features/campaigns/server.ts` — exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 3
