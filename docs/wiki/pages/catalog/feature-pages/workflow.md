# Feature: workflow

Generated from the current working tree on 2026-04-10 16:45:57.

- Files: 2
- Entry files: src/features/workflow/revalidation.ts
- Component files: none
- Client files: none
- Server files: none
- Route users: src/app/api/agent-outcomes/action-item/route.ts, src/app/api/campaign-comments/action-item/route.ts, src/app/api/campaign-comments/route.ts, src/app/api/event-comments/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/client/[slug]/agent/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx
- Database objects touched: notifications
- Depends on feature modules: none
- Used by feature modules: client-agent (2)
- Auth/access signals: none
- Behavior signals: calls revalidatePath()
- Direct tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts
- All linked tests: src/app/admin/actions/campaign-action-items.test.ts, src/app/api/campaign-comments/route.test.ts, src/app/api/event-comments/route.test.ts, src/features/client-agent/server.test.ts, src/features/workflow/revalidation.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts, src/app/api/client/[slug]/agent/threads/route.test.ts, src/app/client/[slug]/agent/page.test.tsx, src/app/admin/campaigns/page.test.tsx, … (+2 more)

## Exporting files
- `src/features/workflow/revalidation.ts` — exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath

## File list
- `src/features/workflow/revalidation.test.ts` — tests/describes: workflow revalidation paths; keeps campaign workflow revalidation on surviving admin and client routes; collapses asset workflow revalidation onto kept surfaces; internal imports: 1; package imports: 1
- `src/features/workflow/revalidation.ts` — exports: getCampaignWorkflowPaths, getAssetWorkflowPaths, getEventWorkflowPaths, getApprovalWorkflowPaths, revalidateWorkflowPaths, revalidateClientAgentPath; package imports: 1
