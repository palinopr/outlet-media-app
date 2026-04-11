# /api/campaign-comments

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/api/campaign-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET, POST, PATCH, DELETE
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-comments/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Feature modules touched: campaign-comments, notifications, client-portal, system-events, workflow, assets, campaigns
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/member-access.ts
- Database objects touched: meta_campaigns, campaign_comments, notifications, agent_tasks, campaign_client_overrides, system_events, clients, client_members, client_member_campaigns, client_member_events, approval_requests, campaign_action_items, asset_comments, asset_follow_up_items, … (+3 more)
- Direct tests: src/app/api/campaign-comments/route.test.ts
- All linked tests: src/app/api/campaign-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

## Stack by group
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaign-comments: src/features/campaign-comments/server.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/scope.ts
- src/features / notifications: src/features/notifications/discussions.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/member-access.ts

## API behavior
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Validation symbols: none
