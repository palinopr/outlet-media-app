# /api/agent-outcomes/action-item

Generated from the current working tree on 2026-04-10 16:45:57.

- Route file: `src/app/api/agent-outcomes/action-item/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/features/system-events/server.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts, src/features/workflow/revalidation.ts
- Feature modules touched: system-events, agent-outcomes, asset-follow-up-items, campaign-action-items, event-follow-up-items, workflow, assets, notifications, campaigns
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
- Database objects touched: system_events, agent_tasks, campaign_action_items, asset_follow_up_items, event_follow_up_items, notifications, ad_assets, tm_events, meta_campaigns, campaign_client_overrides, clients, client_members, client_member_campaigns, client_member_events, … (+4 more)
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

## Stack by group
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / asset-follow-up-items: src/features/asset-follow-up-items/server.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-action-items: src/features/campaign-action-items/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / event-follow-up-items: src/features/event-follow-up-items/server.ts
- src/features / notifications: src/features/notifications/workflow.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 200, 201
- Validation symbols: parsed
