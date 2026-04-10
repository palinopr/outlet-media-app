# Feature: campaigns

Generated from the current working tree on 2026-04-10 18:02:26.

- Files: 4
- Entry files: src/features/campaigns/client-operating.ts, src/features/campaigns/ownership-sync.ts, src/features/campaigns/server.ts
- Component files: none
- Client files: none
- Server files: src/features/campaigns/server.ts
- Route users: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/event/[eventId]/page.tsx
- Database objects touched: notifications
- Depends on feature modules: campaign-action-items (2), campaign-comments (2), approvals (2), system-events (2), agent-outcomes (2), assets (2), client-portal (1), events (1)
- Used by feature modules: notifications (1)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/features/campaigns/ownership-sync.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx
- All linked tests: src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/features/campaigns/ownership-sync.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, … (+7 more)

## Exporting files
- `src/features/campaigns/client-operating.ts` — exports: getClientCampaignOperatingView, ClientCampaignOperatingView
- `src/features/campaigns/ownership-sync.ts` — exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership
- `src/features/campaigns/server.ts` — exports: getCampaignOperatingData, CampaignOperatingData

## File list
- `src/features/campaigns/client-operating.ts` — exports: getClientCampaignOperatingView, ClientCampaignOperatingView; internal imports: 8
- `src/features/campaigns/ownership-sync.test.ts` — tests/describes: campaign ownership sync helpers; matches approvals by direct campaign entity or metadata campaign id; matches notifications and system events through linked campaign entities; internal imports: 1; package imports: 1
- `src/features/campaigns/ownership-sync.ts` — exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership
- `src/features/campaigns/server.ts` — exports: getCampaignOperatingData, CampaignOperatingData; internal imports: 10
