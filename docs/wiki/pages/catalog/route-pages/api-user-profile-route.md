# /api/user/profile

Generated from the current working tree on 2026-04-28 02:31:12.

- Route file: `src/app/api/user/profile/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: imports Clerk server auth
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts
- Database objects touched: if
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js route handler for `/api/user/profile`; route handlers: POST; exports: POST; internal imports: 1; package imports: 3

## Stack by group
- src/lib: src/lib/api-helpers.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Validation symbols: ProfileSchema, parsed
