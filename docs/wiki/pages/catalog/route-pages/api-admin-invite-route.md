# /api/admin/invite

Generated from the current working tree on 2026-04-10 15:42:38.

- Route file: `src/app/api/admin/invite/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Direct internal imports: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts
- Database objects touched: clients, client_access_invites
- Direct tests: src/app/api/admin/invite/route.test.ts
- All linked tests: src/app/api/admin/invite/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/invite`; route handlers: POST; exports: POST; internal imports: 3; package imports: 2

## Stack by group
- src/lib: src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/supabase.ts

## API behavior
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 500, 400
- Validation symbols: none
