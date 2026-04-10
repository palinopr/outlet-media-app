# Impact: src/features/campaign-action-items/server.ts

Generated from the current working tree on 2026-04-10 17:55:29.

- Category: Feature files
- Impact score: 53
- Ownership: feature module: campaign-action-items
- Feature module: campaign-action-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- DB objects: campaign_action_items, notifications
- Env vars: none
- Mutation symbols: createSystemCampaignActionItem, updateSystemCampaignActionItem, changedKeys, updated, changedFields, CreateSystemCampaignActionItemInput, UpdateSystemCampaignActionItemInput
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / campaign-action-items, src/features / campaigns
- Summary: exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7
