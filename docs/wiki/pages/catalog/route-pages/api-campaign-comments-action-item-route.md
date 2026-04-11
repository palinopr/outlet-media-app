# /api/campaign-comments/action-item

Generated from the current working tree on 2026-04-10 21:27:09.

- Route file: `src/app/api/campaign-comments/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/features/campaign-action-items/server.ts, src/features/workflow/revalidation.ts, src/lib/supabase.ts
- Feature modules touched: campaign-action-items, workflow, notifications, system-events, assets, campaigns
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/member-access.ts
- Database objects touched: campaign_comments, meta_campaigns, campaign_client_overrides, campaign_action_items, notifications, agent_tasks, system_events, approval_requests, asset_comments, asset_follow_up_items, event_comments, event_follow_up_items, clients, client_members, … (+3 more)
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

## Stack by group
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/member-access.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Validation symbols: parsed
