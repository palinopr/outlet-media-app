# Impact: src/lib/agent-dispatch.ts

Generated from the current working tree on 2026-04-10 22:12:57.

- Category: Shared web libraries
- Impact score: 59
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx
- Imported by: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, src/app/api/event-comments/route.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.test.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Tests related: __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/campaign-action-items/server.test.ts, src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- DB objects: agent_tasks
- Env vars: none
- Mutation symbols: enqueueExternalAgentTask, EnqueueExternalAgentTaskInput
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/features / system-events, src/lib
- Used by groups: Tests / Features, src/app / api, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items
- Summary: exports: enqueueExternalAgentTask; internal imports: 2; package imports: 1
