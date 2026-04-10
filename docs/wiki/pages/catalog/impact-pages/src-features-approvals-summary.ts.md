# Impact: src/features/approvals/summary.ts

Generated from the current working tree on 2026-04-10 15:42:38.

- Category: Feature files
- Impact score: 54
- Ownership: feature module: approvals
- Feature module: approvals
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Imported by: __tests__/features/approvals/summary.test.ts, src/features/approvals/server.ts
- Tests related: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/shell-import-smoke.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, … (+14 more)
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Depends on groups: src/lib, src/features / approvals
- Used by groups: Tests / Features, src/features / approvals
- Summary: exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2
