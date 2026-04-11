# /api/meta/data-deletion

Generated from the current working tree on 2026-04-10 21:51:44.

- Route file: `src/app/api/meta/data-deletion/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/meta-oauth.ts
- Database objects touched: client_accounts
- Direct tests: src/app/api/meta/data-deletion/route.test.ts
- All linked tests: src/app/api/meta/data-deletion/route.test.ts
- Contents summary: Next.js route handler for `/api/meta/data-deletion`; route handlers: POST; exports: POST; internal imports: 2; package imports: 2

## Stack by group
- src/lib: src/lib/supabase.ts, src/lib/meta-oauth.ts

## API behavior
- Request signals: reads form-data body
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400, 403, 503
- Validation symbols: none
