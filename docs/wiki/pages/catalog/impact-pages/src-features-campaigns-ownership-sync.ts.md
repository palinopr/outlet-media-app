# Impact: src/features/campaigns/ownership-sync.ts

Generated from the current working tree on 2026-04-10 18:46:37.

- Category: Feature files
- Impact score: 47
- Ownership: feature module: campaigns
- Feature module: campaigns
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: src/app/admin/actions/campaigns.ts, src/features/campaigns/ownership-sync.test.ts, src/features/notifications/server.ts
- Tests related: src/features/campaigns/ownership-sync.test.ts, __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, … (+5 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/features / campaigns, src/features / notifications
- Summary: exports: approvalMatchesCampaignOwnership, notificationMatchesCampaignOwnership, systemEventMatchesCampaignOwnership
