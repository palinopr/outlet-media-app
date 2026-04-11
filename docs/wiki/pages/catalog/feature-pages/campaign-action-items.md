# Feature: campaign-action-items

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 2
- Entry files: src/features/campaign-action-items/server.ts
- Component files: none
- Client files: none
- Server files: src/features/campaign-action-items/server.ts
- Route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Database objects touched: meta_campaigns, campaign_action_items, notifications, campaign_client_overrides
- Depends on feature modules: notifications (2), system-events (2)
- Used by feature modules: campaigns (2)
- Auth/access signals: imports Clerk server auth
- Behavior signals: none
- Direct tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- All linked tests: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts

## Exporting files
- `src/features/campaign-action-items/server.ts` — exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem

## File list
- `src/features/campaign-action-items/server.test.ts` — tests/describes: campaign action item ownership; lists campaign action items by campaign ownership instead of stored client slug; self-heals source-linked action items to the effective campaign owner; internal imports: 5; package imports: 2
- `src/features/campaign-action-items/server.ts` — exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7
