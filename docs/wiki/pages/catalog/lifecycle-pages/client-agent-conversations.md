# Client agent conversation lifecycle

Generated from the current working tree on 2026-04-10 21:51:44.

Files and DB objects involved in client-agent threads, messages, runtime responses, and client agent UI/API routes.

- DB objects: calls, client_agent_messages, client_agent_threads, clients
- Routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, … (+3 more)
- Feature files: src/features/access/revalidation.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/model.ts, src/features/client-agent/policy.test.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.test.ts, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, … (+31 more)
- Libs / agents / actions: agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/google-ads.test.ts, … (+3 more)
- Mutation-oriented files: agent/src/services/queue-service.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/users.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/components/admin/campaigns/campaign-table.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/user-table.tsx, src/features/client-agent/components/agent-shell.tsx, … (+9 more)
- Tests: __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, … (+40 more)
- Docs: AGENTS.md, README.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/google-ads-api.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, … (+38 more)
- Behavior signals: client component/module (35), server action/module (9), calls revalidatePath() (8), calls notFound() (5), calls redirect() (4), sets dynamic rendering mode (3), defines generateMetadata (2), calls revalidateTag() (1), calls unstable_noStore() (1)
- Auth signals: references membership/scope access concepts (28), imports Clerk server auth (26), calls currentUser() (7), calls auth() (4), contains explicit access/role guard helper usage (1)

## Database objects

### `calls`
- Kinds: table
- Migrations: supabase/migrations/20260306184000_backend_tables_rls.sql
- Related routes: src/app/api/ticketmaster/tm1/snapshot/route.ts
- Related features/libs/agents: agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/runtime.test.ts, src/lib/database.types.ts, src/lib/google-ads.test.ts, src/lib/ticketmaster/tm1-client.test.ts
- Related tests/docs: __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, docs/context/google-ads-api.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-project-restructure-design.md, docs/plans/2026-03-02-project-restructure-plan.md, docs/plans/2026-03-03-direct-meta-api-campaigns-design.md, docs/plans/2026-03-03-direct-meta-api-campaigns-plan.md, docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md, docs/superpowers/plans/2026-04-01-whatsapp-ticket-concierge-runner.md, … (+3 more)

### `client_agent_messages`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260401173000_client_agent_context_payload.sql
- Related routes: none
- Related features/libs/agents: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/lib/database.types.ts
- Related tests/docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md, docs/superpowers/plans/2026-04-01-client-agent-tool-driven-runtime.md

### `client_agent_threads`
- Kinds: table
- Migrations: supabase/migrations/20260331160000_client_agent_tab.sql
- Related routes: none
- Related features/libs/agents: src/features/client-agent/store.test.ts, src/features/client-agent/store.ts, src/lib/database.types.ts
- Related tests/docs: docs/superpowers/plans/2026-03-31-client-agent-tab.md

### `clients`
- Kinds: table
- Migrations: supabase/migrations/20260306152000_client_membership_rls.sql, supabase/migrations/20260311120000_client_events_enabled.sql, supabase/migrations/20260322100000_client_portal_reset.sql, supabase/migrations/20260331160000_client_agent_tab.sql, supabase/migrations/20260403120000_clients_read_member_policy.sql
- Related routes: src/app/admin/campaigns/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts
- Related features/libs/agents: src/features/access/revalidation.ts, src/features/client-agent/tools/breakdowns.test.ts, src/features/client-agent/tools/compare-timeseries.test.ts, src/features/client-agent/tools/details.test.ts, src/features/client-agent/tools/overview.test.ts, src/features/client-agent/tools/search.test.ts, src/features/client-portal/config.test.ts, src/features/client-portal/config.ts, src/features/client-portal/entry.ts, src/features/events/server.ts, src/features/invitations/server.ts, src/features/notifications/server.ts, … (+6 more)
- Related tests/docs: __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, … (+49 more)

## Route surfaces
- src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/events/page.tsx, src/app/admin/events/[eventId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/api/admin/invite/route.ts, src/app/api/admin/users/[id]/route.ts, src/app/api/client/[slug]/agent/threads/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/app/api/ticketmaster/tm1/snapshot/route.ts, src/app/client/[slug]/agent/loading.tsx, src/app/client/[slug]/agent/page.tsx

## Feature files
- src/features/access/revalidation.ts, src/features/client-agent/components/agent-shell.test.tsx, src/features/client-agent/components/agent-shell.tsx, src/features/client-agent/components/conversation-pane.tsx, src/features/client-agent/components/thread-list.tsx, src/features/client-agent/model.test.ts, src/features/client-agent/model.ts, src/features/client-agent/policy.test.ts, src/features/client-agent/policy.ts, src/features/client-agent/range.test.ts, src/features/client-agent/range.ts, src/features/client-agent/readers.ts, src/features/client-agent/runtime.test.ts, src/features/client-agent/runtime.ts, src/features/client-agent/server.test.ts, src/features/client-agent/server.ts, … (+27 more)

## Libs / agents / admin actions
- agent/src/events/message-handler.test.ts, agent/src/events/message-handler.ts, agent/src/runner.test.ts, agent/src/services/queue-service.ts, src/app/admin/actions/campaigns.ts, src/app/admin/actions/clients.test.ts, src/app/admin/actions/clients.ts, src/app/admin/actions/search.test.ts, src/app/admin/actions/search.ts, src/app/admin/actions/users.ts, src/lib/database.types.ts, src/lib/google-ads.test.ts, src/lib/member-access.ts, src/lib/meta-campaigns.ts, src/lib/ticketmaster/tm1-client.test.ts

## Tests and docs
- Tests: __tests__/api/agents-jobs.test.ts, __tests__/api/alerts.test.ts, __tests__/features/access/revalidation.test.ts, __tests__/features/agent-outcomes/read-clients.test.ts, __tests__/features/assets/read-clients.test.ts, __tests__/features/campaign-action-items/read-clients.test.ts, __tests__/features/campaign-comments/read-clients.test.ts, __tests__/features/clients/summary.test.ts, __tests__/features/conversations/read-clients.test.ts, __tests__/features/dashboard/read-clients.test.ts, __tests__/features/event-follow-up-items/read-clients.test.ts, __tests__/features/events/read-clients.test.ts, __tests__/features/notifications/server.test.ts, __tests__/features/reports/integration.test.ts, __tests__/features/reports/read-clients.test.ts, __tests__/features/settings/summary.test.ts, … (+36 more)
- Docs: AGENTS.md, README.md, docs/context/current-priorities.md, docs/context/customer-facing-disclosure-rules.md, docs/context/engineering-principles.md, docs/context/google-ads-api.md, docs/context/product-direction.md, docs/context/salvage-map.md, docs/context/tm1-capability-map.md, docs/context/tm1-prd130-capability-map.md, docs/plans/2026-02-23-client-portal-redesign.md, docs/plans/2026-02-26-discord-agent-architecture-design.md, docs/plans/2026-02-26-discord-agent-architecture-plan.md, docs/plans/2026-03-02-admin-crud-design.md, docs/plans/2026-03-02-admin-crud-plan.md, docs/plans/2026-03-02-meta-oauth-integration-design.md, … (+34 more)
