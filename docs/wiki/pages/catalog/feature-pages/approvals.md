# Feature: approvals

Generated from the current working tree on 2026-04-10 15:42:38.

- Files: 2
- Entry files: src/features/approvals/server.ts, src/features/approvals/summary.ts
- Component files: none
- Client files: none
- Server files: src/features/approvals/server.ts
- Route users: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx
- Database objects touched: approval_requests
- Depends on feature modules: assets (1)
- Used by feature modules: campaigns (2), dashboard (1)
- Auth/access signals: references membership/scope access concepts
- Behavior signals: none
- Direct tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- All linked tests: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, __tests__/features/reports/server.test.ts, src/app/shell-import-smoke.test.ts, … (+16 more)

## Exporting files
- `src/features/approvals/server.ts` — exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest
- `src/features/approvals/summary.ts` — exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope

## File list
- `src/features/approvals/server.ts` — exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5
- `src/features/approvals/summary.ts` — exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2
