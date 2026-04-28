# src/app / api

Generated from the current working tree on 2026-04-28 02:57:59.

- Files: 18
- File kinds: Next.js route handler (10), test file (7), TypeScript module (1)

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

## `src/app/api/admin/users/[id]/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/admin/users/[id]
- Lines: 119
- Bytes: 3130
- Imports (internal): src/lib/api-helpers.ts, src/app/api/admin/users/[id]/route.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/lib, src/app / api
- Defines: clientsQuery, clientMembersQuery, state, supabaseAdmin, actual, response
- Tests / describe labels: PATCH /api/admin/users/[id], does not recreate an existing membership when adding client access, inserts a membership when adding a new client assignment
- Contents summary: tests/describes: PATCH /api/admin/users/[id]; does not recreate an existing membership when adding client access; inserts a membership when adding a new client assignment; internal imports: 3; package imports: 1

## `src/app/api/admin/users/[id]/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: PATCH
- Route: /api/admin/users/[id]
- Lines: 87
- Bytes: 2394
- Imports (internal): src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): next/server, zod
- Imported by: src/app/api/admin/users/[id]/route.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/admin/users/[id]/route.test.ts
- Tests related (direct): src/app/api/admin/users/[id]/route.test.ts
- Exports: PATCH
- Symbol details: function PATCH (exported), const UpdateUserSchema
- Defines: PATCH, UpdateUserSchema, adminErr, id, remainingSlugs
- Route handlers: PATCH
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

## `src/app/api/contact/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/contact
- Lines: 80
- Bytes: 2500
- Imports (internal): src/app/api/contact/route.ts, src/lib/supabase.ts
- Imports (packages): vitest
- Depends on groups: src/app / api, src/lib
- Defines: insert, from, response
- Tests / describe labels: POST /api/contact, stores the contact submission and sends email through Resend HTTP API, does not call Resend when the API key is not configured
- Contents summary: tests/describes: POST /api/contact; stores the contact submission and sends email through Resend HTTP API; does not call Resend when the API key is not configured; internal imports: 2; package imports: 1

## `src/app/api/contact/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/contact
- Lines: 119
- Bytes: 3257
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Imports (packages): next/server
- Imported by: src/app/api/contact/route.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/contact/route.test.ts
- Tests related (direct): src/app/api/contact/route.test.ts
- Exports: POST
- Symbol details: function POST (exported), function withLabel, function sendContactEmail, const contactRecipient
- Defines: withLabel, sendContactEmail, POST, contactRecipient, trimmed, apiKey, response, body, fullMessage
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

## `src/app/api/health/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/health
- Lines: 36
- Bytes: 1196
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
- Lines: 29
- Bytes: 771
- Imports (internal): package.json, src/lib/supabase.ts
- Imports (packages): next/server
- Imported by: src/app/api/health/route.test.ts
- Depends on groups: Root Files, src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/health/route.test.ts
- Tests related (direct): src/app/api/health/route.test.ts
- Exports: GET
- Symbol details: function GET (exported), function getDatabaseHealth
- Defines: getDatabaseHealth, GET, database
- Route handlers: GET
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `src/app/api/ingest/ingest-meta-campaigns.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: TypeScript module
- Construction: code module
- Route context: /api/ingest
- Lines: 89
- Bytes: 2959
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

## `src/app/api/ingest/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST, GET
- Route: /api/ingest
- Lines: 34
- Bytes: 1134
- Imports (internal): src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-meta-campaigns.ts
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
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 4; package imports: 1

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

## `src/app/api/observability/client-error/route.test.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: test file
- Construction: test specification
- Route context: /api/observability/client-error
- Lines: 88
- Bytes: 2503
- Imports (internal): src/lib/api-helpers.ts, src/app/api/observability/client-error/route.ts, src/lib/supabase.ts
- Imports (packages): vitest, @clerk/nextjs/server
- Depends on groups: src/lib, src/app / api
- Symbol details: function makeRequest, const insert, const authGuard, const currentUser
- Defines: makeRequest, insert, authGuard, currentUser, actual, response, body
- Tests / describe labels: POST /api/observability/client-error, records a sanitized authenticated client error, requires authentication, rejects malformed payloads
- Contents summary: tests/describes: POST /api/observability/client-error; records a sanitized authenticated client error; requires authentication; internal imports: 3; package imports: 2

## `src/app/api/observability/client-error/route.ts`
- Status: tracked-clean
- System: web
- Group: src/app / api
- Ownership: web API route surface
- Type: Next.js route handler
- Construction: App Router route handler, code module, handlers: POST
- Route: /api/observability/client-error
- Lines: 56
- Bytes: 1908
- Imports (internal): src/lib/api-helpers.ts, src/lib/supabase.ts
- Imports (packages): next/server, @clerk/nextjs/server, zod
- Imported by: src/app/api/observability/client-error/route.test.ts
- Depends on groups: src/lib
- Used by groups: src/app / api
- Tests related: src/app/api/observability/client-error/route.test.ts
- Tests related (direct): src/app/api/observability/client-error/route.test.ts
- Exports: POST
- Symbol details: function POST (exported), function scrub, const ClientErrorSchema
- Defines: scrub, POST, ClientErrorSchema, user
- Route handlers: POST
- Contents summary: Next.js route handler for `/api/observability/client-error`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

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
