# src/features / campaigns

Generated from the current working tree on 2026-04-28 03:23:46.

- Files: 4
- File kinds: test file (2), TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/campaigns/revalidation.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: test file
- Construction: test specification
- Lines: 15
- Bytes: 476
- Imports (internal): src/features/campaigns/revalidation.ts
- Imports (packages): vitest
- Depends on groups: src/features / campaigns
- Feature module: campaigns
- Tests / describe labels: campaign revalidation paths, keeps campaign revalidation on active admin and client routes
- Contents summary: tests/describes: campaign revalidation paths; keeps campaign revalidation on active admin and client routes; internal imports: 1; package imports: 1

## `src/features/campaigns/revalidation.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: TypeScript module
- Construction: code module
- Lines: 32
- Bytes: 802
- Imports (packages): next/cache
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/revalidation.test.ts
- Used by groups: src/app / admin, src/features / campaigns
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/features/campaigns/revalidation.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/features/campaigns/revalidation.test.ts
- Exports: getCampaignRevalidationPaths, revalidateCampaignPaths
- Symbol details: function getCampaignRevalidationPaths (exported), function revalidateCampaignPaths (exported), function uniquePaths, function clientPaths
- Defines: uniquePaths, clientPaths, getCampaignRevalidationPaths, revalidateCampaignPaths
- Contents summary: exports: getCampaignRevalidationPaths, revalidateCampaignPaths; package imports: 1

## `src/features/campaigns/server.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: test file
- Construction: test specification
- Lines: 86
- Bytes: 2250
- Imports (internal): src/lib/meta-campaigns.ts, src/features/campaigns/server.ts, src/lib/supabase.ts, src/lib/campaign-client-assignment.ts
- Imports (packages): vitest
- Depends on groups: src/lib, src/features / campaigns
- Feature module: campaigns
- Symbol details: const getEffectiveCampaignRowById, const fetchCampaignById
- Defines: getEffectiveCampaignRowById, fetchCampaignById, data
- Tests / describe labels: getCampaignOperatingData, falls back to live Meta data when a linked campaign is not stored locally, uses the local campaign row when available
- Contents summary: tests/describes: getCampaignOperatingData; falls back to live Meta data when a linked campaign is not stored locally; uses the local campaign row when available; internal imports: 4; package imports: 1

## `src/features/campaigns/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: TypeScript module
- Construction: code module
- Lines: 74
- Bytes: 2439
- Imports (internal): src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/campaigns/server.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/components / admin, src/features / campaigns
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- Tests related (direct): src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/features/campaigns/server.test.ts
- Exports: getCampaignOperatingData, CampaignOperatingData
- Symbol details: function getCampaignOperatingData (exported), function toNumber, function centsToDollars, interface CampaignOperatingData (exported), interface CampaignOperatingRow
- Defines: toNumber, centsToDollars, getCampaignOperatingData, amount, data, metaResult, spend, roas, CampaignOperatingRow, CampaignOperatingData
- Contents summary: exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 3
