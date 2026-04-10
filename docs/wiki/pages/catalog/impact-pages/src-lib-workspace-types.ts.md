# Impact: src/lib/workspace-types.ts

Generated from the current working tree on 2026-04-10 18:46:37.

- Category: Shared web libraries
- Impact score: 97
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/dashboard/summary.ts, src/features/event-follow-up-items/server.ts, src/features/events/summary.ts, src/lib/action-item-labels.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/dashboard/summary.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/summary.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx, … (+24 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: none
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / dashboard, src/features / event-follow-up-items, src/features / events, src/lib
- Summary: exports: TASK_STATUSES, TASK_PRIORITIES, TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TaskStatus, TaskPriority
