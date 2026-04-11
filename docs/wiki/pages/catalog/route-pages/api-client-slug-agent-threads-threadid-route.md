# /api/client/[slug]/agent/threads/[threadId]

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/features/client-agent/server.ts
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs/runtime touched: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Database objects touched: clients, system_events, client_members, client_member_campaigns, client_member_events, client_agent_threads, client_agent_messages, client_access_invites, tm_events, leads, tm_event_demographics, meta_campaigns, agent_tasks, campaign_action_items, … (+10 more)
- Direct tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- All linked tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

## Stack by group
- src-features-event-comments: src/features/event-comments/server.ts
- src/app / client: src/app/client/[slug]/campaign/[campaignId]/data.ts, src/app/client/[slug]/event/[eventId]/data.ts, src/app/client/[slug]/types.ts, src/app/client/[slug]/lib.ts
- src/features / agent-outcomes: src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts
- src/features / approvals: src/features/approvals/server.ts, src/features/approvals/summary.ts
- src/features / assets: src/features/assets/server.ts, src/features/assets/types.ts
- src/features / client-agent: src/features/client-agent/server.ts, src/features/client-agent/model.ts, src/features/client-agent/store.ts, src/features/client-agent/thread-context.ts, src/features/client-agent/types.ts, src/features/client-agent/runtime.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.ts, src/features/client-agent/tools/index.ts, src/features/client-agent/tool-contracts.ts, src/features/client-agent/tools/search.ts, src/features/client-agent/tools/overview.ts, … (+4 more)
- src/features / client-portal: src/features/client-portal/config.ts, src/features/client-portal/access.ts, src/features/client-portal/entry.ts, src/features/client-portal/insights.ts, src/features/client-portal/types.ts, src/features/client-portal/campaign-detail.ts, src/features/client-portal/event-detail.ts, src/features/client-portal/scope.ts
- src/features / conversations: src/features/conversations/server.ts, src/features/conversations/summary.ts
- src/features / dashboard: src/features/dashboard/server.ts, src/features/dashboard/summary.ts
- src/features / events: src/features/events/server.ts, src/features/events/summary.ts
- src/features / invitations: src/features/invitations/types.ts
- src/features / reports: src/features/reports/server.ts, src/features/reports/summary.ts
- src/features / system-events: src/features/system-events/server.ts
- src/features / workflow: src/features/workflow/revalidation.ts
- src/lib: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts

## API behavior
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
