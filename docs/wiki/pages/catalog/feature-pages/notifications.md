# Feature: notifications

Generated from the current working tree on 2026-04-10 16:52:39.

- Files: 4
- Entry files: src/features/notifications/discussions.ts, src/features/notifications/server.ts, src/features/notifications/types.ts, src/features/notifications/workflow.ts
- Component files: none
- Client files: none
- Server files: src/features/notifications/server.ts
- Route users: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Database objects touched: approval_requests, campaign_action_items, campaign_comments, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, notifications, clients, client_members, client_member_campaigns, client_member_events
- Depends on feature modules: assets (1), campaigns (1)
- Used by feature modules: campaign-action-items (2), asset-follow-up-items (1), event-follow-up-items (1)
- Auth/access signals: imports Clerk server auth, calls currentUser(), references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- All linked tests: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, … (+4 more)

## Exporting files
- `src/features/notifications/discussions.ts` — exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput
- `src/features/notifications/server.ts` — exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope
- `src/features/notifications/types.ts` — exports: AppNotification, CreateNotificationInput
- `src/features/notifications/workflow.ts` — exports: notifyWorkflowAssignee

## File list
- `src/features/notifications/discussions.ts` — exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput; internal imports: 1
- `src/features/notifications/server.ts` — exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1
- `src/features/notifications/types.ts` — exports: AppNotification, CreateNotificationInput
- `src/features/notifications/workflow.ts` — exports: notifyWorkflowAssignee; internal imports: 1
