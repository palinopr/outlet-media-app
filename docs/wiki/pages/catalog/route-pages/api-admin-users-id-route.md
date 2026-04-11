# /api/admin/users/[id]

Generated from the current working tree on 2026-04-10 21:27:09.

- Route file: `src/app/api/admin/users/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: PATCH
- Auth signals: references membership/scope access concepts
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Database objects touched: clients, client_members
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js route handler for `/api/admin/users/[id]`; route handlers: PATCH; exports: PATCH; internal imports: 2; package imports: 2

## Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## API behavior
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: UpdateUserSchema
