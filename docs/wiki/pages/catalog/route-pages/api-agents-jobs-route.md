# /api/agents/jobs

Generated from the current working tree on 2026-04-10 17:55:29.

- Route file: `src/app/api/agents/jobs/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Database objects touched: agent_tasks, agent_runtime_state
- Direct tests: __tests__/api/agents-jobs.test.ts
- All linked tests: __tests__/api/agents-jobs.test.ts
- Contents summary: Next.js route handler for `/api/agents/jobs`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts

## API behavior
- Request signals: none
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
