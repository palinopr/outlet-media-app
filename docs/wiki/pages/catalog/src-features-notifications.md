# src/features / notifications

Generated from the current working tree on 2026-04-10 21:27:09.

- Files: 4
- File kinds: TypeScript module (4)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/notifications/discussions.ts`
- Status: tracked-clean
- System: web
- Group: src/features / notifications
- Ownership: feature module: notifications
- Type: TypeScript module
- Construction: code module
- Lines: 64
- Bytes: 1830
- Imports (internal): src/features/notifications/server.ts
- Imported by: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts
- Depends on groups: src/features / notifications
- Used by groups: Tests / Features, src/app / api
- Feature module: notifications
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Routes related (direct): src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Tests related (direct): __tests__/features/notifications/discussions.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts
- Exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput
- Symbol details: function listDiscussionNotificationRecipientIds (exported), function notifyDiscussionAudience (exported), type DiscussionNotificationVisibility, interface DiscussionNotificationInput (exported), interface DiscussionRecipientOptions
- Defines: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, recipientIds, DiscussionNotificationVisibility, DiscussionRecipientOptions, DiscussionNotificationInput
- Contents summary: exports: listDiscussionNotificationRecipientIds, notifyDiscussionAudience, DiscussionNotificationInput; internal imports: 1

## `src/features/notifications/server.ts`
- Status: tracked-clean
- System: web
- Group: src/features / notifications
- Ownership: feature module: notifications
- Type: TypeScript module
- Construction: code module
- Lines: 1128
- Bytes: 33337
- Imports (internal): src/features/assets/server.ts, src/features/campaigns/ownership-sync.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/notifications/types.ts
- Imports (packages): @clerk/nextjs/server
- Imported by: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/features/notifications/discussions.ts, src/features/notifications/workflow.ts
- Depends on groups: src/features / assets, src/features / campaigns, src/lib, src/features / notifications
- Used by groups: Tests / Features, src/features / notifications
- Feature module: notifications
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+7 more)
- Tests related (direct): __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts
- Exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope
- Symbol details: function createNotification (exported), function listNotificationsForUser (exported), function listClientNotificationRecipients (exported), function listAdminNotificationRecipients (exported), function isRetiredCrmApprovalRow (exported), function filterNotificationsByScope (exported), function isRetiredCrmNotificationEntityType, function isRetiredCrmRouteEntityType, function isRetiredCrmNotification, function mapNotificationRow, function getNotificationReadClient, function isScopedNotificationEntity, function emptyNotificationEntityContext, function emptyNotificationRouteContext, function extractNotificationContextFromApprovalRow, function extractNotificationRouteContextFromApprovalRow, … (+8 more)
- Defines: isRetiredCrmNotificationEntityType, isRetiredCrmRouteEntityType, isRetiredCrmNotification, mapNotificationRow, getNotificationReadClient, createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isScopedNotificationEntity, emptyNotificationEntityContext, emptyNotificationRouteContext, … (+62 more)
- Contents summary: exports: createNotification, listNotificationsForUser, listClientNotificationRecipients, listAdminNotificationRecipients, isRetiredCrmApprovalRow, filterNotificationsByScope; internal imports: 6; package imports: 1

## `src/features/notifications/types.ts`
- Status: tracked-clean
- System: web
- Group: src/features / notifications
- Ownership: feature module: notifications
- Type: TypeScript module
- Construction: code module
- Lines: 34
- Bytes: 773
- Imported by: src/features/notifications/server.ts
- Used by groups: src/features / notifications
- Feature module: notifications
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/notifications/discussions.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/admin/actions/campaign-action-items.test.ts, … (+7 more)
- Exports: AppNotification, CreateNotificationInput
- Symbol details: interface AppNotification (exported), interface CreateNotificationInput (exported)
- Defines: AppNotification, CreateNotificationInput
- Contents summary: exports: AppNotification, CreateNotificationInput

## `src/features/notifications/workflow.ts`
- Status: tracked-clean
- System: web
- Group: src/features / notifications
- Ownership: feature module: notifications
- Type: TypeScript module
- Construction: code module
- Lines: 39
- Bytes: 1134
- Imports (internal): src/features/notifications/server.ts
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Depends on groups: src/features / notifications
- Used by groups: Tests / Features, src/app / admin, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items
- Feature module: notifications
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, … (+3 more)
- Tests related (direct): __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/notifications/workflow.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/features/campaign-action-items/server.test.ts
- Exports: notifyWorkflowAssignee
- Symbol details: function notifyWorkflowAssignee (exported), type WorkflowAssignmentVisibility, interface WorkflowAssignmentNotificationInput
- Defines: notifyWorkflowAssignee, adminIds, WorkflowAssignmentVisibility, WorkflowAssignmentNotificationInput
- Contents summary: exports: notifyWorkflowAssignee; internal imports: 1
