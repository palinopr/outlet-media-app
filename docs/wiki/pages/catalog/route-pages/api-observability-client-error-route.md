# /api/observability/client-error

Generated from the current working tree on 2026-04-28 02:31:12.

- Route file: `src/app/api/observability/client-error/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Database objects touched: if, application_errors
- Direct tests: src/app/api/observability/client-error/route.test.ts
- All linked tests: src/app/api/observability/client-error/route.test.ts
- Contents summary: Next.js route handler for `/api/observability/client-error`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

## Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: ClientErrorSchema
