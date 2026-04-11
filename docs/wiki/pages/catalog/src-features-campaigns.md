# src/features / campaigns

Generated from the current working tree on 2026-04-10 22:25:15.

- Files: 4
- File kinds: TypeScript module (3), test file (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/campaigns/client-operating.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: TypeScript module
- Construction: code module
- Lines: 85
- Bytes: 2443
- Imports (internal): src/features/campaign-action-items/server.ts, src/features/campaign-comments/server.ts, src/features/approvals/server.ts, src/features/system-events/server.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/client-portal/scope.ts, src/lib/member-access.ts
- Imported by: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/campaign-operating-panel.tsx
- Depends on groups: src/features / campaign-action-items, src/features / campaign-comments, src/features / approvals, src/features / system-events, src/features / agent-outcomes, src/features / client-portal, src/lib
- Used by groups: src/app / client
- Feature module: campaigns
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Routes related (direct): src/app/client/[slug]/campaign/[campaignId]/page.tsx
- Tests related: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts
- Tests related (direct): src/app/client/[slug]/components/campaign-operating-panel.test.tsx
- Exports: getClientCampaignOperatingView, ClientCampaignOperatingView
- Symbol details: function getClientCampaignOperatingView (exported), interface ClientCampaignOperatingView (exported)
- Defines: getClientCampaignOperatingView, CampaignActionItem, CampaignComment, SystemEvent, ClientCampaignOperatingView
- Contents summary: exports: getClientCampaignOperatingView, ClientCampaignOperatingView; internal imports: 8

## `src/features/campaigns/ownership-sync.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: test file
- Construction: test specification
- Lines: 93
- Bytes: 2326
- Imports (internal): src/features/campaigns/ownership-sync.ts
- Imports (packages): vitest
- Depends on groups: src/features / campaigns
- Feature module: campaigns
- Symbol details: const entities
- Defines: entities
- Tests / describe labels: campaign ownership sync helpers, matches approvals by direct campaign entity or metadata campaign id, matches notifications and system events through linked campaign entities
- Contents summary: tests/describes: campaign ownership sync helpers; matches approvals by direct campaign entity or metadata campaign id; matches notifications and system events through linked campaign entities; internal imports: 1; package imports: 1

## `src/features/campaigns/ownership-sync.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: TypeScript module
- Construction: code module
- Lines: 84
- Bytes: 2699
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/ownership-sync.test.ts, src/features/notifications/server.ts
- Used by groups: src/app / admin, src/features / campaigns, src/features / notifications
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: src/features/campaigns/ownership-sync.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, … (+9 more)
- Tests related (direct): src/features/campaigns/ownership-sync.test.ts
- Exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership
- Symbol details: function approvalMatchesCampaignOwnership (exported), function notificationMatchesCampaignOwnership (exported), function systemEventMatchesCampaignOwnership (exported), function isRecord, function metadataCampaignId, interface CampaignLinkedEntitySets
- Defines: isRecord, metadataCampaignId, approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership, campaignId, entityType, entityId, CampaignLinkedEntitySets
- Contents summary: exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership

## `src/features/campaigns/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / campaigns
- Ownership: feature module: campaigns
- Type: TypeScript module
- Construction: code module
- Lines: 136
- Bytes: 4555
- Imports (internal): src/features/assets/lib.ts, src/features/assets/server.ts, src/features/campaign-action-items/server.ts, src/features/campaign-comments/server.ts, src/features/approvals/server.ts, src/features/system-events/server.ts, src/features/events/server.ts, src/lib/meta-campaigns.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts
- Imported by: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx
- Depends on groups: src/features / assets, src/features / campaign-action-items, src/features / campaign-comments, src/features / approvals, src/features / system-events, src/features / events, src/lib
- Used by groups: src/app / admin, src/components / admin
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx
- Routes related (direct): src/app/admin/campaigns/[campaignId]/page.tsx
- Tests related: src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Tests related (direct): src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- Exports: getCampaignOperatingData, CampaignOperatingData
- Symbol details: function getCampaignOperatingData (exported), function toNumber, function centsToDollars, interface CampaignOperatingData (exported), interface CampaignOperatingRow
- Defines: toNumber, centsToDollars, getCampaignOperatingData, amount, data, CampaignOperatingRow, CampaignOperatingData
- Contents summary: exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 10
