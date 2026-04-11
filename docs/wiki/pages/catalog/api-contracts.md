# API Contract Map

Generated from the current working tree on 2026-04-10 21:51:44.

This page documents each `src/app/api/**/route.ts` file with its methods, request/response signals, validation symbols, dependency stack, and related tests.

## `/api/admin/activity`
- Route file: `src/app/api/admin/activity/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 503
- Auth signals: imports Clerk server auth, calls currentUser()
- Validation symbols: ActivitySchema
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

## `/api/admin/invite`
- Route file: `src/app/api/admin/invite/route.ts`
- Methods: POST
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 500, 400
- Auth signals: imports Clerk server auth
- Validation symbols: none
- Direct internal imports: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: src/app/api/admin/invite/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## `/api/admin/users/[id]`
- Route file: `src/app/api/admin/users/[id]/route.ts`
- Methods: PATCH
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: references membership/scope access concepts
- Validation symbols: UpdateUserSchema
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

## `/api/agent-outcomes/action-item`
- Route file: `src/app/api/agent-outcomes/action-item/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 200, 201
- Auth signals: none
- Validation symbols: parsed
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/features/system-events/server.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts, src/features/workflow/revalidation.ts
- Feature modules touched: system-events, agent-outcomes, asset-follow-up-items, campaign-action-items, event-follow-up-items, workflow, assets, notifications, campaigns
- Shared libs touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/supabase.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/member-access.ts, src/lib/client-slug.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

## `/api/agents`
- Route file: `src/app/api/agents/route.ts`
- Methods: POST, GET
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Auth signals: none
- Validation symbols: parsed
- Direct internal imports: src/features/system-events/server.ts, src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: system-events
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Related tests: __tests__/api/agents.test.ts
- Contents summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

## `/api/agents/email/watch`
- Route file: `src/app/api/agents/email/watch/route.ts`
- Methods: POST
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 401
- Auth signals: none
- Validation symbols: none
- Direct internal imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: none
- Contents summary: Next.js route handler for `/api/agents/email/watch`; route handlers: POST; exports: POST; package imports: 1

## `/api/agents/heartbeat`
- Route file: `src/app/api/agents/heartbeat/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 503, 500
- Auth signals: none
- Validation symbols: parsed
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/agents-heartbeat.test.ts
- Contents summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

## `/api/agents/job/[id]`
- Route file: `src/app/api/agents/job/[id]/route.ts`
- Methods: GET
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/agents/job/[id]`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `/api/agents/jobs`
- Route file: `src/app/api/agents/jobs/route.ts`
- Methods: GET
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Related tests: __tests__/api/agents-jobs.test.ts
- Contents summary: Next.js route handler for `/api/agents/jobs`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `/api/alerts`
- Route file: `src/app/api/alerts/route.ts`
- Methods: POST, PATCH, GET
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/alerts.test.ts
- Contents summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

## `/api/campaign-comments`
- Route file: `src/app/api/campaign-comments/route.ts`
- Methods: GET, POST, PATCH, DELETE
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Auth signals: imports Clerk server auth, calls currentUser()
- Validation symbols: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-comments/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Feature modules touched: campaign-comments, notifications, client-portal, system-events, workflow, assets, campaigns
- Shared libs touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/member-access.ts
- Related tests: src/app/api/campaign-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

## `/api/campaign-comments/action-item`
- Route file: `src/app/api/campaign-comments/action-item/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Auth signals: none
- Validation symbols: parsed
- Direct internal imports: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/features/campaign-action-items/server.ts, src/features/workflow/revalidation.ts, src/lib/supabase.ts
- Feature modules touched: campaign-action-items, workflow, notifications, system-events, assets, campaigns
- Shared libs touched: src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/lib/client-slug.ts, src/lib/workspace-types.ts, src/lib/action-item-labels.ts, src/lib/agent-dispatch.ts, src/lib/member-access.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

## `/api/client/[slug]/agent/threads`
- Route file: `src/app/api/client/[slug]/agent/threads/route.ts`
- Methods: GET, POST
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/features/client-agent/server.ts
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs touched: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/api/client/[slug]/agent/threads/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads`; route handlers: GET, POST; exports: GET, POST; internal imports: 1; package imports: 1

## `/api/client/[slug]/agent/threads/[threadId]`
- Route file: `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Methods: GET
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/features/client-agent/server.ts
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs touched: src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, src/lib/client-slug.ts
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

## `/api/client/[slug]/agent/threads/[threadId]/messages`
- Route file: `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Methods: POST
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: SendMessageSchema, parsed
- Direct internal imports: src/lib/api-helpers.ts, src/features/client-agent/server.ts, src/features/client-agent/types.ts, src/features/client-agent/thread-context.ts
- Feature modules touched: client-agent, client-portal, system-events, workflow, reports, agent-outcomes, dashboard, events, assets, approvals, conversations, event-comments, … (+1 more)
- Shared libs touched: src/lib/api-helpers.ts, src/lib/member-access.ts, src/lib/supabase.ts, src/lib/constants.ts, src/lib/meta-campaigns.ts, src/lib/meta-api.ts, src/lib/formatters.tsx, src/lib/status.ts, src/lib/campaign-client-assignment.ts, src/lib/workspace-types.ts, … (+1 more)
- Related tests: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]/messages`; route handlers: POST; exports: POST; internal imports: 4; package imports: 2

## `/api/contact`
- Route file: `src/app/api/contact/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## `/api/event-comments`
- Route file: `src/app/api/event-comments/route.ts`
- Methods: GET, POST, PATCH
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 201
- Auth signals: imports Clerk server auth, calls currentUser()
- Validation symbols: CreateScopedEventCommentSchema
- Direct internal imports: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Feature modules touched: event-comments, events, notifications, client-portal, system-events, workflow, assets, campaigns, invitations
- Shared libs touched: src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/lib/member-access.ts, src/lib/campaign-client-assignment.ts, src/lib/client-slug.ts, src/lib/formatters.tsx, src/lib/workspace-types.ts, … (+1 more)
- Related tests: src/app/api/event-comments/route.test.ts
- Contents summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST, PATCH; exports: GET, POST, PATCH; internal imports: 11; package imports: 3

## `/api/health`
- Route file: `src/app/api/health/route.ts`
- Methods: GET
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: package.json
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/api/health/route.test.ts
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

## `/api/ingest`
- Route file: `src/app/api/ingest/route.ts`
- Methods: POST, GET
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-tm-events.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/ingest-tm-demographics.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/ingest.test.ts
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 6; package imports: 1

## `/api/meta/callback`
- Route file: `src/app/api/meta/callback/route.ts`
- Methods: GET
- Request signals: reads query/search params
- Response signals: none
- Auth signals: none
- Validation symbols: none
- Direct internal imports: none
- Feature modules touched: none
- Shared libs touched: none
- Related tests: src/app/api/meta/callback/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/callback`; route handlers: GET; exports: GET; package imports: 1

## `/api/meta/data-deletion`
- Route file: `src/app/api/meta/data-deletion/route.ts`
- Methods: POST
- Request signals: reads form-data body
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400, 403, 503
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Related tests: src/app/api/meta/data-deletion/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `/api/ticketmaster/tm1/move-selection`
- Route file: `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Methods: POST
- Request signals: reads JSON body, reads headers, reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Auth signals: none
- Validation symbols: StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, SuccessActionSchema, MoveTargetSchema, BodySchema, … (+1 more)
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `/api/ticketmaster/tm1/request-move-selection`
- Route file: `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Methods: POST
- Request signals: reads JSON body, reads headers, reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Auth signals: none
- Validation symbols: StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, AllocationTargetSchema, ResolutionStatusSchema, BodySchema, … (+1 more)
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/request-move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `/api/ticketmaster/tm1/snapshot`
- Route file: `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Methods: GET
- Request signals: reads headers, reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Auth signals: none
- Validation symbols: QuerySchema, parsed
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Related tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/snapshot`; route handlers: GET; exports: GET; internal imports: 2; package imports: 2

## `/api/user/profile`
- Route file: `src/app/api/user/profile/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Auth signals: imports Clerk server auth
- Validation symbols: ProfileSchema, parsed
- Direct internal imports: src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts
- Related tests: none
- Contents summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3
