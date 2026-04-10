# /api/agents/heartbeat

Generated from the current working tree on 2026-04-10 16:45:57.

- Route file: `src/app/api/agents/heartbeat/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Database objects touched: agent_runtime_state
- Direct tests: __tests__/api/agents-heartbeat.test.ts
- All linked tests: __tests__/api/agents-heartbeat.test.ts
- Contents summary: Next.js route handler for `/api/agents/heartbeat`; route handlers: POST; exports: POST; internal imports: 3; package imports: 1

## Stack by group
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 503, 500
- Validation symbols: parsed
