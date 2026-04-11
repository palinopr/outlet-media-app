# Feature: asset-follow-up-items

Generated from the current working tree on 2026-04-10 21:37:00.

- Files: 1
- Entry files: src/features/asset-follow-up-items/server.ts
- Component files: none
- Client files: none
- Server files: src/features/asset-follow-up-items/server.ts
- Route users: src/app/api/agent-outcomes/action-item/route.ts
- Database objects touched: asset_follow_up_items, notifications, ad_assets
- Depends on feature modules: notifications (1), system-events (1)
- Used by feature modules: none
- Auth/access signals: none
- Behavior signals: none
- Direct tests: none
- All linked tests: none

## Exporting files
- `src/features/asset-follow-up-items/server.ts` — exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem

## File list
- `src/features/asset-follow-up-items/server.ts` — exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6
