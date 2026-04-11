# src/features / workflow

Generated from the current working tree on 2026-04-10 21:59:58.

- Files: 2
- File kinds: test file (1), TypeScript module (1)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/features/workflow/revalidation.test.ts`
- Status: tracked-clean
- System: web
- Group: src/features / workflow
- Ownership: feature module: workflow
- Type: test file
- Construction: test specification
- Lines: 54
- Bytes: 1486
- Imports (internal): src/features/workflow/revalidation.ts
- Imports (packages): vitest
- Depends on groups: src/features / workflow
- Feature module: workflow
- Tests / describe labels: workflow revalidation paths, keeps campaign workflow revalidation on surviving admin and client routes, collapses asset workflow revalidation onto kept surfaces, keeps event workflow revalidation on surviving routes only, drops approvals, reports, notifications, updates, and workspace paths from approval revalidation
- Contents summary: tests/describes: workflow revalidation paths; keeps campaign workflow revalidation on surviving admin and client routes; collapses asset workflow revalidation onto kept surfaces; internal imports: 1; package imports: 1

## `src/features/workflow/revalidation.ts`
- Status: tracked-clean
- System: web
- Group: src/features / workflow
- Ownership: feature module: workflow
- Type: TypeScript module
- Construction: code module
- Lines: 102
- Bytes: 3118
- Imports (packages): next/cache
- Imported by: src/app/admin/actions/campaign-action-items.test.ts, src/app/admin/actions/campaign-action-items.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/event-follow-up-items.ts, src/app/admin/actions/events.ts, src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.test.ts, … (+4 more)
- Used by groups: src/app / admin, src/app / api, src/features / client-agent, src/features / workflow
- Feature module: workflow
- Route owners: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, … (+4 more)
- Routes related (direct): src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts
- Tests related: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, … (+6 more)
- Tests related (direct): src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts
- Exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath
- Symbol details: function getCampaignWorkflowPaths (exported), function getAssetWorkflowPaths (exported), function getEventWorkflowPaths (exported), function getApprovalWorkflowPaths (exported), function revalidateWorkflowPaths (exported), function revalidateClientAgentPath (exported), function uniquePaths, function clientPaths, function metadataString, function clientCampaignsPath, interface ApprovalWorkflowPathsInput
- Defines: uniquePaths, clientPaths, metadataString, clientCampaignsPath, getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath, value, clientSlug, … (+4 more)
- Contents summary: exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath; package imports: 1
