# Impact: src/features/asset-follow-up-items/server.ts

Generated from the current working tree on 2026-04-10 22:25:15.

- Category: Feature files
- Impact score: 15
- Ownership: feature module: asset-follow-up-items
- Feature module: asset-follow-up-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Imported by: src/app/api/agent-outcomes/action-item/route.ts
- Tests related: none
- DB objects: asset_follow_up_items, notifications, ad_assets
- Env vars: none
- Mutation symbols: createSystemAssetFollowUpItem, CreateSystemAssetFollowUpItemInput
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: src/app / api
- Summary: exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6
