# src/features / assets

Generated from the current working tree on 2026-04-10 21:59:58.

- Files: 3
- File kinds: TypeScript module (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/assets/lib.ts`
- Status: tracked-clean
- System: web
- Group: src/features / assets
- Ownership: feature module: assets
- Type: TypeScript module
- Construction: code module
- Lines: 28
- Bytes: 717
- Imports (internal): src/lib/constants.ts, src/features/assets/types.ts
- Imported by: src/features/campaigns/server.ts
- Depends on groups: src/lib, src/features / assets
- Used by groups: src/features / campaigns
- Feature module: assets
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Exports: statusColor, mapAssetRow, mapAssetRows
- Symbol details: function statusColor (exported), function mapAssetRow (exported), function mapAssetRows (exported)
- Defines: statusColor, mapAssetRow, mapAssetRows
- Contents summary: exports: statusColor, mapAssetRow, mapAssetRows; internal imports: 2

## `src/features/assets/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / assets
- Ownership: feature module: assets
- Type: TypeScript module
- Construction: code module
- Lines: 461
- Bytes: 13500
- Imports (internal): src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/features/assets/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/features/agent-outcomes/server.ts, src/features/approvals/server.ts, src/features/campaigns/server.ts, … (+2 more)
- Depends on groups: src/lib, src/features / assets
- Used by groups: Tests / Features, src/features / agent-outcomes, src/features / approvals, src/features / campaigns, src/features / conversations, src/features / notifications
- Feature module: assets
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/agent-outcomes/server.test.ts, … (+39 more)
- Tests related (direct): __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts
- Exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord, AssetLinkedCampaign, AssetLibraryRecord, AssetOperatingData
- Symbol details: function getClientAssetScope (exported), function assetMatchesScopedCampaigns (exported), function listVisibleAssetIdsForScope (exported), function getAssetRecordById (exported), function listAssetLibrary (exported), function getAssetOperatingData (exported), function listCampaignAssets (exported), function filterCampaignsForScope, function listClientCampaignsForAssets, function getAssetReadContext, function normalizeCampaignName, function assetNameTokens, function assetMatchesCampaignName, function toNullableNumber, const ASSET_SELECT, const ASSET_OPERATING_SELECT, … (+5 more)
- Defines: getClientAssetScope, filterCampaignsForScope, assetMatchesScopedCampaigns, listClientCampaignsForAssets, getAssetReadContext, listVisibleAssetIdsForScope, getAssetRecordById, normalizeCampaignName, assetNameTokens, assetMatchesCampaignName, toNullableNumber, listAssetLibrary, … (+34 more)
- Tests / describe labels: /
- Contents summary: exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord; tests/describes: /; internal imports: 4; package imports: 1

## `src/features/assets/types.ts`
- Status: tracked-clean
- System: web
- Group: src/features / assets
- Ownership: feature module: assets
- Type: TypeScript module
- Construction: code module
- Lines: 31
- Bytes: 608
- Imported by: src/features/assets/lib.ts, src/features/assets/server.ts
- Used by groups: src/features / assets
- Feature module: assets
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, … (+6 more)
- Tests related: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, … (+39 more)
- Exports: Asset, AssetRow
- Symbol details: interface Asset (exported), interface AssetRow (exported)
- Defines: Asset, AssetRow
- Contents summary: exports: Asset, AssetRow
