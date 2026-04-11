# /api/alerts

Generated from the current working tree on 2026-04-10 22:05:59.

- Route file: `src/app/api/alerts/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST, PATCH, GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Database objects touched: agent_alerts
- Direct tests: __tests__/api/alerts.test.ts
- All linked tests: __tests__/api/alerts.test.ts
- Contents summary: Next.js route handler for `/api/alerts`; route handlers: POST, PATCH, GET; exports: POST, PATCH, GET; internal imports: 3; package imports: 1

## Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## API behavior
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
