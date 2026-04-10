# /api/ticketmaster/tm1/snapshot

Generated from the current working tree on 2026-04-10 17:55:29.

- Route file: `src/app/api/ticketmaster/tm1/snapshot/route.ts`
- Type: Next.js route handler
- Ownership: web API route surface
- Methods: GET
- Auth signals: none
- Behavior signals: none
- Direct internal imports: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Feature modules touched: none
- Shared libs/runtime touched: src/lib/api-helpers.ts, src/lib/ticketmaster/tm1-client.ts
- Database objects touched: calls
- Direct tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- All linked tests: src/app/api/ticketmaster/tm1/snapshot/route.test.ts
- Contents summary: Next.js route handler for `/api/ticketmaster/tm1/snapshot`; route handlers: GET; exports: GET; internal imports: 2; package imports: 2

## Stack by group
- src/lib: src/lib/api-helpers.ts
- src/lib / ticketmaster: src/lib/ticketmaster/tm1-client.ts

## API behavior
- Request signals: reads headers, reads query/search params
- Response signals: uses NextResponse.json, uses Response.json, explicit statuses: 400
- Validation symbols: QuerySchema, parsed
