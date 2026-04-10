# /api/event-comments

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/api/event-comments/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET, POST
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Feature modules touched: event-comments, events, notifications, client-portal, system-events, workflow, assets, campaigns, invitations
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/formatters.tsx, src/lib/workspace-types.ts, src/lib/status.ts
- Database objects touched: event_comments, notifications, agent_tasks, tm_events, meta_campaigns, event_follow_up_items, clients, system_events, client_members, client_member_campaigns, client_member_events, campaign_client_overrides, approval_requests, campaign_action_items, … (+4 more)
- Direct tests: src/app/api/event-comments/route.test.ts
- All linked tests: src/app/api/event-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST; exports: GET, POST; internal imports: 11; package imports: 3

## Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / campaigns: src/features/campaigns/ownership-sync.ts
- src/features / client-portal: src/features/client-portal/scope.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / notifications: src/features/notifications/discussions.ts, src/features/notifications/server.ts, src/features/notifications/types.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/formatters.tsx, src/lib/workspace-types.ts, src/lib/status.ts

## API behavior
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Validation symbols: CreateScopedEventCommentSchema
