# /api/agents/job/[id]

Generated from the current working tree on 2026-04-10 16:52:39.

- Route file: `src/app/api/agents/job/[id]/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/agent-jobs.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts
- Database objects touched: agent_tasks, agent_runtime_state
- Direct tests: none
- All linked tests: none
- Contents summary: Next.js route handler for `/api/agents/job/[id]`; route handlers: GET; exports: GET; internal imports: 2; package imports: 1

## Stack by group
- src/lib: src/lib/api-helpers.ts, src/lib/agent-jobs.ts, src/lib/supabase.ts

## API behavior
- Request signals: uses route params/context params
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
