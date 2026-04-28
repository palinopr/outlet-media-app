# /api/ingest

Generated from the current working tree on 2026-04-28 02:30:43.

- Route file: `src/app/api/ingest/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: POST, GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts, src/app/api/ingest/ingest-meta-campaigns.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts
- Database objects touched: if, meta_campaigns, campaign_snapshots
- Direct tests: __tests__/api/ingest.test.ts
- All linked tests: __tests__/api/ingest.test.ts
- Contents summary: Next.js route handler for `/api/ingest`; route handlers: POST, GET; exports: POST, GET; internal imports: 4; package imports: 1

## Stack by group
- src/app / api: src/app/api/ingest/ingest-meta-campaigns.ts
- src/lib: src/lib/supabase.ts, src/lib/api-schemas.ts, src/lib/api-helpers.ts

## API behavior
- Request signals: reads query/search params
- Response signals: uses NextResponse.json, uses Response.json
- Validation symbols: none
