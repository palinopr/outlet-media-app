# src/features / asset-follow-up-items

Generated from the current working tree on 2026-04-10 18:46:37.

- Files: 1
- File kinds: TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/asset-follow-up-items/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / asset-follow-up-items
- Ownership: feature module: asset-follow-up-items
- Type: TypeScript module
- Construction: code module
- Lines: 399
- Bytes: 12268
- Imports (internal): src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts
- Imported by: src/app/api/agent-outcomes/action-item/route.ts
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: src/app / api
- Feature module: asset-follow-up-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts
- Exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem
- Symbol details: function listAssetFollowUpItems (exported), function findAssetFollowUpItemBySource (exported), function getAssetFollowUpItemById (exported), function maybeEnqueueAssetFollowUpItemTriage (exported), function createSystemAssetFollowUpItem (exported), function shouldEnqueueAssetFollowUpItemTriage, function assetFollowUpItemTriagePrompt, function listAssetNames, function mapAssetFollowUpItem, const ASSET_FOLLOW_UP_ITEM_SELECT, type AssetFollowUpItemVisibility (exported), interface AssetFollowUpItem (exported), interface AssetFollowUpItemActor, interface AssetFollowUpItemTriagePreviousState, interface ListAssetFollowUpItemsOptions, interface CreateSystemAssetFollowUpItemInput
- Defines: shouldEnqueueAssetFollowUpItemTriage, assetFollowUpItemTriagePrompt, listAssetNames, mapAssetFollowUpItem, listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, ASSET_FOLLOW_UP_ITEM_SELECT, assetId, db, … (+20 more)
- Contents summary: exports: listAssetFollowUpItems, findAssetFollowUpItemBySource, getAssetFollowUpItemById, maybeEnqueueAssetFollowUpItemTriage, createSystemAssetFollowUpItem, AssetFollowUpItemVisibility, AssetFollowUpItem; internal imports: 6
