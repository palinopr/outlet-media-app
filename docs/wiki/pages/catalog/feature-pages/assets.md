# Feature: assets

Generated from the current working tree on 2026-04-10 17:55:29.

- Files: 3
- Entry files: src/features/assets/lib.ts, src/features/assets/server.ts, src/features/assets/types.ts
- Component files: none
- Client files: none
- Server files: src/features/assets/server.ts
- Route users: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/admin/agents/page.tsx, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, … (+2 more)
- Database objects touched: meta_campaigns, ad_assets
- Depends on feature modules: none
- Used by feature modules: campaigns (2), agent-outcomes (1), approvals (1), conversations (1), notifications (1)
- Auth/access signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts
- All linked tests: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/assets/server.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/system-events/list.test.ts, __tests__/features/agent-outcomes/server.test.ts, … (+37 more)

## Exporting files
- `src/features/assets/lib.ts` — exports: statusColor, mapAssetRow, mapAssetRows
- `src/features/assets/server.ts` — exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord, AssetLinkedCampaign, AssetLibraryRecord, AssetOperatingData
- `src/features/assets/types.ts` — exports: Asset, AssetRow

## File list
- `src/features/assets/lib.ts` — exports: statusColor, mapAssetRow, mapAssetRows; internal imports: 2
- `src/features/assets/server.ts` — exports: getClientAssetScope, assetMatchesScopedCampaigns, listVisibleAssetIdsForScope, getAssetRecordById, listAssetLibrary, getAssetOperatingData, listCampaignAssets, AssetOperatingRecord; tests/describes: /; internal imports: 4; package imports: 1
- `src/features/assets/types.ts` — exports: Asset, AssetRow
