# /api/contact

Generated from the current working tree on 2026-04-28 03:23:46.

- Route file: `src/app/api/contact/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/request-guards.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/request-guards.ts
- Database objects touched: contact_submissions, if
- Direct tests: src/app/api/contact/route.test.ts
- All linked tests: src/app/api/contact/route.test.ts
- Contents summary: Next.js route handler for `/api/contact`; route handlers: POST; exports: POST; internal imports: 4; package imports: 1

## Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/request-guards.ts

## API behavior
- Request signals: reads headers
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
