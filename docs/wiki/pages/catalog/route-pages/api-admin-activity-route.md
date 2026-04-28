# /api/admin/activity

Generated from the current working tree on 2026-04-28 03:23:46.

- Route file: `src/app/api/admin/activity/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: imports Clerk server auth, calls currentUser()
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/supabase.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/supabase.ts
- Database objects touched: admin_activity, if
- Direct tests: src/app/api/admin/activity/route.test.ts
- All linked tests: src/app/api/admin/activity/route.test.ts
- Contents summary: Next.js route handler for `/api/admin/activity`; route handlers: POST; exports: POST; internal imports: 2; package imports: 3

## Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/supabase.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 503
- Validation symbols: ActivitySchema
