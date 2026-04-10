# src/features / approvals

Generated from the current working tree on 2026-04-10 16:14:38.

- Files: 2
- File kinds: TypeScript module (2)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/approvals/server.ts`
- Status: modified
- System: web
- Group: src/features / approvals
- Ownership: feature module: approvals
- Type: TypeScript module
- Construction: code module
- Lines: 255
- Bytes: 8283
- Imports (internal): src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/features/assets/server.ts, src/features/approvals/summary.ts
- Imported by: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/features/approvals/summary.ts, src/features/campaigns/client-operating.ts, src/features/campaigns/server.ts, src/features/dashboard/server.ts, src/features/events/client-operating.ts
- Depends on groups: src/lib, src/features / assets, src/features / approvals
- Used by groups: Tests / Features, src/features / approvals, src/features / campaigns, src/features / dashboard, src/features / events
- Feature module: approvals
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, … (+20 more)
- Tests related (direct): __tests__/features/approvals/server.test.ts, __tests__/features/approvals/summary.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts
- Exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest
- Symbol details: function approvalMatchesCampaign (exported), function listApprovalRequests (exported), function listCampaignApprovalRequests (exported), function listEventApprovalRequests (exported), function mapApproval, function buildApprovalListQuery, const APPROVAL_SELECT, type ApprovalAudience (exported), type ApprovalStatus (exported), interface ApprovalRequest (exported), interface ListApprovalRequestsOptions, interface ListCampaignApprovalRequestsOptions, interface ListEventApprovalRequestsOptions
- Defines: approvalMatchesCampaign, mapApproval, buildApprovalListQuery, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, APPROVAL_SELECT, approvalReadDb, requestedLimit, shouldOverfetchForScope, effectiveCampaignIds, effectiveCampaignIdSet, … (+12 more)
- Contents summary: exports: approvalMatchesCampaign, listApprovalRequests, listCampaignApprovalRequests, listEventApprovalRequests, ApprovalAudience, ApprovalStatus, ApprovalRequest; internal imports: 5

## `src/features/approvals/summary.ts`
- Status: tracked-clean
- System: web
- Group: src/features / approvals
- Ownership: feature module: approvals
- Type: TypeScript module
- Construction: code module
- Lines: 62
- Bytes: 2275
- Imports (internal): src/lib/member-access.ts, src/features/approvals/server.ts
- Imported by: __tests__/features/approvals/summary.test.ts, src/features/approvals/server.ts
- Depends on groups: src/lib, src/features / approvals
- Used by groups: Tests / Features, src/features / approvals
- Feature module: approvals
- Route owners: src/app/client/[slug]/campaign/[campaignId]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/client/[slug]/event/[eventId]/page.tsx, src/app/admin/reports/page.tsx, src/app/client/[slug]/reports/page.tsx, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, … (+1 more)
- Tests related: __tests__/features/approvals/summary.test.ts, __tests__/features/approvals/server.test.ts, __tests__/features/dashboard/integration.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/dashboard/server.test.ts, src/app/client/[slug]/components/campaign-operating-panel.test.tsx, src/components/admin/campaigns/campaign-detail-dashboard.test.tsx, __tests__/features/events/read-clients.test.ts, … (+20 more)
- Tests related (direct): __tests__/features/approvals/summary.test.ts
- Exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope
- Symbol details: function approvalCampaignId (exported), function approvalEventId (exported), function approvalAssetId (exported), function approvalIsWithinScope (exported), function filterApprovalRequestsByScope (exported), function approvalString, function normalizeScopeSet
- Defines: approvalString, normalizeScopeSet, approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope, value, campaignIds, eventIds, assetIds, campaignId, … (+2 more)
- Contents summary: exports: approvalCampaignId, approvalEventId, approvalAssetId, approvalIsWithinScope, filterApprovalRequestsByScope; internal imports: 2
