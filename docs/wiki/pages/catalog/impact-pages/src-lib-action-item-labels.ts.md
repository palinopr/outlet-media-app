# Impact: src/lib/action-item-labels.ts

Generated from the current working tree on 2026-04-10 16:52:39.

- Category: Shared web libraries
- Impact score: 38
- Ownership: shared web library
- Feature module: none
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts
- Imported by: src/app/admin/actions/campaign-action-items.ts, src/app/client/[slug]/components/campaign-operating-panel.tsx, src/app/client/[slug]/components/event-operating-panel.tsx, src/components/admin/campaigns/campaign-detail-dashboard.tsx, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/app/client/[slug]/components/event-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/campaign-action-items/read-clients.test.ts, src/features/campaign-action-items/server.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, src/app/shell-import-smoke.test.ts, src/app/client/[slug]/event/[eventId]/page.test.tsx
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: none
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items
- Summary: exports: taskStatusLabel, FIELD_LABELS; internal imports: 1
