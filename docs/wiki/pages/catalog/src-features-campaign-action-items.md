# src/features / campaign-action-items

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 2
- File kinds: test file (1), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/campaign-action-items/server.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaign-action-items
- Ownership: feature module: campaign-action-items
- Type: test file
- Construction: test specification
- Lines: 196
- Bytes: 5464
- Imports (internal): src/features/campaign-action-items/server.ts, src/lib/supabase.ts, src/lib/agent-dispatch.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/features / campaign-action-items, src/lib, src/features / notifications, src/features / system-events
- Feature module: campaign-action-items
- Defines: applyFilters, state, values, supabaseAdmin, query, rows, tableRows, data, items, item
- Tests / describe labels: campaign action item ownership, lists campaign action items by campaign ownership instead of stored client slug, self-heals source-linked action items to the effective campaign owner
- Contents summary: tests/describes: campaign action item ownership; lists campaign action items by campaign ownership instead of stored client slug; self-heals source-linked action items to the effective campaign owner; internal imports: 5; package imports: 2

## `src/features/campaign-action-items/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaign-action-items
- Ownership: feature module: campaign-action-items
- Type: TypeScript module
- Construction: code module
- Lines: 530
- Bytes: 17119
- Imports (internal): src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/notifications/workflow.ts, src/features/system-events/server.ts, src/lib/campaign-client-assignment.ts
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/features/campaign-action-items/server.test.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts
- Depends on groups: src/lib, src/features / notifications, src/features / system-events
- Used by groups: Tests / Features, src/app / admin, src/app / api, src/features / campaign-action-items, src/features / campaigns
- Feature module: campaign-action-items
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): __tests__/features/campaign-action-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- Exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem
- Symbol details: function listCampaignActionItems (exported), function findCampaignActionItemBySource (exported), function getCampaignActionItemById (exported), function maybeEnqueueCampaignActionItemTriage (exported), function createSystemCampaignActionItem (exported), function updateSystemCampaignActionItem (exported), function shouldEnqueueCampaignActionItemTriage, function campaignActionItemTriagePrompt, function mapCampaignActionItem, const CAMPAIGN_ACTION_ITEM_SELECT, type CampaignActionItemVisibility (exported), interface CampaignActionItem (exported), interface CampaignActionItemActor, interface CampaignActionItemTriagePreviousState, interface ListCampaignActionItemsOptions, interface CreateSystemCampaignActionItemInput, … (+1 more)
- Defines: shouldEnqueueCampaignActionItemTriage, campaignActionItemTriagePrompt, mapCampaignActionItem, listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CAMPAIGN_ACTION_ITEM_SELECT, db, taskId, … (+21 more)
- Contents summary: exports: listCampaignActionItems, findCampaignActionItemBySource, getCampaignActionItemById, maybeEnqueueCampaignActionItemTriage, createSystemCampaignActionItem, updateSystemCampaignActionItem, CampaignActionItemVisibility, CampaignActionItem; internal imports: 7
