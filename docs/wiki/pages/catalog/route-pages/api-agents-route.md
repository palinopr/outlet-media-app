# /api/agents

Generated from the current working tree on 2026-04-10 16:45:57.

- Route file: `src/app/api/agents/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST, GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/features/system-events/server.ts, src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: system-events
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Database objects touched: agent_tasks, system_events, agent_runtime_state
- Direct tests: __tests__/api/agents.test.ts
- All linked tests: __tests__/api/agents.test.ts
- Contents summary: Next.js route handler for `/api/agents`; route handlers: POST, GET; exports: POST, GET; internal imports: 5; package imports: 2

## Stack by group
- src/features / system-events: src/features/system-events/server.ts
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/lib/agent-jobs.ts

## API behavior
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Validation symbols: parsed
