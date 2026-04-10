# src/app / api

Generated from the current working tree on 2026-04-10 18:46:37.

- Files: 40
- File kinds: Next.js route handler (25), test file (12), TypeScript module (3)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/app/api/admin/activity/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/admin/activity
- Lines: 44
- Bytes: 1389
- Imports (internal): src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): next/server, zod, @clerk/nextjs/server
- Depends on groups: src/lib
- Exports: POST
- Symbol details: function POST (exported), const ActivitySchema
- Defines: POST, ActivitySchema, adminErr, caller
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

## `src/app/api/admin/invite/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/admin/invite
- Lines: 132
- Bytes: 3388
- Imports (internal): src/lib/api-helpers.ts, src/app/api/admin/invite/route.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/lib, src/app / api
- Defines: maybeSingle, eq, select, inviteInsertSingle, inviteInsertSelect, inviteInsert, inviteUpdateEq, inviteUpdate, createInvitation, clerkClientMock, actual, response
- Tests / describe labels: POST /api/admin/invite, creates a DB invite row and passes only transition metadata into Clerk
- Contents summary: tests/describes: POST /api/admin/invite; creates a DB invite row and passes only transition metadata into Clerk; internal imports: 3; package imports: 2

## `src/app/api/admin/invite/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/admin/invite
- Lines: 101
- Bytes: 3287
- Imports (internal): src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): next/server, @clerk/nextjs/server
- Imported by: src/app/api/admin/invite/route.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/admin/invite/route.test.ts
- Tests related (direct): src/app/api/admin/invite/route.test.ts
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, adminErr, normalizedEmail, baseUrl, redirectUrl, client, invitation, clerkErr, detail, status
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## `src/app/api/admin/users/[id]/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: PATCH
- Route: /api/admin/users/[id]
- Lines: 73
- Bytes: 1939
- Imports (internal): src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): next/server, zod
- Depends on groups: src/lib
- Exports: PATCH
- Symbol details: function PATCH (exported), const UpdateUserSchema
- Defines: PATCH, UpdateUserSchema, adminErr, id, remainingSlugs
- Route handlers: PATCH
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

## `src/app/api/agent-outcomes/action-item/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/agent-outcomes/action-item
- Lines: 185
- Bytes: 6454
- Imports (internal): src/lib/api-helpers.ts, src/lib/text-utils.ts, src/features/system-events/server.ts, src/features/agent-outcomes/server.ts, src/features/agent-outcomes/summary.ts, src/features/asset-follow-up-items/server.ts, src/features/campaign-action-items/server.ts, src/features/event-follow-up-items/server.ts, src/features/workflow/revalidation.ts
- Imports (packages): next/server
- Depends on groups: src/lib, src/features / system-events, src/features / agent-outcomes, src/features / asset-follow-up-items, src/features / campaign-action-items, src/features / event-follow-up-items, src/features / workflow
- Exports: POST
- Symbol details: function POST (exported), function metadataString, function agentLabel, function buildActionItemTitle, function buildActionItemDescription
- Defines: metadataString, agentLabel, buildActionItemTitle, buildActionItemDescription, POST, value, agentName, assetName, eventName, outcomeText, sections, guard, … (+12 more)
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/agent-outcomes/action-item`; route handlers: POST; exports: POST; internal imports: 9; package imports: 1

## `src/app/api/agents/email/watch/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/agents/email/watch
- Lines: 22
- Bytes: 506
- Imports (packages): next/server
- Exports: POST
- Symbol details: function POST (exported), function unauthorized
- Defines: unauthorized, POST, expectedSecret, url, secret
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/agents/email/watch`; route handlers: POST; exports: POST; package imports: 1

## `src/app/api/agents/heartbeat/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/agents/heartbeat
- Lines: 39
- Bytes: 1096
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Imports (packages): next/server
- Imported by: __tests__/api/agents-heartbeat.test.ts
- Depends on groups: src/lib
- Used by groups: Tests / API
- Tests related: __tests__/api/agents-heartbeat.test.ts
- Tests related (direct): __tests__/api/agents-heartbeat.test.ts
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, raw, parsed, secretErr
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

## `src/app/api/agents/job/[id]/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/agents/job/[id]
- Lines: 26
- Bytes: 612
- Imports (internal): src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Imports (packages): next/server
- Depends on groups: src/lib
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, adminErr, id, job
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/agents/job/[id]`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `src/app/api/agents/jobs/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/agents/jobs
- Lines: 18
- Bytes: 595
- Imports (internal): src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Imports (packages): next/server
- Imported by: __tests__/api/agents-jobs.test.ts
- Depends on groups: src/lib
- Used by groups: Tests / API
- Tests related: __tests__/api/agents-jobs.test.ts
- Tests related (direct): __tests__/api/agents-jobs.test.ts
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, adminErr, jobs
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/agents/jobs`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `src/app/api/agents/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST, GET
- Route: /api/agents
- Lines: 83
- Bytes: 2661
- Imports (internal): src/features/system-events/server.ts, src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Imports (packages): next/server, node:crypto
- Imported by: __tests__/api/agents.test.ts
- Depends on groups: src/features / system-events, src/lib
- Used by groups: Tests / API
- Tests related: __tests__/api/agents.test.ts
- Tests related (direct): __tests__/api/agents.test.ts
- Exports: POST, GET
- Symbol details: function POST (exported), function GET (exported)
- Defines: POST, GET, adminErr, raw, parsed, taskId, action, agents
- Route handlers: POST, GET
- Contents summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

## `src/app/api/alerts/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST, PATCH, GET
- Route: /api/alerts
- Lines: 65
- Bytes: 2045
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Imports (packages): next/server
- Imported by: __tests__/api/alerts.test.ts
- Depends on groups: src/lib
- Used by groups: Tests / API
- Tests related: __tests__/api/alerts.test.ts
- Tests related (direct): __tests__/api/alerts.test.ts
- Exports: POST, PATCH, GET
- Symbol details: function POST (exported), function PATCH (exported), function GET (exported)
- Defines: POST, PATCH, GET, secretErr
- Route handlers: POST, PATCH, GET
- Contents summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

## `src/app/api/campaign-comments/action-item/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/campaign-comments/action-item
- Lines: 66
- Bytes: 2423
- Imports (internal): src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/campaign-client-assignment.ts, src/features/campaign-action-items/server.ts, src/features/workflow/revalidation.ts, src/lib/supabase.ts
- Imports (packages): next/server
- Depends on groups: src/lib, src/features / campaign-action-items, src/features / workflow
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, guard, parsed, body, commentId, existingItem, campaign, effectiveClientSlug, item
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/campaign-comments/action-item`; route handlers: POST; exports: POST; internal imports: 6; package imports: 1

## `src/app/api/campaign-comments/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/campaign-comments
- Lines: 188
- Bytes: 5411
- Imports (internal): src/features/campaign-comments/server.ts, src/app/api/campaign-comments/route.ts, src/lib/api-helpers.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/notifications/discussions.ts, src/features/system-events/server.ts, src/lib/agent-dispatch.ts, src/features/workflow/revalidation.ts, src/features/client-portal/scope.ts
- Imports (packages): next/server, vitest, @clerk/nextjs/server
- Depends on groups: src/features / campaign-comments, src/app / api, src/lib, src/features / notifications, src/features / system-events, src/features / workflow, src/features / client-portal
- Symbol details: function makeGetRequest
- Defines: makeGetRequest, actual, query, response
- Tests / describe labels: campaign comments route, reads client comment GETs through the Clerk-scoped client, does not fall back to the service role for non-admin comment GETs when the Clerk-scoped client is unavailable, keeps admin comment GETs on the service role
- Contents summary: tests/describes: campaign comments route; reads client comment GETs through the Clerk-scoped client; does not fall back to the service role for non-admin comment GETs when the Clerk-scoped client is unavailable; internal imports: 10; package imports: 3

## `src/app/api/campaign-comments/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET, POST, PATCH, DELETE
- Route: /api/campaign-comments
- Lines: 389
- Bytes: 12234
- Imports (internal): src/lib/api-helpers.ts, src/lib/text-utils.ts, src/lib/api-schemas.ts, src/lib/agent-dispatch.ts, src/lib/campaign-client-assignment.ts, src/lib/supabase.ts, src/features/campaign-comments/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Imports (packages): next/server, @clerk/nextjs/server
- Imported by: src/app/api/campaign-comments/route.test.ts
- Depends on groups: src/lib, src/features / campaign-comments, src/features / notifications, src/features / client-portal, src/features / system-events, src/features / workflow
- Used by groups: src/app / api
- Tests related: src/app/api/campaign-comments/route.test.ts
- Tests related (direct): src/app/api/campaign-comments/route.test.ts
- Exports: GET, POST, PATCH, DELETE
- Symbol details: function GET (exported), function POST (exported), function PATCH (exported), function DELETE (exported), function getCampaignName, function getCampaignContext, function campaignCommentTriagePrompt
- Defines: getCampaignName, getCampaignContext, campaignCommentTriagePrompt, GET, POST, PATCH, DELETE, campaignId, clientSlug, access, commentsDb, user, … (+7 more)
- Route handlers: GET, POST, PATCH, DELETE
- Contents summary: Next.js route handler for `/api/campaign-comments`; route handlers: GET, POST, PATCH, DELETE; exports: GET, POST, PATCH, DELETE; internal imports: 11; package imports: 2

## `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/client/[slug]/agent/threads/[threadId]/messages
- Lines: 245
- Bytes: 7046
- Imports (internal): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts, src/features/client-agent/server.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/features / client-agent
- Defines: response, body, notFoundResponse, unauthenticatedResponse
- Tests / describe labels: client agent thread messages route, returns 400 when message payload is invalid, returns 200 for product refusals with the response contract shape, forwards 404 thread unavailable and 401 unauthenticated statuses, accepts creative-aware preview history and forwards context payloads
- Contents summary: tests/describes: client agent thread messages route; returns 400 when message payload is invalid; returns 200 for product refusals with the response contract shape; internal imports: 2; package imports: 1

## `src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/client/[slug]/agent/threads/[threadId]/messages
- Lines: 52
- Bytes: 1648
- Imports (internal): src/lib/api-helpers.ts, src/features/client-agent/server.ts, src/features/client-agent/types.ts, src/features/client-agent/thread-context.ts
- Imports (packages): next/server, zod
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Depends on groups: src/lib, src/features / client-agent
- Used by groups: src/app / api
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Tests related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/messages/route.test.ts
- Exports: POST
- Symbol details: function POST (exported), const SendMessageSchema, type RouteContext
- Defines: POST, SendMessageSchema, parsed, result, RouteContext
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]/messages`; route handlers: POST; exports: POST; internal imports: 4; package imports: 2

## `src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/client/[slug]/agent/threads/[threadId]
- Lines: 60
- Bytes: 1491
- Imports (internal): src/app/api/client/[slug]/agent/threads/[threadId]/route.ts, src/features/client-agent/server.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/features / client-agent
- Defines: response, body
- Tests / describe labels: client agent thread detail route, returns 404 when thread is unavailable/out of scope, returns 200 with thread payload
- Contents summary: tests/describes: client agent thread detail route; returns 404 when thread is unavailable/out of scope; returns 200 with thread payload; internal imports: 2; package imports: 1

## `src/app/api/client/[slug]/agent/threads/[threadId]/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/client/[slug]/agent/threads/[threadId]
- Lines: 16
- Bytes: 442
- Imports (internal): src/features/client-agent/server.ts
- Imports (packages): next/server
- Imported by: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/app / api
- Tests related: src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Tests related (direct): src/app/api/client/[slug]/agent/threads/[threadId]/route.test.ts
- Exports: GET
- Symbol details: function GET (exported), type RouteContext
- Defines: GET, result, RouteContext
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads/[threadId]`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

## `src/app/api/client/[slug]/agent/threads/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/client/[slug]/agent/threads
- Lines: 73
- Bytes: 1956
- Imports (internal): src/app/api/client/[slug]/agent/threads/route.ts, src/features/client-agent/server.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/features / client-agent
- Defines: response, body
- Tests / describe labels: client agent threads route, forwards list responses including 401 auth failures, forwards 200 list payload, forwards create responses including 403 feature-disabled errors
- Contents summary: tests/describes: client agent threads route; forwards list responses including 401 auth failures; forwards 200 list payload; internal imports: 2; package imports: 1

## `src/app/api/client/[slug]/agent/threads/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET, POST
- Route: /api/client/[slug]/agent/threads
- Lines: 21
- Bytes: 648
- Imports (internal): src/features/client-agent/server.ts
- Imports (packages): next/server
- Imported by: src/app/api/client/[slug]/agent/threads/route.test.ts
- Depends on groups: src/features / client-agent
- Used by groups: src/app / api
- Tests related: src/app/api/client/[slug]/agent/threads/route.test.ts
- Tests related (direct): src/app/api/client/[slug]/agent/threads/route.test.ts
- Exports: GET, POST
- Symbol details: function GET (exported), function POST (exported), type RouteContext
- Defines: GET, POST, result, RouteContext
- Route handlers: GET, POST
- Contents summary: Next.js route handler for `/api/client/[slug]/agent/threads`; route handlers: GET, POST; exports: GET, POST; internal imports: 1; package imports: 1

## `src/app/api/contact/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/contact
- Lines: 84
- Bytes: 2435
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Imports (packages): next/server, resend
- Depends on groups: src/lib
- Exports: POST
- Symbol details: function POST (exported), function withLabel, const resend, const contactRecipient
- Defines: withLabel, POST, resend, contactRecipient, trimmed, fullMessage
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## `src/app/api/event-comments/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/event-comments
- Lines: 258
- Bytes: 7536
- Imports (internal): src/features/event-comments/server.ts, src/app/api/event-comments/route.ts, src/lib/api-helpers.ts, src/lib/supabase.ts, src/features/events/server.ts, src/features/client-portal/scope.ts, src/features/notifications/discussions.ts, src/features/system-events/server.ts, src/lib/agent-dispatch.ts, src/features/workflow/revalidation.ts
- Imports (packages): next/server, vitest, @clerk/nextjs/server
- Depends on groups: src-features-event-comments, src/app / api, src/lib, src/features / events, src/features / client-portal, src/features / notifications, src/features / system-events, src/features / workflow
- Symbol details: function makeGetRequest
- Defines: makeGetRequest, actual, query, response
- Tests / describe labels: event comments route, reads client event comment GETs through the Clerk-scoped client, does not fall back to the service role for non-admin event comment GETs when the Clerk-scoped client is unavailable, keeps admin event comment GETs on the service role, lets admins resolve an event request thread
- Contents summary: tests/describes: event comments route; reads client event comment GETs through the Clerk-scoped client; does not fall back to the service role for non-admin event comment GETs when the Clerk-scoped client is unavailable; internal imports: 10; package imports: 3

## `src/app/api/event-comments/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET, POST, PATCH
- Route: /api/event-comments
- Lines: 314
- Bytes: 9857
- Imports (internal): src/lib/api-helpers.ts, src/lib/api-schemas.ts, src/lib/text-utils.ts, src/lib/agent-dispatch.ts, src/lib/supabase.ts, src/features/event-comments/server.ts, src/features/events/server.ts, src/features/notifications/discussions.ts, src/features/client-portal/scope.ts, src/features/system-events/server.ts, … (+1 more)
- Imports (packages): next/server, @clerk/nextjs/server, zod/v4
- Imported by: src/app/api/event-comments/route.test.ts
- Depends on groups: src/lib, src-features-event-comments, src/features / events, src/features / notifications, src/features / client-portal, src/features / system-events, src/features / workflow
- Used by groups: src/app / api
- Tests related: src/app/api/event-comments/route.test.ts
- Tests related (direct): src/app/api/event-comments/route.test.ts
- Exports: GET, POST, PATCH
- Symbol details: function GET (exported), function POST (exported), function PATCH (exported), function eventCommentTriagePrompt, const CreateScopedEventCommentSchema
- Defines: eventCommentTriagePrompt, GET, POST, PATCH, CreateScopedEventCommentSchema, eventId, clientSlug, access, event, commentsDb, user, authorName, … (+5 more)
- Route handlers: GET, POST, PATCH
- Contents summary: Next.js route handler for `/api/event-comments`; route handlers: GET, POST, PATCH; exports: GET, POST, PATCH; internal imports: 11; package imports: 3

## `src/app/api/health/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/health
- Lines: 35
- Bytes: 1131
- Imports (internal): src/app/api/health/route.ts
- Imports (packages): vitest
- Depends on groups: src/app / api
- Defines: response, body, parsed, before, after, ts
- Tests / describe labels: GET /api/health, returns 200 with status, timestamp, and version, returns a recent timestamp, returns Content-Type application/json
- Contents summary: tests/describes: GET /api/health; returns 200 with status, timestamp, and version; returns a recent timestamp; internal imports: 1; package imports: 1

## `src/app/api/health/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/health
- Lines: 11
- Bytes: 250
- Imports (internal): package.json
- Imports (packages): next/server
- Imported by: src/app/api/health/route.test.ts
- Depends on groups: Root Files
- Used by groups: src/app / api
- Tests related: src/app/api/health/route.test.ts
- Tests related (direct): src/app/api/health/route.test.ts
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 1; package imports: 1

## `src/app/api/ingest/ingest-meta-campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: TypeScript module
- Construction: code module
- Route context: /api/ingest
- Lines: 89
- Bytes: 2953
- Imports (internal): src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Imports (packages): next/server
- Imported by: src/app/api/ingest/route.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Route owners: src/app/api/ingest/route.ts
- Routes related (direct): src/app/api/ingest/route.ts
- Tests related: __tests__/api/ingest.test.ts
- Exports: ingestMetaCampaigns
- Symbol details: function ingestMetaCampaigns (exported)
- Defines: ingestMetaCampaigns, campaigns, rows, snapshots, incomingIds, incomingSet, stale, staleIds
- Contents summary: exports: ingestMetaCampaigns; internal imports: 3; package imports: 1

## `src/app/api/ingest/ingest-tm-demographics.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: TypeScript module
- Construction: code module
- Route context: /api/ingest
- Lines: 24
- Bytes: 739
- Imports (internal): src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Imports (packages): next/server
- Imported by: src/app/api/ingest/route.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Route owners: src/app/api/ingest/route.ts
- Routes related (direct): src/app/api/ingest/route.ts
- Tests related: __tests__/api/ingest.test.ts
- Exports: ingestTmDemographics
- Symbol details: function ingestTmDemographics (exported)
- Defines: ingestTmDemographics, rows
- Contents summary: exports: ingestTmDemographics; internal imports: 3; package imports: 1

## `src/app/api/ingest/ingest-tm-events.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: TypeScript module
- Construction: code module
- Route context: /api/ingest
- Lines: 99
- Bytes: 3999
- Imports (internal): src/lib/supabase.ts, src/lib/api-helpers.ts, src/lib/api-schemas.ts
- Imports (packages): next/server
- Imported by: src/app/api/ingest/route.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Route owners: src/app/api/ingest/route.ts
- Routes related (direct): src/app/api/ingest/route.ts
- Tests related: __tests__/api/ingest.test.ts
- Exports: ingestTmEvents
- Symbol details: function ingestTmEvents (exported)
- Defines: ingestTmEvents, events, rows, base, freshSnapshots, tmIdsWithFreshData, tmIdsNeedingFallback, snapshots
- Contents summary: exports: ingestTmEvents; internal imports: 3; package imports: 1

## `src/app/api/ingest/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST, GET
- Route: /api/ingest
- Lines: 38
- Bytes: 1438
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-tm-events.ts, src/app/api/ingest/ingest-meta-campaigns.ts, src/app/api/ingest/ingest-tm-demographics.ts
- Imports (packages): next/server
- Imported by: __tests__/api/ingest.test.ts
- Depends on groups: src/lib, src/app / api
- Used by groups: Tests / API
- Tests related: __tests__/api/ingest.test.ts
- Tests related (direct): __tests__/api/ingest.test.ts
- Exports: POST, GET
- Symbol details: function POST (exported), function GET (exported)
- Defines: POST, GET, secretErr
- Route handlers: POST, GET
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 6; package imports: 1

## `src/app/api/meta/callback/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/meta/callback
- Lines: 40
- Bytes: 1498
- Imports (internal): src/app/api/meta/callback/route.ts
- Imports (packages): vitest
- Depends on groups: src/app / api
- Defines: request, response, location
- Tests / describe labels: GET /api/meta/callback, redirects to error page when error param present, redirects to error page when missing code, redirects completed callbacks to the retired-flow message
- Contents summary: tests/describes: GET /api/meta/callback; redirects to error page when error param present; redirects to error page when missing code; internal imports: 1; package imports: 1

## `src/app/api/meta/callback/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/meta/callback
- Lines: 26
- Bytes: 780
- Imports (packages): next/server
- Imported by: src/app/api/meta/callback/route.test.ts
- Used by groups: src/app / api
- Tests related: src/app/api/meta/callback/route.test.ts
- Tests related (direct): src/app/api/meta/callback/route.test.ts
- Exports: GET
- Symbol details: function GET (exported)
- Defines: GET, url, error, appUrl, errorDesc
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/meta/callback`; route handlers: GET; exports: GET; package imports: 1

## `src/app/api/meta/data-deletion/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/meta/data-deletion
- Lines: 65
- Bytes: 1887
- Imports (internal): src/app/api/meta/data-deletion/route.ts, src/lib/supabase.ts
- Imports (packages): vitest, node:crypto
- Depends on groups: src/app / api, src/lib
- Defines: payload, encodedPayload, sig, encodedSig, signedRequest, formData, request, response, body
- Tests / describe labels: POST /api/meta/data-deletion, returns confirmation code for valid signed_request, rejects invalid signature
- Contents summary: tests/describes: POST /api/meta/data-deletion; returns confirmation code for valid signed_request; rejects invalid signature; internal imports: 2; package imports: 2

## `src/app/api/meta/data-deletion/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/meta/data-deletion
- Lines: 44
- Bytes: 1264
- Imports (internal): src/lib/supabase.ts, src/lib/meta-oauth.ts
- Imports (packages): next/server, node:crypto
- Imported by: src/app/api/meta/data-deletion/route.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/meta/data-deletion/route.test.ts
- Tests related (direct): src/app/api/meta/data-deletion/route.test.ts
- Exports: POST
- Symbol details: function POST (exported)
- Defines: POST, appUrl, formData, confirmationCode
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `src/app/api/ticketmaster/tm1/move-selection/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/ticketmaster/tm1/move-selection
- Lines: 103
- Bytes: 3091
- Imports (internal): src/app/api/ticketmaster/tm1/move-selection/route.ts, src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/lib, src/lib / ticketmaster
- Defines: response
- Tests / describe labels: POST /api/ticketmaster/tm1/move-selection, allows ingest-secret callers and returns the move-selection result, rejects requests without a secret or admin session
- Contents summary: tests/describes: POST /api/ticketmaster/tm1/move-selection; allows ingest-secret callers and returns the move-selection result; rejects requests without a secret or admin session; internal imports: 3; package imports: 1

## `src/app/api/ticketmaster/tm1/move-selection/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/ticketmaster/tm1/move-selection
- Lines: 141
- Bytes: 4316
- Imports (internal): src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): next/server, zod
- Imported by: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Depends on groups: src/lib, src/lib / ticketmaster
- Used by groups: src/app / api
- Tests related: src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Tests related (direct): src/app/api/ticketmaster/tm1/move-selection/route.test.ts
- Exports: POST
- Symbol details: function POST (exported), function guard, const StringIdSchema, const PlaceSelectionSchema, const RowSelectionSchema, const ReservedSectionSelectionSchema, const PartialGaSelectionSchema, const FullGaSelectionSchema, const BackendSelectionSchema, const SuccessActionSchema, const MoveTargetSchema, const BodySchema
- Defines: guard, POST, StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, SuccessActionSchema, MoveTargetSchema, BodySchema, … (+10 more)
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/ticketmaster/tm1/request-move-selection
- Lines: 154
- Bytes: 4708
- Imports (internal): src/app/api/ticketmaster/tm1/request-move-selection/route.ts, src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/lib, src/lib / ticketmaster
- Defines: response
- Tests / describe labels: POST /api/ticketmaster/tm1/request-move-selection, creates a TM1 collaboration move request for secret callers, optionally resolves the created request in the same call, rejects requests without a secret or admin session
- Contents summary: tests/describes: POST /api/ticketmaster/tm1/request-move-selection; creates a TM1 collaboration move request for secret callers; optionally resolves the created request in the same call; internal imports: 3; package imports: 1

## `src/app/api/ticketmaster/tm1/request-move-selection/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/ticketmaster/tm1/request-move-selection
- Lines: 147
- Bytes: 4462
- Imports (internal): src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): next/server, zod
- Imported by: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Depends on groups: src/lib, src/lib / ticketmaster
- Used by groups: src/app / api
- Tests related: src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Tests related (direct): src/app/api/ticketmaster/tm1/request-move-selection/route.test.ts
- Exports: POST
- Symbol details: function POST (exported), function guard, const StringIdSchema, const PlaceSelectionSchema, const RowSelectionSchema, const ReservedSectionSelectionSchema, const PartialGaSelectionSchema, const FullGaSelectionSchema, const BackendSelectionSchema, const AllocationTargetSchema, const ResolutionStatusSchema, const BodySchema
- Defines: guard, POST, StringIdSchema, PlaceSelectionSchema, RowSelectionSchema, ReservedSectionSelectionSchema, PartialGaSelectionSchema, FullGaSelectionSchema, BackendSelectionSchema, AllocationTargetSchema, ResolutionStatusSchema, BodySchema, … (+11 more)
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/request-move-selection`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## `src/app/api/ticketmaster/tm1/snapshot/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/ticketmaster/tm1/snapshot
- Lines: 69
- Bytes: 2175
- Imports (internal): src/app/api/ticketmaster/tm1/snapshot/route.ts, src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/lib, src/lib / ticketmaster
- Defines: response
- Tests / describe labels: GET /api/ticketmaster/tm1/snapshot, allows ingest-secret callers and returns a normalized snapshot, rejects requests without a secret or admin session
- Contents summary: tests/describes: GET /api/ticketmaster/tm1/snapshot; allows ingest-secret callers and returns a normalized snapshot; rejects requests without a secret or admin session; internal imports: 3; package imports: 1

## `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: GET
- Route: /api/ticketmaster/tm1/snapshot
- Lines: 87
- Bytes: 3011
- Imports (internal): src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Imports (packages): next/server, zod
- Imported by: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Depends on groups: src/lib, src/lib / ticketmaster
- Used by groups: src/app / api
- Tests related: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Tests related (direct): src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Exports: GET
- Symbol details: function GET (exported), function wantsRaw, function guard, const QuerySchema
- Defines: wantsRaw, guard, GET, QuerySchema, url, authHeader, bearer, secret, secretErr, authErr, parsed, client, … (+1 more)
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/snapshot`; route handlers: GET; exports: GET; internal imports: 2; package imports: 2

## `src/app/api/user/profile/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/user/profile
- Lines: 34
- Bytes: 945
- Imports (internal): src/lib/api-helpers.ts
- Imports (packages): next/server, @clerk/nextjs/server, zod
- Depends on groups: src/lib
- Exports: POST
- Symbol details: function POST (exported), const ProfileSchema
- Defines: POST, ProfileSchema, raw, parsed, client
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3
