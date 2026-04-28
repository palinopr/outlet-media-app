# /api/meta/data-deletion

Generated from the current working tree on 2026-04-28 03:23:46.

- Route file: `src/app/api/meta/data-deletion/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/meta-oauth.ts, src/lib/request-guards.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/meta-oauth.ts, src/lib/request-guards.ts, src/lib/api-helpers.ts
- Database objects touched: client_accounts, if
- Direct tests: src/app/api/meta/data-deletion/route.test.ts
- All linked tests: src/app/api/meta/data-deletion/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## Stack by group
- src/lib: src/lib/supabase.ts, src/lib/meta-oauth.ts, src/lib/request-guards.ts, src/lib/api-helpers.ts

## API behavior
- Request signals: reads form-data body
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400, 403, 503
- Validation symbols: none
