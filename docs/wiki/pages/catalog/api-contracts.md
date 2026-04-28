# API Contract Map

Generated from the current working tree on 2026-04-28 02:32:49.

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
- Related tests: src/app/api/admin/users/[id]/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

## `/api/contact`
- Route file: `src/app/api/contact/route.ts`
- Methods: POST
- Request signals: reads headers
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: src/app/api/contact/route.test.ts
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

## `/api/health`
- Route file: `src/app/api/health/route.ts`
- Methods: GET
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: package.json, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts
- Related tests: src/app/api/health/route.test.ts
- Contents summary: Next.js route handler for `/api/health`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## `/api/ingest`
- Route file: `src/app/api/ingest/route.ts`
- Methods: POST, GET
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: none
- Validation symbols: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-meta-campaigns.ts
- Feature modules touched: none
- Shared libs touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Related tests: __tests__/api/ingest.test.ts
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 4; package imports: 1

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

## `/api/observability/client-error`
- Route file: `src/app/api/observability/client-error/route.ts`
- Methods: POST
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Auth signals: imports Clerk server auth, calls currentUser()
- Validation symbols: ClientErrorSchema
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Related tests: src/app/api/observability/client-error/route.test.ts
- Contents summary: Next.js route handler for `/api/observability/client-error`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

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
